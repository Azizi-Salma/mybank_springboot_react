package ma.enset.mybank.dto;

import lombok.Data;
import ma.enset.mybank.entities.BankOperation;

import java.util.List;

@Data
public class AccountDashboardDto {
    private Long accountId;
    private String rib;
    private double solde;
    private List<BankOperation> lastOperations;
}
