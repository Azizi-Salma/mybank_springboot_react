package ma.enset.mybank.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.enset.mybank.enums.Role;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;   // login

    @Column(nullable = false)
    private String password;   // mot de passe crypté

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;         // CLIENT ou AGENT_GUICHET ou admin

    private boolean active = true;

    @OneToOne
    private Client client;     // null si c’est un agent
}
