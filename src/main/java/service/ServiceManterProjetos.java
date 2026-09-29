package service;

import java.util.List;
import org.springframework.stereotype.Service;
import model.Projeto;
import model.repository.ProjetoRepository;

@Service
public class ServiceManterProjetos {
    private final ProjetoRepository repositorio;

    public ServiceManterProjetos(ProjetoRepository repositorio) {
        this.repositorio = repositorio;
    }
    public List<Projeto> listarTodos() { return repositorio.findAll(); }
    public Projeto buscarPorId(Long id) { return repositorio.findById(id).orElse(null); }
    public Projeto incluir(Projeto projeto) { projeto.setId(null); return repositorio.save(projeto); }
    public Projeto alterar(Long id, Projeto projeto) { projeto.setId(id); return repositorio.save(projeto); }
    public void remover(Long id) { repositorio.deleteById(id); }
}
