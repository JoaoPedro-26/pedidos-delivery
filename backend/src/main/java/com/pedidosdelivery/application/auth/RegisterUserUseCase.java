package com.pedidosdelivery.application.auth;

import com.pedidosdelivery.domain.exception.ConflictException;
import com.pedidosdelivery.domain.model.User;
import com.pedidosdelivery.domain.port.PasswordEncoderPort;
import com.pedidosdelivery.domain.port.TokenProviderPort;
import com.pedidosdelivery.domain.port.UserRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegisterUserUseCase {

    private final UserRepositoryPort userRepository;
    private final PasswordEncoderPort passwordEncoder;
    private final TokenProviderPort tokenProvider;

    public RegisterUserUseCase(
            UserRepositoryPort userRepository,
            PasswordEncoderPort passwordEncoder,
            TokenProviderPort tokenProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse execute(RegisterUserCommand command) {
        String email = command.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Já existe um usuário com este e-mail.");
        }

        if (command.password() == null || command.password().length() < 6) {
            throw new IllegalArgumentException("A senha deve ter ao menos 6 caracteres.");
        }

        User user = User.create(
                command.name(),
                email,
                passwordEncoder.encode(command.password())
        );

        User saved = userRepository.save(user);
        String token = tokenProvider.generateToken(saved.getId(), saved.getEmail());

        return AuthResponse.bearer(
                token,
                new UserResponse(saved.getId(), saved.getName(), saved.getEmail())
        );
    }
}
