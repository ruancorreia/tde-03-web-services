'use strict'

const API_BASE = '/depto';
let editando = false;

// Verificar autenticação quando a página for carregada
window.addEventListener('DOMContentLoaded', async () => {
	try {
		const response = await fetch('/auth/me', {
	    	credentials: 'include'
		});

		if (response.status === 401) {
	    	window.location.href = 'index.html';
	        return;
		}

		const data = await response.json();

		document.getElementById('userInfo').textContent =
	    	`Usuário: ${data.username} | Perfis: ${data.roles.join(', ')}`;

		carregarDepartamentos();

	} catch (err) {
		console.error(err);
	}
});

async function carregarDepartamentos() {
    try {
        const response = await fetch(`${API_BASE}/listar`, {
            method: 'GET'
        });

		if (response.status === 403) {
		    showMessage('Acesso negado: você não tem permissão', 'error');
		    return;
		} else if (response.status === 401) {
            logout();
            return;
        }

        const departamentos = await response.json();
        renderizarTabela(departamentos);
    } catch (error) {
        showMessage('Erro ao carregar departamentos', 'error');
        console.error('Erro:', error);
    }
}

function renderizarTabela(departamentos) {
    const tbody = document.querySelector('#tabelaDepartamentos tbody');
    tbody.innerHTML = '';

    departamentos.forEach(depto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `            
            <td>${depto.sigla}</td>
            <td>${depto.nome}</td>
            <td>
                <button class="btn-warning" onclick="editarDepartamento(${depto.id})">Editar</button>
                <button class="btn-danger" onclick="excluirDepartamento(${depto.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('departamentoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    let id = document.getElementById('departamentoId').value;
    const sigla = document.getElementById('sigla').value;
    const nome = document.getElementById('nome').value;

	// Se for um processo de inclusão, não tem id definido, vou arbitrar um valor
	// pois o Repository irá trocá-lo
	//if(id == null || id == undefined || id == "")
	//	id = 1;
	
    const departamento = 
		{ 'id'   : id, 
		  'sigla': sigla, 
		  'nome' : nome };
	console.log(departamento);
	
    try {
        let response;
        if (editando) {
            response = await fetch(`${API_BASE}/alterar/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json' // Indica que o corpo é um JSON
                },
                body: JSON.stringify(departamento)
            });
        } else {
            response = await fetch(`${API_BASE}/incluir`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json' // Indica que o corpo é um JSON
                },
                body: JSON.stringify(departamento)
            });
        }

		if (response.status === 403) {
		    showMessage('Acesso negado: você não tem permissão', 'error');
		    return;
		} else if (response.ok) {
			console.log(await response.json());
            showMessage(`Departamento ${editando ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            limparForm();
            carregarDepartamentos();
        } else {
            const error = await response.text();
            showMessage('Erro ao salvar departamento: ' + error, 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
        console.error('Erro:', error);
    }
});

async function editarDepartamento(id) {
    try {
        const response = await fetch(`${API_BASE}/listar/${id}`, {
            method: 'GET'
        });

		if (response.status === 403) {
		    showMessage('Acesso negado: você não tem permissão', 'error');
		    return;
		} else if (response.ok) {
            const departamento = await response.json();
            document.getElementById('departamentoId').value = departamento.id;
            document.getElementById('sigla').value = departamento.sigla;
            document.getElementById('nome').value = departamento.nome;

            editando = true;
            document.getElementById('btnSalvar').textContent = 'Atualizar';
            document.getElementById('btnCancelar').classList.remove('hidden');
        }
    } catch (error) {
        showMessage('Erro ao carregar departamento', 'error');
        console.error('Erro:', error);
    }
}

async function excluirDepartamento(id) {
    if (!confirm('Tem certeza que deseja excluir este departamento?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/remover/${id}`, {
            credentials: 'include',
            method: 'DELETE'
        });

        if (response.status === 200) {
            showMessage('Departamento excluído com sucesso!', 'success');
            carregarDepartamentos();
        } else {
            showMessage('Erro ao excluir departamento', 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
        console.error('Erro:', error);
    }
}

function limparForm() {
    document.getElementById('departamentoForm').reset();
    document.getElementById('departamentoId').value = '';
    editando = false;
    document.getElementById('btnSalvar').textContent = 'Salvar';
    document.getElementById('btnCancelar').classList.add('hidden');
}

function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    }).then(() => {
        window.location.href = '/index.html';
    });
}

function irParaEmpregados() {
	window.location.href = '/empregados.html';
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
