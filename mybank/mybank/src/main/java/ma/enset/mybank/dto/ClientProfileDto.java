package ma.enset.mybank.dto;

import lombok.Data;

@Data
public class ClientProfileDto {
    private Long id;
    private String nom;
    private String prenom;
    private String cin;
    private String email;
    private String adresse;
}
