package com.pedidosdelivery.application.auth;

import com.pedidosdelivery.domain.exception.UnauthorizedException;
import com.pedidosdelivery.domain.model.User;
import com.pedidosdelivery.domain.port.PasswordEncoderPort;
import com.pedidosdelivery.domain.port.TokenProviderPort;
import com.pedidosdelivery.domain.port.UserRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginUseCase {

    private final UserRepositoryPort userRepository;
    private final PasswordEncoderPort passwordEncoder;
    private final TokenProviderPort tokenProvider;

    public LoginUseCase(
            UserRepositoryPort userRepository,
            PasswordEncoderPort passwordEncoder,
            TokenProviderPort tokenProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional(readOnly = true)
    public AuthResponse execute(LoginCommand command) {
        String email = command.email().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Credenciais inválidas."));

        if (!passwordEncoder.matches(command.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Credenciais inválidas.");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        return AuthResponse.bearer(
                token,
                new UserResponse(user.getId(), user.getName(), user.getEmail())
        );
    }
}
