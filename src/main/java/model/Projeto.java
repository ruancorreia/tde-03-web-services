package model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Projeto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false)
    private LocalDate dataCriacao;

    @OneToMany(mappedBy = "projeto", fetch = FetchType.LAZY)
    @JsonManagedReference("projeto-empregados")
    private List<Empregado> empregados = new ArrayList<>();

    public Projeto() {}

    public Projeto(String nome, LocalDate dataCriacao) throws ModelException {
        setNome(nome);
        setDataCriacao(dataCriacao);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) throws ModelException {
        if (nome == null || nome.isBlank() || nome.length() > 100)
            throw new ModelException("O nome do projeto é inválido!");
        this.nome = nome;
    }
    public LocalDate getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDate dataCriacao) throws ModelException {
        if (dataCriacao == null)
            throw new ModelException("A data de criação é obrigatória!");
        this.dataCriacao = dataCriacao;
    }
    public List<Empregado> getEmpregados() { return new ArrayList<>(empregados); }
}
