package com.pedidosdelivery.presentation.rest.support;

import com.pedidosdelivery.infrastructure.security.AuthenticatedUserDetailsService.AuthenticatedUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public final class CurrentUser {

    private CurrentUser() {
    }

    public static UUID id() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new IllegalStateException("Usuário autenticado não encontrado no contexto.");
        }
        return user.getId();
    }
}
