package ma.enset.mybank.web;

import lombok.RequiredArgsConstructor;
import ma.enset.mybank.dto.AuthRequest;
import ma.enset.mybank.dto.AuthResponse;
import ma.enset.mybank.entities.AppUser;
import ma.enset.mybank.repositories.AppUserRepository;
import ma.enset.mybank.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ma.enset.mybank.dto.ChangePasswordRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        AppUser user = appUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur introuvable"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe incorrect");
        }

        String token = jwtService.generateToken(user.getUsername());

        AuthResponse response = new AuthResponse(
                token,
                user.getUsername(),
                user.getRole().name()
        );

        return ResponseEntity.ok(response);
    }

    // ajout dans AuthController



    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal User currentUser,
                                            @RequestBody ChangePasswordRequest request) {

        AppUser user = appUserRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ancien mot de passe incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Confirmation du mot de passe invalide");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Le nouveau mot de passe doit être différent de l'ancien");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        appUserRepository.save(user);

        return ResponseEntity.ok().body(Map.of("message", "Mot de passe modifié avec succès"));
    }

}
