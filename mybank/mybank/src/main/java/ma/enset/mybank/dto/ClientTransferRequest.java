package ma.enset.mybank.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientTransferRequest {
    private Long sourceAccountId;
    private String destinationRib;
    private double amount;
    private String description;
}
