package ma.enset.mybank.repositories;

import ma.enset.mybank.entities.AppUser;
import ma.enset.mybank.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByClient(Client client);
}
