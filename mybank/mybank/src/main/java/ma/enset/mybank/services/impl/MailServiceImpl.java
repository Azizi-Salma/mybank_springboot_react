package ma.enset.mybank.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.enset.mybank.services.MailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendCredentialsEmail(String to, String login, String rawPassword) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Vos identifiants de connexion eBank");

            String text = "Bonjour,\n\n" +
                    "Votre compte eBank a été créé. Voici vos identifiants de connexion :\n\n" +
                    "Login : " + login + "\n" +
                    "Mot de passe : " + rawPassword + "\n\n" +
                    "Par mesure de sécurité, pensez à changer votre mot de passe lors de votre première connexion.\n\n" +
                    "Cordialement,\n" +
                    "L'équipe eBank";

            message.setText(text);
            mailSender.send(message);
            log.info("Email envoyé avec succès à {}", to);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email à {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email: " + e.getMessage(), e);
        }
    }
}
