package ma.enset.mybank.services.impl;

import lombok.RequiredArgsConstructor;
import ma.enset.mybank.dto.CreateClientRequest;
import ma.enset.mybank.dto.UpdateClientRequest;
import ma.enset.mybank.entities.AppUser;
import ma.enset.mybank.entities.Client;
import ma.enset.mybank.enums.Role;
import ma.enset.mybank.repositories.AppUserRepository;
import ma.enset.mybank.repositories.BankAccountRepository;
import ma.enset.mybank.repositories.ClientRepository;
import ma.enset.mybank.services.ClientService;
import ma.enset.mybank.services.MailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final AppUserRepository appUserRepository;
    private final BankAccountRepository bankAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Override
    public Client addClient(CreateClientRequest request) throws Exception {
        // RG4: CIN unique
        if (clientRepository.existsByCin(request.getCin())) {
            throw new Exception("Un client avec ce CIN existe déjà");
        }

        // RG6: email unique
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Un client avec cet email existe déjà");
        }

        Client client = new Client();
        client.setNom(request.getNom());
        client.setPrenom(request.getPrenom());
        client.setCin(request.getCin());
        client.setDateNaissance(request.getDateNaissance());
        client.setEmail(request.getEmail());
        client.setAdresse(request.getAdresse());

        client = clientRepository.save(client);

        // Génération du login (ex: prenom.nom + id)
        String baseLogin = (request.getPrenom() + "." + request.getNom()).toLowerCase().replaceAll("[^a-z0-9]", "");
        if (baseLogin.isEmpty()) {
            baseLogin = "client";
        }
        String login = baseLogin + client.getId();

        // Génération d'un mot de passe aléatoire
        String rawPassword = generateRandomPassword(10);

        // Création de l'utilisateur applicatif lié au client
        AppUser appUser = AppUser.builder()
                .username(login)
                .password(passwordEncoder.encode(rawPassword))
                .role(Role.CLIENT)
                .active(true)
                .client(client)
                .build();

        appUserRepository.save(appUser);

        // RG_7 : envoi du mail au client avec login + mot de passe
        try {
            mailService.sendCredentialsEmail(client.getEmail(), login, rawPassword);
        } catch (Exception e) {
            // Log l'erreur mais ne bloque pas la création du client
            // Le client est créé même si l'email n'a pas pu être envoyé
            // L'erreur est déjà loggée dans MailServiceImpl
        }

        return client;
    }

    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Client getClientById(Long id) throws Exception {
        return clientRepository.findById(id)
                .orElseThrow(() -> new Exception("Client introuvable avec id = " + id));
    }

    @Override
    public Client updateClient(Long id, UpdateClientRequest request) throws Exception {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new Exception("Client introuvable avec id = " + id));

        // RG4 / RG6 aussi en mise à jour : on vérifie l'unicité CIN et email
        if (!client.getCin().equals(request.getCin()) && clientRepository.existsByCin(request.getCin())) {
            throw new Exception("Un client avec ce CIN existe déjà");
        }
        if (!client.getEmail().equals(request.getEmail()) && clientRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Un client avec cet email existe déjà");
        }

        client.setNom(request.getNom());
        client.setPrenom(request.getPrenom());
        client.setCin(request.getCin());
        client.setDateNaissance(request.getDateNaissance());
        client.setEmail(request.getEmail());
        client.setAdresse(request.getAdresse());

        return clientRepository.save(client);
    }

    @Override
    public void deleteClient(Long id) throws Exception {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new Exception("Client introuvable avec id = " + id));

        // Vérifier si le client a des comptes associés
        if (!bankAccountRepository.findByClient(client).isEmpty()) {
            throw new Exception("Impossible de supprimer le client : il possède des comptes bancaires associés. Veuillez d'abord supprimer les comptes.");
        }

        // Supprimer l'AppUser associé s'il existe
        appUserRepository.findByClient(client)
                .ifPresent(appUserRepository::delete);

        // Supprimer le client
        clientRepository.deleteById(id);
    }
}
