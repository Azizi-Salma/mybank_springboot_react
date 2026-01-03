package ma.enset.mybank.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OperationRequest {
    private double montant;
    private String description;
    private String numeroCheque;  // peut rester null
}
