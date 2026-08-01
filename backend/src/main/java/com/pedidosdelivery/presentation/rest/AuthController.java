package com.pedidosdelivery.presentation.rest;

import com.pedidosdelivery.application.auth.AuthResponse;
import com.pedidosdelivery.application.auth.LoginCommand;
import com.pedidosdelivery.application.auth.LoginUseCase;
import com.pedidosdelivery.application.auth.RegisterUserCommand;
import com.pedidosdelivery.application.auth.RegisterUserUseCase;
import com.pedidosdelivery.presentation.rest.dto.LoginRequest;
import com.pedidosdelivery.presentation.rest.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUseCase loginUseCase;

    public AuthController(RegisterUserUseCase registerUserUseCase, LoginUseCase loginUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUseCase = loginUseCase;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return registerUserUseCase.execute(
                new RegisterUserCommand(request.name(), request.email(), request.password())
        );
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return loginUseCase.execute(new LoginCommand(request.email(), request.password()));
    }
}
