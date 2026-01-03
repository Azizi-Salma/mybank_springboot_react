package ma.enset.mybank.services.impl;

import lombok.RequiredArgsConstructor;
import ma.enset.mybank.dto.CreateBankAccountRequest;
import ma.enset.mybank.dto.UpdateBankAccountRequest;
import ma.enset.mybank.entities.BankAccount;
import ma.enset.mybank.entities.Client;
import ma.enset.mybank.enums.AccountStatus;
import ma.enset.mybank.repositories.BankAccountRepository;
import ma.enset.mybank.repositories.ClientRepository;
import ma.enset.mybank.services.BankAccountService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BankAccountServiceImpl implements BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final ClientRepository clientRepository;

    @Override
    public BankAccount createAccount(CreateBankAccountRequest request) {
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        // RG9: solde initial doit être >= 0
        if (request.getSolde() < 0) {
            throw new RuntimeException("Le solde initial doit être supérieur ou égal à 0");
        }

        // RG8: RIB unique
        if (bankAccountRepository.findByRib(request.getRib()).isPresent()) {
            throw new RuntimeException("Un compte avec ce RIB existe déjà");
        }

        BankAccount account = new BankAccount();
        account.setRib(request.getRib());
        account.setSolde(request.getSolde());
        account.setStatus(AccountStatus.OUVERT);   // valeur par défaut
        account.setClient(client);

        return bankAccountRepository.save(account);
    }

    @Override
    public BankAccount updateAccount(Long accountId, UpdateBankAccountRequest request) {
        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        if (request.getSolde() != null) {
            account.setSolde(request.getSolde());
        }
        if (request.getStatus() != null) {
            account.setStatus(AccountStatus.valueOf(request.getStatus()));
        }

        return bankAccountRepository.save(account);
    }

    @Override
    public boolean deleteAccount(Long accountId) {
        if (!bankAccountRepository.existsById(accountId)) return false;
        bankAccountRepository.deleteById(accountId);
        return true;
    }

    @Override
    public BankAccount getAccountById(Long accountId) {
        return bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
    }

    @Override
    public List<BankAccount> getAllAccounts() {
        return bankAccountRepository.findAll();
    }
}
