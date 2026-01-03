package ma.enset.mybank.services.impl;

import lombok.RequiredArgsConstructor;
import ma.enset.mybank.dto.OperationRequest;
import ma.enset.mybank.dto.TransferRequest;
import ma.enset.mybank.entities.BankAccount;
import ma.enset.mybank.entities.BankOperation;
import ma.enset.mybank.enums.AccountStatus;
import ma.enset.mybank.enums.OperationType;
import ma.enset.mybank.repositories.BankAccountRepository;
import ma.enset.mybank.repositories.BankOperationRepository;
import ma.enset.mybank.services.BankOperationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BankOperationServiceImpl implements BankOperationService {

    private final BankAccountRepository bankAccountRepository;
    private final BankOperationRepository bankOperationRepository;

    private BankAccount getCompteOrThrow(Long id) {
        return bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
    }

    private void checkCompteOuvert(BankAccount compte) {
        if (compte.getStatus() != AccountStatus.OUVERT) {
            throw new RuntimeException("Compte bloqué ou clôturé");
        }
    }

    @Override
    @Transactional
    public BankOperation debit(Long compteId, OperationRequest request) {
        BankAccount compte = getCompteOrThrow(compteId);
        checkCompteOuvert(compte);

        if (request.getMontant() <= 0) {
            throw new RuntimeException("Montant doit être > 0");
        }

        // RG : solde suffisant (on néglige le découvert autorisé pour l’instant)
        if (compte.getSolde() < request.getMontant()) {
            throw new RuntimeException("Solde insuffisant");
        }

        compte.setSolde(compte.getSolde() - request.getMontant());

        BankOperation op = BankOperation.builder()
                .dateOperation(LocalDateTime.now())
                .montant(request.getMontant())
                .type(OperationType.DEBIT)
                .description(request.getDescription())
                .numeroCheque(request.getNumeroCheque())
                .reference(UUID.randomUUID().toString())
                .compte(compte)
                .build();

        bankAccountRepository.save(compte);
        return bankOperationRepository.save(op);
    }

    @Override
    @Transactional
    public BankOperation credit(Long compteId, OperationRequest request) {
        BankAccount compte = getCompteOrThrow(compteId);
        checkCompteOuvert(compte);

        if (request.getMontant() <= 0) {
            throw new RuntimeException("Montant doit être > 0");
        }

        compte.setSolde(compte.getSolde() + request.getMontant());

        BankOperation op = BankOperation.builder()
                .dateOperation(LocalDateTime.now())
                .montant(request.getMontant())
                .type(OperationType.CREDIT)
                .description(request.getDescription())
                .reference(UUID.randomUUID().toString())
                .compte(compte)
                .build();

        bankAccountRepository.save(compte);
        return bankOperationRepository.save(op);
    }

    @Override
    @Transactional
    public void transfer(TransferRequest request) {
        if (request.getMontant() <= 0) {
            throw new RuntimeException("Montant doit être > 0");
        }

        BankAccount source = getCompteOrThrow(request.getCompteSourceId());
        BankAccount dest   = getCompteOrThrow(request.getCompteDestinationId());

        if (source.getId().equals(dest.getId())) {
            throw new RuntimeException("Compte source et destination doivent être différents");
        }

        checkCompteOuvert(source);
        checkCompteOuvert(dest);

        if (source.getSolde() < request.getMontant()) {
            throw new RuntimeException("Solde insuffisant pour le virement");
        }

        // même référence pour les deux opérations (RG_13 / RG_15)
        String ref = UUID.randomUUID().toString();

        // Débit source
        source.setSolde(source.getSolde() - request.getMontant());
        String destClientName = dest.getClient() != null 
                ? (dest.getClient().getPrenom() + " " + dest.getClient().getNom())
                : "compte " + dest.getId();
        BankOperation debitOp = BankOperation.builder()
                .dateOperation(LocalDateTime.now())
                .montant(request.getMontant())
                .type(OperationType.DEBIT)
                .description("Virement vers " + destClientName
                        + " - " + request.getDescription())
                .reference(ref)
                .compte(source)
                .build();

        // Crédit destination
        dest.setSolde(dest.getSolde() + request.getMontant());
        String sourceClientName = source.getClient() != null 
                ? (source.getClient().getPrenom() + " " + source.getClient().getNom())
                : "compte " + source.getId();
        BankOperation creditOp = BankOperation.builder()
                .dateOperation(LocalDateTime.now())
                .montant(request.getMontant())
                .type(OperationType.CREDIT)
                .description("Virement reçu de " + sourceClientName
                        + " - " + request.getDescription())
                .reference(ref)
                .compte(dest)
                .build();

        bankAccountRepository.save(source);
        bankAccountRepository.save(dest);
        bankOperationRepository.save(debitOp);
        bankOperationRepository.save(creditOp);
    }

    @Override
    public List<BankOperation> getLastOperations(Long compteId) {
        BankAccount compte = getCompteOrThrow(compteId);
        return bankOperationRepository.findTop10ByCompteOrderByDateOperationDesc(compte);
    }
}
