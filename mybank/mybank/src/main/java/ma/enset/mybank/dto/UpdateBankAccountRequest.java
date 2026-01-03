package ma.enset.mybank.dto;

import lombok.Data;

@Data
public class UpdateBankAccountRequest {
    private Double solde;     // Double pour pouvoir le laisser null
    private String status;    // "OUVERT", "BLOQUE" ou "CLOTURE"
}
