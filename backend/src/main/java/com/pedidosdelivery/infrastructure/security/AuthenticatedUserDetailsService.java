package com.pedidosdelivery.infrastructure.security;

import com.pedidosdelivery.domain.port.UserRepositoryPort;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AuthenticatedUserDetailsService implements UserDetailsService {

    private final UserRepositoryPort userRepository;

    public AuthenticatedUserDetailsService(UserRepositoryPort userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UUID userId = UUID.fromString(username);

        return userRepository.findById(userId)
                .map(user -> new AuthenticatedUser(
                        user.getId(),
                        user.getEmail(),
                        user.getPasswordHash(),
                        List.of(new SimpleGrantedAuthority("ROLE_USER"))
                ))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));
    }

    public static final class AuthenticatedUser extends User {

        private final UUID id;

        public AuthenticatedUser(
                UUID id,
                String email,
                String passwordHash,
                List<SimpleGrantedAuthority> authorities
        ) {
            super(email, passwordHash, authorities);
            this.id = id;
        }

        public UUID getId() {
            return id;
        }
    }
}
