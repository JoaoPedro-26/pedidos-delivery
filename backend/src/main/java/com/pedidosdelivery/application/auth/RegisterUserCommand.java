package com.pedidosdelivery.application.auth;

public record RegisterUserCommand(String name, String email, String password) {
}
