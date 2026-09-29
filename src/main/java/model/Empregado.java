package model;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "empregado")
public class Empregado {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 14)
	private String cpf;

	@Column(nullable = false, length = 60)
	private String nome;

	@Column
	@DateTimeFormat(pattern = "dd/mm/yyyy hh:mm")
	private LocalDateTime dataHoraContratacao;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "id_departamento", nullable = false)
	@JsonBackReference("departamento-empregados") // Na serialização para JSON, não iremos mandar esse atributo
	private Departamento departamento;

	@ManyToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "id_projeto")
	@JsonBackReference("projeto-empregados")
	private Projeto projeto;

	public Empregado() {
		super();
	}

	public Empregado(String cpf, String nome, Departamento departamento) throws ModelException {
		super();
		this.setCpf(cpf);
		this.setNome(nome);
		this.setDepartamento(departamento);
	}

	@PrePersist
	public void prePersist() {
		if (this.dataHoraContratacao == null) {
			this.dataHoraContratacao = LocalDateTime.now();
		}
	}

	public Long getId() {
		return id;
	}

	public void setIdEmpregado(Long id) {
		this.id = id;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) throws ModelException {
		Empregado.validarCpf(cpf);
		this.cpf = cpf;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) throws ModelException {
		Empregado.validarNome(nome);
		this.nome = nome;
	}

	public LocalDateTime getDataHoraContratacao() {
		return this.dataHoraContratacao;
	}

	public Departamento getDepartamento() {
		return departamento;
	}

	public Projeto getProjeto() { return projeto; }

	public void setProjeto(Projeto projeto) { this.projeto = projeto; }

	public void setDepartamento(Departamento departamento) throws ModelException {
		Empregado.validarDepartamento(departamento);
		if(this.departamento != null)
			this.departamento.removerEmpregado(this);
		this.departamento = departamento;
		departamento.adicionarEmpregado(this);
	}

	public static void validarCpf(String cpf) throws ModelException {
		if (cpf == null || cpf.length() == 0)
			throw new ModelException("O CPF não pode ser nulo!");
		// Demais verificações a serem colocadas a seguir
	}

	public static void validarNome(String nome) throws ModelException {
		if (nome == null || nome.length() == 0)
			throw new ModelException("O nome não pode ser nulo!");
		// Demais verificações a serem colocadas a seguir
	}

	public static void validarDepartamento(Departamento departamento) throws ModelException {
		if (departamento == null)
			throw new ModelException("É necessário associar o empregado a um departamento!");
	}
}
