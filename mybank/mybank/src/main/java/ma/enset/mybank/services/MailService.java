package ma.enset.mybank.services;

public interface MailService {

    void sendCredentialsEmail(String to, String login, String rawPassword);
}
