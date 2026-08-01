package com.pedidosdelivery.domain.port;

import java.util.UUID;

public interface TokenProviderPort {

    String generateToken(UUID userId, String email);

    UUID extractUserId(String token);

    boolean isValid(String token);
}
