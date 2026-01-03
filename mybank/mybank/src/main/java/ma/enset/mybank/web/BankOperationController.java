package ma.enset.mybank.web;

import lombok.RequiredArgsConstructor;
import ma.enset.mybank.dto.OperationRequest;
import ma.enset.mybank.dto.TransferRequest;
import ma.enset.mybank.entities.BankOperation;
import ma.enset.mybank.services.BankOperationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class BankOperationController {

    private final BankOperationService bankOperationService;

    // POST /api/admin/accounts/{id}/debit
    @PostMapping("/{id}/debit")
    public BankOperation debit(
            @PathVariable Long id,
            @RequestBody OperationRequest request
    ) {
        return bankOperationService.debit(id, request);
    }

    // POST /api/admin/accounts/{id}/credit
    @PostMapping("/{id}/credit")
    public BankOperation credit(
            @PathVariable Long id,
            @RequestBody OperationRequest request
    ) {
        return bankOperationService.credit(id, request);
    }

    // POST /api/admin/accounts/transfer
    @PostMapping("/transfer")
    public void transfer(@RequestBody TransferRequest request) {
        bankOperationService.transfer(request);
    }

    // GET /api/admin/accounts/{id}/operations
    @GetMapping("/{id}/operations")
    public List<BankOperation> getLastOperations(@PathVariable Long id) {
        return bankOperationService.getLastOperations(id);
    }
}
