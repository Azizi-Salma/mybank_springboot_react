package ma.enset.mybank.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.enset.mybank.dto.CreateBankAccountRequest;
import ma.enset.mybank.dto.CreateClientRequest;
import ma.enset.mybank.dto.UpdateBankAccountRequest;
import ma.enset.mybank.dto.UpdateClientRequest;
import ma.enset.mybank.entities.BankAccount;
import ma.enset.mybank.entities.Client;
import ma.enset.mybank.services.BankAccountService;
import ma.enset.mybank.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ClientService clientService;
    @Autowired
    private BankAccountService bankAccountService;

    // Test simple
    @GetMapping("/ping")
    public String pingAdmin() {
        return "ADMIN-OK";
    }

    // CREATE
    @PostMapping("/clients")
    public Client createClient(@Valid @RequestBody CreateClientRequest request) throws Exception {
        return clientService.addClient(request);
    }

    // READ ALL
    @GetMapping("/clients")
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    // READ BY ID
    @GetMapping("/clients/{id}")
    public Client getClientById(@PathVariable Long id) throws Exception {
        return clientService.getClientById(id);
    }

    // UPDATE
    @PutMapping("/clients/{id}")
    public Client updateClient(@PathVariable Long id,
                               @Valid @RequestBody UpdateClientRequest request) throws Exception {
        return clientService.updateClient(id, request);
    }

    // DELETE
    @DeleteMapping("/clients/{id}")
    public void deleteClient(@PathVariable Long id) throws Exception {
        clientService.deleteClient(id);
    }
    // ==================== BANK ACCOUNTS CRUD ====================

    // GET all
    @GetMapping("/accounts")
    public List<BankAccount> getAllAccounts() {
        return bankAccountService.getAllAccounts();
    }

    @GetMapping("/accounts/{id}")
    public BankAccount getAccount(@PathVariable Long id) {
        return bankAccountService.getAccountById(id);
    }

    @PostMapping("/accounts")
    public BankAccount createAccount(@RequestBody CreateBankAccountRequest request) {
        return bankAccountService.createAccount(request);
    }

    @PutMapping("/accounts/{id}")
    public BankAccount updateAccount(@PathVariable Long id,
                                     @RequestBody UpdateBankAccountRequest request) {
        return bankAccountService.updateAccount(id, request);
    }

    @DeleteMapping("/accounts/{id}")
    public boolean deleteAccount(@PathVariable Long id) {
        return bankAccountService.deleteAccount(id);
    }


}
