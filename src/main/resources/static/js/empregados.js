'use strict'

const API_BASE = '/empregado';
const API_DEPTO = '/depto';
const API_PROJETO = '/projeto';

let editando = false;
let departamentos = [];

window.addEventListener('DOMContentLoaded', async () => {
	await verificarLogin();
	await carregarDepartamentosSelect();
	await carregarProjetosSelect();
	await carregarEmpregados();
});

async function carregarProjetosSelect() { const r=await fetch(`${API_PROJETO}/listar`); const ps=await r.json(); const s=document.getElementById('projeto'); s.innerHTML='<option value="">Sem projeto</option>'; ps.forEach(p=>s.innerHTML+=`<option value="${p.id}">${p.nome}</option>`); }

async function verificarLogin() {
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

	} catch (err) {
		console.error(err);
	}
}

async function carregarDepartamentosSelect() {
	try {
		const response = await fetch(`${API_DEPTO}/listar`);
		departamentos = await response.json();

		const select = document.getElementById('departamento');
		select.innerHTML = '<option value="">Selecione...</option>';

		departamentos.forEach(dep => {
			select.innerHTML += `<option value="${dep.id}">${dep.sigla} - ${dep.nome}</option>`;
		});

	} catch (error) {
		showMessage('Erro ao carregar departamentos', 'error');
	}
}

async function carregarEmpregados() {
	try {
		const response = await fetch(`${API_BASE}/listar`, {
			credentials: 'include'
		});

		if (response.status === 401) {
			logout();
			return;
		}

		const empregados = await response.json();
		renderizarTabela(empregados);

	} catch (error) {
		showMessage('Erro ao carregar empregados', 'error');
	}
}

function renderizarTabela(empregados) {
	const tbody = document.querySelector('#tabelaEmpregados tbody');
	tbody.innerHTML = '';

	empregados.forEach(emp => {
		const tr = document.createElement('tr');

		tr.innerHTML = `
            <td>${emp.cpf}</td>
            <td>${emp.nome}</td>
			<td>${emp.nomeDepartamento || ''}</td>
			<td>${emp.nomeProjeto || 'Sem projeto'}</td>
            <td>
                <button class="btn-warning" onclick="editarEmpregado(${emp.id})">Editar</button>
                <button class="btn-danger" onclick="excluirEmpregado(${emp.id})">Excluir</button>
            </td>
        `;

		tbody.appendChild(tr);
	});
}

document.getElementById('empregadoForm').addEventListener('submit', async (e) => {
	e.preventDefault();

	const idEmpregado = document.getElementById('idEmpregado').value;
	const cpf = document.getElementById('cpf').value;
	const nome = document.getElementById('nome').value;
	const idDepartamento = document.getElementById('departamento').value;
	const idProjeto = document.getElementById('projeto').value;

	const departamento = departamentos.find(d => d.id == idDepartamento);

	const empregado = {
		idEmpregado: idEmpregado || null,
		cpf: cpf,
		nome: nome,
		departamento: departamento, projeto: idProjeto ? { id: Number(idProjeto) } : null
	};

	try {
		let response;

		if (editando) {
			response = await fetch(`${API_BASE}/alterar/${idEmpregado}`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(empregado)
			});
		} else {
			response = await fetch(`${API_BASE}/incluir`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(empregado)
			});
		}

		if (response.ok) {
			showMessage(`Empregado ${editando ? 'atualizado' : 'criado'} com sucesso!`, 'success');
			limparForm();
			carregarEmpregados();
		} else {
			const msg = await response.text();
			showMessage(msg, 'error');
		}

	} catch (error) {
		showMessage('Erro ao salvar empregado', 'error');
	}
});

async function editarEmpregado(id) {
	try {
		const response = await fetch(`${API_BASE}/listar/${id}`, {
			credentials: 'include'
		});

		const emp = await response.json();

		document.getElementById('idEmpregado').value = id;
		document.getElementById('cpf').value = emp.cpf;
		document.getElementById('nome').value = emp.nome;
		document.getElementById('departamento').value = emp.idDepartamento;
		document.getElementById('projeto').value = emp.idProjeto || '';

		editando = true;

		document.getElementById('btnSalvar').textContent = 'Atualizar';
		document.getElementById('btnCancelar').classList.remove('hidden');

	} catch (error) {
		showMessage('Erro ao carregar empregado', 'error');
	}
}

async function excluirEmpregado(id) {
	if (!confirm('Deseja excluir este empregado?')) {
		return;
	}

	try {
		const response = await fetch(`${API_BASE}/remover/${id}`, {
			method: 'DELETE',
			credentials: 'include'
		});

		if (response.ok) {
			showMessage('Empregado excluído com sucesso!', 'success');
			carregarEmpregados();
		}

	} catch (error) {
		showMessage('Erro ao excluir empregado', 'error');
	}
}

function limparForm() {
	document.getElementById('empregadoForm').reset();
	document.getElementById('idEmpregado').value = '';
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

function irParaDepartamentos() {
	window.location.href = '/departamentos.html';
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
function irParaProjetos() { window.location.href = '/projetos.html'; }
