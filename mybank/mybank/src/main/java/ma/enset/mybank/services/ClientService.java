package ma.enset.mybank.services;

import ma.enset.mybank.dto.CreateClientRequest;
import ma.enset.mybank.dto.UpdateClientRequest;
import ma.enset.mybank.entities.Client;

import java.util.List;

public interface ClientService {

    Client addClient(CreateClientRequest request) throws Exception;

    List<Client> getAllClients();

    Client getClientById(Long id) throws Exception;

    Client updateClient(Long id, UpdateClientRequest request) throws Exception;

    void deleteClient(Long id) throws Exception;
}
