package ma.enset.mybank.services;

import ma.enset.mybank.dto.CreateBankAccountRequest;
import ma.enset.mybank.dto.UpdateBankAccountRequest;
import ma.enset.mybank.entities.BankAccount;

import java.util.List;

public interface BankAccountService {

    BankAccount createAccount(CreateBankAccountRequest request);

    BankAccount updateAccount(Long accountId, UpdateBankAccountRequest request);

    boolean deleteAccount(Long accountId);

    BankAccount getAccountById(Long accountId);

    List<BankAccount> getAllAccounts();
}
