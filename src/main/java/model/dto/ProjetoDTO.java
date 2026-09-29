package model.dto;

import java.time.LocalDate;
import model.Projeto;

public class ProjetoDTO {
    private Long id;
    private String nome;
    private LocalDate dataCriacao;

    public ProjetoDTO(Projeto projeto) {
        this.id = projeto.getId();
        this.nome = projeto.getNome();
        this.dataCriacao = projeto.getDataCriacao();
    }
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public LocalDate getDataCriacao() { return dataCriacao; }
}
