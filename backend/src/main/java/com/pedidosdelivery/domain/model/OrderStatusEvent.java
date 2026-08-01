package com.pedidosdelivery.domain.model;

import java.time.Instant;
import java.util.Objects;

public final class OrderStatusEvent {

    private final OrderStatus status;
    private final Instant occurredAt;

    public OrderStatusEvent(OrderStatus status, Instant occurredAt) {
        this.status = Objects.requireNonNull(status, "status");
        this.occurredAt = Objects.requireNonNull(occurredAt, "occurredAt");
    }

    public OrderStatus getStatus() {
        return status;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }
}
