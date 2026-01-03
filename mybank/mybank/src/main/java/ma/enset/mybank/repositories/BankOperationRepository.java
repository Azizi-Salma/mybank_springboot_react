package ma.enset.mybank.repositories;

import ma.enset.mybank.entities.BankAccount;
import ma.enset.mybank.entities.BankOperation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BankOperationRepository extends JpaRepository<BankOperation, Long> {

    // Dernières opérations d’un compte (pour le tableau de bord)
    List<BankOperation> findTop10ByCompteOrderByDateOperationDesc(BankAccount compte);

    List<BankOperation> findByCompteOrderByDateOperationDesc(BankAccount compte);

}
