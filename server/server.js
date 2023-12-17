const mongoose = require('mongoose');
const express = require("express");
const path = require("path");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {cors: {origin: "*"}});
const Message = require('./models/message');
const { log } = require('console');

require('dotenv').config()

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Database connected')
}).catch(err => console.log(err))

app.use(cors({
	origin: 'http://localhost:5173',
	methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
	credentials: true
  }));

app.use(cookieParser());
app.use(express.json());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	next();
  });

app.use(express.static(__dirname + '/public', {
	extensions: ['html']
}));

app.use("/", require("./routes/user"));
app.use("/", require("./routes/privateChat"));
app.use("/", require("./routes/message"));

var users = []

io.on("connection", function(socket){

	socket.on("userjoined", async function(data){
		try {
			// console.log(data.chatId + users[data.sender._id])
			users[data.sender._id] = socket.id;
			socket.join(data.chatId + users[data.sender._id]);

			const chatId = data.chatId;
		
			const messages = await Message.find({ chat: chatId}).sort({ timestamp: -1 });
			// socket.broadcast.emit("update", data._id + " joined the conversation");
			
			io.to(data.chatId + users[data.sender._id]).emit("setup-chat", messages);
		} catch (err){
			console.log("Erro: " + err)
		}
	
	});

	socket.on("exituser",function(username){
		socket.broadcast.emit("update", username + " left the conversation");
	});
	
	socket.on("chat",async function(data){
		// socket.broadcast.emit("chat", message);
		try {
			const message = new Message({
				chat: data.room,
				sender: data.sender,
				content: data.content
			});
			
			message.save().then(() => {
				io.to(data.room + users[data.receiver]).emit("chat", data);
			})
		} catch (err) {
			console.log("Erro: " + err)		
		}
			
	});

	socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));
	socket.on('reply', () => { console.log("a reply detected!")}); // listen to the event
});

server.listen(3000, () => {
	console.log('Server listening on port 3000');
});
  

