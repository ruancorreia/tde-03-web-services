package controller;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import model.Projeto;
import model.dto.ProjetoDTO;
import service.ServiceManterProjetos;

@RestController
@RequestMapping("/projeto")
public class CtrlManterProjetos {
    private final ServiceManterProjetos service;
    public CtrlManterProjetos(ServiceManterProjetos service) { this.service = service; }

    @GetMapping("/listar")
    public ResponseEntity<List<ProjetoDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos().stream().map(ProjetoDTO::new).collect(Collectors.toList()));
    }
    @GetMapping("/listar/{id}")
    public ResponseEntity<ProjetoDTO> listarPorId(@PathVariable Long id) {
        Projeto projeto = service.buscarPorId(id);
        return projeto == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(new ProjetoDTO(projeto));
    }
    @PostMapping("/incluir")
    public ResponseEntity<?> incluir(@RequestBody Projeto projeto) {
        try { return ResponseEntity.status(HttpStatus.CREATED).body(new ProjetoDTO(service.incluir(projeto))); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
    @PutMapping("/alterar/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @RequestBody Projeto projeto) {
        try { return ResponseEntity.ok(new ProjetoDTO(service.alterar(id, projeto))); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
    @DeleteMapping("/remover/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id) {
        try { service.remover(id); return ResponseEntity.ok().build(); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}
