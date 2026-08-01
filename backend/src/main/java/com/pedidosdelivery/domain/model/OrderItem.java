package com.pedidosdelivery.domain.model;

import java.util.Objects;

public final class OrderItem {

    private final String name;
    private final int quantity;

    public OrderItem(String name, int quantity) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Nome do item é obrigatório.");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }
        this.name = name.trim();
        this.quantity = quantity;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrderItem that)) {
            return false;
        }
        return quantity == that.quantity && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, quantity);
    }
}
