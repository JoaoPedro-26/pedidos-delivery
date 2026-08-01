package com.pedidosdelivery.infrastructure.persistence.entity;

import com.pedidosdelivery.domain.model.OrderStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class OrderJpaEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
    private List<OrderItemEmbeddable> items = new ArrayList<>();

    @Column(name = "delivery_address", nullable = false, length = 500)
    private String deliveryAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("occurredAt ASC")
    private List<OrderStatusHistoryJpaEntity> statusHistory = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected OrderJpaEntity() {
    }

    public OrderJpaEntity(
            UUID id,
            UUID ownerId,
            String customerName,
            List<OrderItemEmbeddable> items,
            String deliveryAddress,
            OrderStatus status,
            Instant createdAt,
            Instant updatedAt
    ) {
        this.id = id;
        this.ownerId = ownerId;
        this.customerName = customerName;
        this.items = items;
        this.deliveryAddress = deliveryAddress;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public void replaceStatusHistory(List<OrderStatusHistoryJpaEntity> entries) {
        statusHistory.clear();
        for (OrderStatusHistoryJpaEntity entry : entries) {
            entry.setOrder(this);
            statusHistory.add(entry);
        }
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

    public List<OrderItemEmbeddable> getItems() {
        return items;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public List<OrderStatusHistoryJpaEntity> getStatusHistory() {
        return statusHistory;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setItems(List<OrderItemEmbeddable> items) {
        this.items = items;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
