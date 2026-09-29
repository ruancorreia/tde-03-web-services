'use strict' 

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('loginForm').addEventListener('submit', async (e) => {
    	e.preventDefault();

	    const username = document.getElementById('conta').value;
    	const password = document.getElementById('senha').value;

	    const body = new URLSearchParams();
    	body.append('username', username);
	    body.append('password', password);

	    try {
    	    const response = await fetch('/login', {
        	    method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
            	body: body,
	            credentials: 'include' // Importante para sessão
    	    });

        	const data = await response.json();

	        if (response.ok) {
    	        showMessage(data.mensagem, 'success');

        	    setTimeout(() => {
            	    window.location.href = 'departamentos.html';
	            }, 1000);
    	    } else {
        	    showMessage(data.erro, 'error');
        	}

	    } catch (err) {
    	    showMessage('Erro de conexão', 'error');
    	}
	});
});

function showMessage(message, type) {
	const messageDiv = document.getElementById('message');
	messageDiv.textContent = message;
	messageDiv.className = type;
	messageDiv.style.display = 'block';

	setTimeout(() => {
		messageDiv.style.display = 'none';
	}, 3000);
}
