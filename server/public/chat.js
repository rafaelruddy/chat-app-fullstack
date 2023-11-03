(async function(){

const app = document.querySelector(".message-app");
const urlSearch = new URLSearchParams(window.location.search)
const chatRoom = urlSearch.get("id");
const socket = io();
const message = app.querySelector(".chat-screen #message-input");


const token = localStorage.getItem('token');
	
if (!token) {
    window.location.href = '/login.html';
}

let participantsInfo = await getInfoFromChat(chatRoom)

socket.emit("userjoined", participantsInfo );


socket.on("update",function(update){
    renderMessage("update",update);
});

socket.on("chat",function(message){
    renderMessage("other", message);
});

socket.on("history-messages",function(messages){
    // renderMessage("other", message);
    messages.forEach(message => {
        
        let date = new Date(message.timestamp);
        let timestamp = date.getTime();
        const seconds = Math.floor(timestamp / 1000);
        const oldTimestamp = seconds - 86400;
        const difference = seconds - oldTimestamp;
        let output = ``;
        if (difference < 60) {
            // Less than a minute has passed:
            output = `${difference} segundos atrás`;
        } else if (difference < 3600) {
            // Less than an hour has passed:
            output = `${Math.floor(difference / 60)} minutos atrás`;
        } else if (difference < 86400) {
            // Less than a day has passed:
            output = `${Math.floor(difference / 3600)} horas atrás`;
        } else if (difference < 2620800) {
            // Less than a month has passed:
            output = `${Math.floor(difference / 86400)} dias atrás`;
        } else if (difference < 31449600) {
            // Less than a year has passed:
            output = `${Math.floor(difference / 2620800)} meses atrás`;
        } else {
            // More than a year has passed:
            output = `${Math.floor(difference / 31449600)} anos atrás`;
        }
        // console.log(output);

        if(message.sender == participantsInfo.sender._id) { 
            renderMessage("my",{
                name: participantsInfo.sender.name,
                content: message.content
            });
        } else {
            renderMessage("other", {
                name: participantsInfo.receiver.name,
                content: message.content,
                timestamp: output
            });
        }
    });
    // console.log(message)
});


app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
    let messageInput = message.value;
    if(messageInput.length  == 0){
        return;
    }
    
    renderMessage("my",{
        name: participantsInfo.sender.name,
        content: messageInput
    });

    console.log(participantsInfo)
    socket.emit("chat",{
        room: chatRoom,
        sender: participantsInfo.sender._id,
        receiver: participantsInfo.receiver._id,
        name: participantsInfo.sender.name,
        content: messageInput
    });
    app.querySelector(".chat-screen #message-input").value = "";
});

app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
    socket.emit("exituser",uname);
    window.location.href = window.location.href;
});

function renderMessage(type,message){
    let messageContainer = app.querySelector(".chat-screen .messages");
    let el = document.createElement("div");
    switch(type) {
        case "my":
            el.setAttribute("class","message my-message");
            el.innerHTML = `
                <div class="green">
                    <div class="text">${message.content}</div>
                </div>
            `;
            messageContainer.appendChild(el);
            break;
        case "other":
            el.setAttribute("class","message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.name}</div>
                    <div class="text">${message.content}</div>
                    <div class="timestamp">${message.timestamp}</div>
                </div>
            `;
            messageContainer.appendChild(el);
            break;
        case "update":
            el.setAttribute("class","update");
            el.innerText = message;
            messageContainer.appendChild(el);
            break;
    }
    // scroll chat to end
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
}

function renderContact(data) {
    $(".sidebar ul").append(`
        <li class="contact">
            <img src="mamaco.jpeg" alt="Image" srcset="">
            <h1>${data.name}</h1>
        </li>
    `)
}

async function getInfoFromChat(chatId) {
    const response = await fetch(`http://localhost:3000/chat/private/getInfo/${chatId}`, {
	  headers: {
		Authorization: `Bearer ${token}`
	  }
	});

	if (response.ok) {
	  const data = await response.json();
      return data
	} else {
	  const data = await response.json();
	  alert(`Erro ao carregar a lista de usuários: ${data.message}`);
	}
}

async function getContacts() {
    const response = await fetch(`http://localhost:3000/chat/private/getAll`, {
	  headers: {
		Authorization: `Bearer ${token}`
	  }
	});

	if (response.ok) {
        const data = await response.json();
        data.forEach(contact => {
            console.log(contact)        
            renderContact(contact.receiver)
        })
	} else {
	  const data = await response.json();
	  alert(`Erro ao carregar a lista de usuários: ${data.message}`);
	}
}

await getContacts()

})();
