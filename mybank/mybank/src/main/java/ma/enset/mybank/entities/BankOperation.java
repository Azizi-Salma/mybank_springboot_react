package ma.enset.mybank.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.enset.mybank.enums.OperationType;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateOperation;

    private double montant;

    @Enumerated(EnumType.STRING)
    private OperationType type;   // DEBIT ou CREDIT

    private String description;

    // Pour respecter RG_13/RG_15 : même ref pour le débit et le crédit d’un virement
    @Column(unique = false)
    private String reference;

    // Optionnel : pour les opérations par chèque
    private String numeroCheque;

    @ManyToOne
    @JoinColumn(name = "compte_id")
    private BankAccount compte;
}
