package ma.enset.mybank.services;

import ma.enset.mybank.dto.OperationRequest;
import ma.enset.mybank.dto.TransferRequest;
import ma.enset.mybank.entities.BankOperation;

import java.util.List;

public interface BankOperationService {

    BankOperation debit(Long compteId, OperationRequest request);

    BankOperation credit(Long compteId, OperationRequest request);

    void transfer(TransferRequest request);

    List<BankOperation> getLastOperations(Long compteId);
}
