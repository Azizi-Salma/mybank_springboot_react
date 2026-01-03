package ma.enset.mybank.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import ma.enset.mybank.enums.AccountStatus;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String rib;

    private double solde;

    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.OUVERT;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "compte", cascade = CascadeType.ALL)
    @JsonIgnore               // ✅ empêche la boucle infinie
    private List<BankOperation> operations;
}
