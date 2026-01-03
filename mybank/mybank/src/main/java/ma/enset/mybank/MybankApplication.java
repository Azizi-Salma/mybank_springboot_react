package ma.enset.mybank;

import ma.enset.mybank.entities.AppUser;
import ma.enset.mybank.repositories.AppUserRepository;
import ma.enset.mybank.repositories.ClientRepository;
import ma.enset.mybank.repositories.BankAccountRepository;
import ma.enset.mybank.enums.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class MybankApplication {

    public static void main(String[] args) {
        SpringApplication.run(MybankApplication.class, args);
    }

    @Bean
    CommandLineRunner seedUsers(AppUserRepository appUserRepository,
                                ClientRepository clientRepository,
                                BankAccountRepository bankAccountRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {

            // ---------- AGENT 1 ----------
            String rawPasswordAgent1 = "1234";
            String encodedAgent1 = passwordEncoder.encode(rawPasswordAgent1);

            AppUser agent1 = AppUser.builder()
                    .username("agent1")
                    .password(encodedAgent1)
                    .role(Role.AGENT_GUICHET)
                    .active(true)
                    .client(null)
                    .build();
            appUserRepository.save(agent1);

            // ---------- AGENT 2 ----------
            String rawPasswordAgent2 = "agent1234";
            String encodedAgent2 = passwordEncoder.encode(rawPasswordAgent2);

            AppUser agent2 = AppUser.builder()
                    .username("agent2")
                    .password(encodedAgent2)
                    .role(Role.AGENT_GUICHET)
                    .active(true)
                    .client(null)
                    .build();
            appUserRepository.save(agent2);

            // ---------- CLIENT SALMA ----------
            String rawPasswordSalma = "password1234";
            String encodedSalma = passwordEncoder.encode(rawPasswordSalma);

            AppUser salma = AppUser.builder()
                    .username("salma")
                    .password(encodedSalma)
                    .role(Role.CLIENT)
                    .active(true)
                    .client(null)
                    .build();
            appUserRepository.save(salma);

            // ---------- Console log ----------
            System.out.println("========== SEED eBank ==========");
            System.out.println("Comptes créés :");
            System.out.println("- AGENT_GUICHET: agent1 / mot de passe: " + rawPasswordAgent1);
            System.out.println("- AGENT_GUICHET: agent2 / mot de passe: " + rawPasswordAgent2);
            System.out.println("- CLIENT: salma / mot de passe: " + rawPasswordSalma);
            System.out.println("=================================");
        };
    }
}
