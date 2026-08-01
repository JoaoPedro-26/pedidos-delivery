package com.pedidosdelivery.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public class User {

    private final UUID id;
    private final String name;
    private final String email;
    private final String passwordHash;
    private final Instant createdAt;

    private User(UUID id, String name, String email, String passwordHash, Instant createdAt) {
        this.id = Objects.requireNonNull(id, "id");
        this.name = requireText(name, "Nome");
        this.email = normalizeEmail(email);
        this.passwordHash = requireText(passwordHash, "Senha");
        this.createdAt = Objects.requireNonNull(createdAt, "createdAt");
    }

    public static User create(String name, String email, String passwordHash) {
        return new User(UUID.randomUUID(), name, email, passwordHash, Instant.now());
    }

    public static User restore(UUID id, String name, String email, String passwordHash, Instant createdAt) {
        return new User(id, name, email, passwordHash, createdAt);
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    private static String requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " é obrigatório.");
        }
        return value.trim();
    }

    private static String normalizeEmail(String email) {
        String normalized = requireText(email, "E-mail").toLowerCase();
        if (!normalized.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }
        return normalized;
    }
}
