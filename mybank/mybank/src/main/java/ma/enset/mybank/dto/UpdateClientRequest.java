package ma.enset.mybank.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateClientRequest {

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @NotBlank
    private String cin;

    @NotBlank
    private String dateNaissance;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String adresse;
}
