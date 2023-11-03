// $(function () {
//     $(".heading-compose").click(function () {
//         $(".side-two").css({
//             "left": "0"
//         });
//     });

//     $(".newMessage-back").click(function () {
//         $(".side-two").css({
//             "left": "-100%"
//         });
//     });
// })

const start = async function () {

    const app = document.querySelector(".app");
    const urlSearch = new URLSearchParams(window.location.search)
    const chatRoom = urlSearch.get("id");
    const socket = io();
    let participantsInfo = null

    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
    }

    if(chatRoom) {
        participantsInfo = await getInfoFromChat(chatRoom)
        socket.emit("userjoined", participantsInfo);
    }
   


    socket.on("update", function (update) {
        renderMessage("update", update);
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    socket.on("setup-chat", function (messages) {
        // console.log(messages)
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

            

            if (message.sender == participantsInfo.sender._id) {
                renderMessage("my", {
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

            $(".name-title").html(participantsInfo.receiver.name)

        });
        // console.log(message)
    });


    app.querySelector("#reply-send").addEventListener("click", function () {
        let messageInput = app.querySelector("#comment").value;

        if (messageInput.length == 0) {
            return;
        }

        renderMessage("my", {
            content: messageInput
        });

        // console.log(participantsInfo)
        socket.emit("chat", {
            room: chatRoom,
            sender: participantsInfo.sender._id,
            receiver: participantsInfo.receiver._id,
            content: messageInput
        });
        app.querySelector("#comment").value = "";
    });


    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-messages");
        let el = document.createElement("div");
        switch (type) {
            case "my":
                el.setAttribute("class", "chat-message-right mb-2");
                el.innerHTML = `
                    
                    <div>
                        <div class="text-muted small text-nowrap mt-2">
                            2:35 am
                        </div>
                    </div>
                    <div class="flex-shrink-1 rounded py-2 px-3 mr-3">
                        <div class="font-weight-bold mb-1">You</div>
                        ${message.content}
                    </div>
                    
              `;
                messageContainer.appendChild(el);
                break;
            case "other":
                el.setAttribute("class", "chat-message-left mb-2");
                el.innerHTML = `
                        
                    <div>
                        <div class="text-muted small text-nowrap mt-2">
                            2:34 am
                        </div>
                    </div>
                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                    <div class="font-weight-bold mb-1"> ${participantsInfo.receiver.name}</div>
                        ${message.content}
                    </div>
                    
                   
              `;
                messageContainer.appendChild(el);
                break;
            case "update":
                el.setAttribute("class", "update");
                el.innerText = message;
                messageContainer.appendChild(el);
                break;
        }
        // scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    function renderContact(data) {

        if(data._id == urlSearch.get("id")) {
            $("#sidebar").append(`
                <a
                href="#"
                class="list-group-item list-group-item-action border-0 selected-contact"
                >
                <div class="badge bg-success float-right">5</div>
                <div class="d-flex align-items-start">
                <img
                    src="https://bootdey.com/img/Content/avatar/avatar5.png"
                    class="rounded-circle mr-1"
                    alt="${data.receiver.name}"
                    width="40"
                    height="40"
                />
                <div class="flex-grow-1 ml-3">
                    ${data.receiver.name}
                    <div class="small">
                    <span class="fas fa-circle chat-online"></span> Online
                    </div>
                </div>
                </div>
            </a>
            `).on('click', '#sidebar a', function () {
                    enterChat(data)
                    // $(".chat-messages").empty()
            });
        } else {
            $("#sidebar").append(`
                <a
                href="#"
                class="list-group-item list-group-item-action border-0"
                >
                <div class="badge bg-success float-right">5</div>
                <div class="d-flex align-items-start">
                <img
                    src="https://bootdey.com/img/Content/avatar/avatar5.png"
                    class="rounded-circle mr-1"
                    alt="${data.receiver.name}"
                    width="40"
                    height="40"
                />
                <div class="flex-grow-1 ml-3">
                    ${data.receiver.name}
                    <div class="small">
                    <span class="fas fa-circle chat-online"></span> Online
                    </div>
                </div>
                </div>
            </a>
            `).on('click', '#sidebar a', function () {
                    enterChat(data)
                    // $(".chat-messages").empty()
            });
        }
            console.log("a")


        
    }

    function enterChat(data) {
        window.location.search = `?id=${data._id}`;
    }

    async function getInfoFromChat(chatId) {
        if (chatId) {
            const response = await fetch(`http://localhost:3000/chat/private/getInfo/${chatId}`, {
              
            });
            if (response.ok) {
                const data = await response.json();
                return data
            } else if (response.status == 401){
                window.location.href = '/login.html';
               
            }
        } else {
            console.log("a")
        }
        
            
    }

    async function getContacts() {
        const response = await fetch(`http://localhost:3000/chat/private/getAll`, {
           
        });
        const data = await response.json();
        if (response.ok) {
            data.forEach(contact => {
                renderContact(contact)
            })
        } else if (response.status == 401){
            window.location.href = '/login.html';
        }
    }

    await getContacts()

}




start();
