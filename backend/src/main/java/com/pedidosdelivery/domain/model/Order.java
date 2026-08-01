package com.pedidosdelivery.domain.model;

import com.pedidosdelivery.domain.exception.BusinessRuleException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class Order {

    private final UUID id;
    private final UUID ownerId;
    private String customerName;
    private List<OrderItem> items;
    private String deliveryAddress;
    private OrderStatus status;
    private final List<OrderStatusEvent> statusHistory;
    private final Instant createdAt;
    private Instant updatedAt;

    private Order(
            UUID id,
            UUID ownerId,
            String customerName,
            List<OrderItem> items,
            String deliveryAddress,
            OrderStatus status,
            List<OrderStatusEvent> statusHistory,
            Instant createdAt,
            Instant updatedAt
    ) {
        this.id = Objects.requireNonNull(id, "id");
        this.ownerId = Objects.requireNonNull(ownerId, "ownerId");
        this.customerName = requireText(customerName, "Nome do cliente");
        this.items = validateItems(items);
        this.deliveryAddress = requireText(deliveryAddress, "Endereço de entrega");
        this.status = Objects.requireNonNull(status, "status");
        this.statusHistory = new ArrayList<>(Objects.requireNonNull(statusHistory, "statusHistory"));
        this.createdAt = Objects.requireNonNull(createdAt, "createdAt");
        this.updatedAt = Objects.requireNonNull(updatedAt, "updatedAt");

        if (this.statusHistory.isEmpty()) {
            throw new IllegalArgumentException("Histórico de status não pode ser vazio.");
        }
    }

    public static Order create(UUID ownerId, String customerName, List<OrderItem> items, String deliveryAddress) {
        Instant now = Instant.now();
        return new Order(
                UUID.randomUUID(),
                ownerId,
                customerName,
                items,
                deliveryAddress,
                OrderStatus.RECEBIDO,
                List.of(new OrderStatusEvent(OrderStatus.RECEBIDO, now)),
                now,
                now
        );
    }

    public static Order restore(
            UUID id,
            UUID ownerId,
            String customerName,
            List<OrderItem> items,
            String deliveryAddress,
            OrderStatus status,
            List<OrderStatusEvent> statusHistory,
            Instant createdAt,
            Instant updatedAt
    ) {
        List<OrderStatusEvent> history = statusHistory == null || statusHistory.isEmpty()
                ? synthesizeHistory(status, createdAt, updatedAt)
                : statusHistory;

        return new Order(id, ownerId, customerName, items, deliveryAddress, status, history, createdAt, updatedAt);
    }

    public void changeStatus(OrderStatus nextStatus) {
        if (!status.canTransitionTo(nextStatus)) {
            throw new BusinessRuleException(
                    "Transição inválida de " + status + " para " + nextStatus + "."
            );
        }
        Instant now = Instant.now();
        this.status = nextStatus;
        this.updatedAt = now;
        this.statusHistory.add(new OrderStatusEvent(nextStatus, now));
    }

    public UUID getId() {
        return id;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public List<OrderStatusEvent> getStatusHistory() {
        return Collections.unmodifiableList(statusHistory);
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    private static List<OrderStatusEvent> synthesizeHistory(
            OrderStatus status,
            Instant createdAt,
            Instant updatedAt
    ) {
        List<OrderStatusEvent> history = new ArrayList<>();
        history.add(new OrderStatusEvent(OrderStatus.RECEBIDO, createdAt));
        if (status != OrderStatus.RECEBIDO) {
            history.add(new OrderStatusEvent(status, updatedAt));
        }
        return history;
    }

    private static String requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " é obrigatório.");
        }
        return value.trim();
    }

    private static List<OrderItem> validateItems(List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Pedido deve conter ao menos um item.");
        }
        return new ArrayList<>(items);
    }
}
