const app = document.querySelector(".app");
const userList = document.getElementById('users-list');

// let data = {};

(async function(){
	const token = localStorage.getItem('token');
	
	if (!token) {
		
        window.location.href = '/login';
	}
	
	const socket = io();

	// io(
	// 	'http://localhost:5000',
	// 	{ query: { id } }
	//   )

	// const newSocket = io(
	// 'http://localhost:3000',
	// { query: { id } }
	// )

	let uname;

	const response = await fetch('http://localhost:3000/users', {
	  headers: {
		Authorization: `Bearer ${token}`
	  }
	});

	if (response.ok) {
	  const data = await response.json();
	
	  userList.innerHTML = '';
	  data.users.forEach((user) => {
		const option = document.createElement('option');
		option.value = user._id;
		option.textContent = user.email;
		userList.appendChild(option);
		// console.log(option)
	  });
	} else {
	  const data = await response.json();
	//   alert(`Erro ao carregar a lista de usuários: ${data.message}`);
	  window.location.href = '/login';
	}

	

	app.querySelector(".join-screen #join-user").addEventListener("click", async function(){

		
		try {
			const response = await fetch('http://localhost:3000/chat/handle', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				
				body: JSON.stringify({
					targetUser: userList.value
				})
			});
		
			if (response.ok) {
				const chat = await response.json();
				console.log('Chat existente/criado:', chat);
				// socket.emit("userjoined", {chat});
				// window.history.replaceState(null, null, `?chat=${chat._id}`);
				
				
				
				window.location.href = `/chat?id=${chat._id}`;

			} else {
				console.error('Erro ao verificar/criar chat:', response.status);
			}
			} catch (error) {
			console.error('Erro ao verificar/criar chat:', error);
		}
	});

	

})();

