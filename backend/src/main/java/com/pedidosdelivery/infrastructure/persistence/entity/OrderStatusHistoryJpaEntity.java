package com.pedidosdelivery.infrastructure.persistence.entity;

import com.pedidosdelivery.domain.model.OrderStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "order_status_history")
public class OrderStatusHistoryJpaEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderJpaEntity order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    protected OrderStatusHistoryJpaEntity() {
    }

    public OrderStatusHistoryJpaEntity(UUID id, OrderStatus status, Instant occurredAt) {
        this.id = id;
        this.status = status;
        this.occurredAt = occurredAt;
    }

    public UUID getId() {
        return id;
    }

    public OrderJpaEntity getOrder() {
        return order;
    }

    public void setOrder(OrderJpaEntity order) {
        this.order = order;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }
}
