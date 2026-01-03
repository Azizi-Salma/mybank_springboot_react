package ma.enset.mybank.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "client")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nom;

    @Column(nullable = false, length = 50)
    private String prenom;

    @Column(nullable = false, length = 20, unique = true)
    private String cin;

    @Column(name = "date_naissance", nullable = false, length = 255)
    private String dateNaissance;   // on reste en String vu le log Hibernate

    @Column(nullable = false, length = 120, unique = true)
    private String email;

    @Column(name = "adresse", nullable = false, length = 255)
    private String adresse;
}
