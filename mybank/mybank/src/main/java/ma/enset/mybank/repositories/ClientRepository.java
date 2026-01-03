package ma.enset.mybank.repositories;

import ma.enset.mybank.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
    boolean existsByCin(String cin);
    boolean existsByEmail(String email);
}
