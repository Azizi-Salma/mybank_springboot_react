package ma.enset.mybank.security;

import lombok.RequiredArgsConstructor;
import ma.enset.mybank.entities.AppUser;
import ma.enset.mybank.repositories.AppUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ROLE_CLIENT ou ROLE_AGENT_GUICHET
        String roleName = "ROLE_" + appUser.getRole().name();

        return new User(
                appUser.getUsername(),
                appUser.getPassword(),
                appUser.isActive(),
                true,
                true,
                true,
                List.of(new SimpleGrantedAuthority(roleName))
        );
    }
}
