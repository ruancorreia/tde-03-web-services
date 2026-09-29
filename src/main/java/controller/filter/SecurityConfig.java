package controller.filter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableMethodSecurity // Importante para segmentar por PAPÉIS.
public class SecurityConfig {

	// Na inicialização do Spring Boot, ele faz o Component Scanning. 
	// Como essa classe tem a anotação @Configuration, ela faz parte do ApplicationContext
	// Ele vai instanciar um objeto dessa classe e por ter o @Bean, vai executar o 
	// método filterChain e vai registrar o SecurityFilterChain resultante. 
	// A partir daí, toda requisição vai passar por esse SecurityFilterChain
	
	public SecurityConfig() {
		System.out.println("\nSecurityConfig Instanciado!");
	}
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	    System.out.println(">>> SecurityFilterChain carregado");
	    http.csrf(csrf -> csrf.disable()) // Estamos liberando o CSRF (do jeito que está, só é seguro em aplicações STATELESS!) 
	    	.formLogin(form -> form
	    			.loginPage("/index.html")   
	                .loginProcessingUrl("/login")
	                .successHandler((request, response, authentication) -> {
	                    response.setStatus(HttpServletResponse.SC_OK);
	                    response.setContentType("application/json;charset=UTF-8");
	                    response.getWriter().write("{\"mensagem\":\"Login realizado com sucesso\"}");
	                })
	                .failureHandler((request, response, exception) -> {
	                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	                    response.setContentType("application/json;charset=UTF-8");
	                    response.getWriter().write("{\"erro\":\"Usuário ou senha inválidos\"}");
	                })
	                // Ou usar algo como:  .failureUrl("/index.html?error=true") 
	                .permitAll()
	    	)
	    	.logout(logout -> logout
	                .logoutUrl("/logout")
	                .logoutSuccessUrl("/index.html")
	            )
	    	.headers(headers -> headers.frameOptions(frame -> frame.disable()))
        	// Informando quais requisições estão AUTORIZADAS a serem processadas
        	.authorizeHttpRequests(auth -> auth
	            .requestMatchers(
	            	"/", 
	                "/index.html", // Já liberado pelo permitAll() acima
	                "/favicon.ico",
	                "/h2-console/**",
	                "/auth/**",
	                "/css/**",
	                "/js/**",
	                "/images/**"
	            ).permitAll() // Libera todos as requisições cujo path der 'match' nos itens colocados.
	                          // Ou seja, mesmo que não tenha ocorrido a autenticação, a requisição irá passar
	            			  // entretanto, isso não quer dizer que o filtro AuthFilter não irá trabalhar.
	            .anyRequest().authenticated() // para os demais, preciso de autenticação prévia
	        ); 

	    return http.build();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	    // Poderia ser return new Argon2PasswordEncoder(); mas precisaria alterar o pom.xml 
	}
	
	// Sequência: 
	// UsernamePasswordAuthenticationFilter -> AuthenticationManager -> UserDetailsService
	// -> PasswordEncoder -> Sessão criada
	
	
	// CSRF (Cross-Site Request Forgery) é um tipo de ataque em que um site malicioso 
	// induz o navegador do usuário a enviar uma requisição autenticada para outro 
	// site onde ele já está logado — sem o consentimento do usuário.
	// O atacante não precisa roubar sua senha; ele apenas faz você usar sua própria sessão contra você
	//
	// considerar: csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) 
}