package ma.enset.mybank.repositories;

import ma.enset.mybank.entities.BankAccount;
import ma.enset.mybank.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

    Optional<BankAccount> findByRib(String rib);

    List<BankAccount> findByClient(Client client);
}
