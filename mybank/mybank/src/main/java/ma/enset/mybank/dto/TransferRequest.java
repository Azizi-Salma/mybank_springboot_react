package ma.enset.mybank.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TransferRequest {
    private Long compteSourceId;
    private Long compteDestinationId;;
    private double montant;
    private String description;
}
