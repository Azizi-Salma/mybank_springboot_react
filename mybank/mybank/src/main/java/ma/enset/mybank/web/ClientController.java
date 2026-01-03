package ma.enset.mybank.web;

import lombok.RequiredArgsConstructor;
import ma.enset.mybank.dto.AccountDashboardDto;
import ma.enset.mybank.dto.ClientProfileDto;
import ma.enset.mybank.dto.ClientTransferRequest;
import ma.enset.mybank.dto.TransferRequest;
import ma.enset.mybank.entities.AppUser;
import ma.enset.mybank.entities.BankAccount;
import ma.enset.mybank.entities.BankOperation;
import ma.enset.mybank.entities.Client;
import ma.enset.mybank.repositories.AppUserRepository;
import ma.enset.mybank.repositories.BankAccountRepository;
import ma.enset.mybank.repositories.BankOperationRepository;
import ma.enset.mybank.services.BankOperationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {

    private final AppUserRepository appUserRepository;
    private final BankAccountRepository bankAccountRepository;
    private final BankOperationRepository bankOperationRepository;
    private final BankOperationService bankOperationService;

    // ------------------ Méthodes utilitaires privées ------------------

    private Client getCurrentClient(@AuthenticationPrincipal User user) {
        AppUser appUser = appUserRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        Client client = appUser.getClient();
        if (client == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ce compte utilisateur n'est pas lié à un client");
        }
        return client;
    }

    private BankAccount getAccountForClient(Long accountId, Client client) {
        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Compte introuvable"));

        // Sécurité : le compte doit appartenir au client connecté
        if (!account.getClient().getId().equals(client.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Accès non autorisé");
        }

        return account;
    }

    // ------------------ UC2 : infos personnelles ------------------

    @GetMapping("/me")
    public ClientProfileDto getMyProfile(@AuthenticationPrincipal User user) {

        Client client = getCurrentClient(user);

        ClientProfileDto dto = new ClientProfileDto();
        dto.setId(client.getId());
        dto.setNom(client.getNom());
        dto.setPrenom(client.getPrenom());
        dto.setCin(client.getCin());
        dto.setEmail(client.getEmail());
        dto.setAdresse(client.getAdresse());

        return dto;
    }

    // ------------------ UC2 bis : comptes du client connecté ------------------

    @GetMapping("/accounts")
    public List<BankAccount> getMyAccounts(@AuthenticationPrincipal User user) {

        Client client = getCurrentClient(user);
        return bankAccountRepository.findByClient(client);
    }

    // ------------------ UC3 : solde + dernières opérations ------------------

    @GetMapping("/accounts/{accountId}/dashboard")
    public AccountDashboardDto getDashboard(@PathVariable Long accountId,
                                            @AuthenticationPrincipal User user) {

        Client client = getCurrentClient(user);
        BankAccount account = getAccountForClient(accountId, client);

        List<BankOperation> lastOps =
                bankOperationRepository.findTop10ByCompteOrderByDateOperationDesc(account);

        AccountDashboardDto dto = new AccountDashboardDto();
        dto.setAccountId(account.getId());
        dto.setRib(account.getRib());
        dto.setSolde(account.getSolde());
        dto.setLastOperations(lastOps);

        return dto;
    }

    // ------------------ UC4 : historique des opérations du compte ------------------

    @GetMapping("/accounts/{accountId}/operations")
    public List<BankOperation> getAccountOperations(@PathVariable Long accountId,
                                                    @AuthenticationPrincipal User user) {

        Client client = getCurrentClient(user);
        BankAccount account = getAccountForClient(accountId, client);

        // Renvoie toutes les opérations de CE compte (triées du plus récent au plus ancien)
        return bankOperationRepository.findByCompteOrderByDateOperationDesc(account);
    }

    // ------------------ UC5 : virement client par RIB ------------------

    @PostMapping("/accounts/transfer")
    public void transfer(@RequestBody ClientTransferRequest request,
                         @AuthenticationPrincipal User user) {

        Client client = getCurrentClient(user);

        // Vérifie que le compte source appartient bien au client connecté
        BankAccount source = getAccountForClient(request.getSourceAccountId(), client);

        // Recherche du compte destinataire par RIB
        BankAccount destination = bankAccountRepository.findByRib(request.getDestinationRib())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Compte destinataire introuvable pour ce RIB"));

        // Construction du DTO TransferRequest utilisé par le service métier
        TransferRequest tr = new TransferRequest();
        tr.setCompteSourceId(source.getId());
        tr.setCompteDestinationId(destination.getId());
        tr.setMontant(request.getAmount());
        tr.setDescription(request.getDescription());

        bankOperationService.transfer(tr);
    }
}
