package com.pedidosdelivery.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class OrderItemEmbeddable {

    @Column(name = "item_name", nullable = false)
    private String name;

    @Column(name = "item_quantity", nullable = false)
    private int quantity;

    protected OrderItemEmbeddable() {
    }

    public OrderItemEmbeddable(String name, int quantity) {
        this.name = name;
        this.quantity = quantity;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }
}
