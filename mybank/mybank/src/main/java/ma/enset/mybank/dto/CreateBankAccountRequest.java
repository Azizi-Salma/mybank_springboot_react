package ma.enset.mybank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateBankAccountRequest {

    @NotBlank
    @Size(min = 10, max = 34)
    private String rib;

    // RG9: solde initial doit être >= 0
    @PositiveOrZero
    private double solde;

    private Long clientId;
}
