package com.pedidosdelivery.infrastructure.persistence.mapper;

import com.pedidosdelivery.domain.model.Order;
import com.pedidosdelivery.domain.model.OrderItem;
import com.pedidosdelivery.domain.model.OrderStatusEvent;
import com.pedidosdelivery.infrastructure.persistence.entity.OrderItemEmbeddable;
import com.pedidosdelivery.infrastructure.persistence.entity.OrderJpaEntity;
import com.pedidosdelivery.infrastructure.persistence.entity.OrderStatusHistoryJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class OrderPersistenceMapper {

    public OrderJpaEntity toEntity(Order order) {
        List<OrderItemEmbeddable> items = order.getItems().stream()
                .map(item -> new OrderItemEmbeddable(item.getName(), item.getQuantity()))
                .toList();

        OrderJpaEntity entity = new OrderJpaEntity(
                order.getId(),
                order.getOwnerId(),
                order.getCustomerName(),
                items,
                order.getDeliveryAddress(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
        entity.replaceStatusHistory(toHistoryEntities(order.getStatusHistory()));
        return entity;
    }

    public void updateEntity(OrderJpaEntity entity, Order order) {
        entity.setCustomerName(order.getCustomerName());
        entity.setDeliveryAddress(order.getDeliveryAddress());
        entity.setStatus(order.getStatus());
        entity.setUpdatedAt(order.getUpdatedAt());
        appendMissingHistory(entity, order.getStatusHistory());
    }

    public Order toDomain(OrderJpaEntity entity) {
        List<OrderItem> items = entity.getItems().stream()
                .map(item -> new OrderItem(item.getName(), item.getQuantity()))
                .toList();

        List<OrderStatusEvent> history = entity.getStatusHistory().stream()
                .map(entry -> new OrderStatusEvent(entry.getStatus(), entry.getOccurredAt()))
                .toList();

        return Order.restore(
                entity.getId(),
                entity.getOwnerId(),
                entity.getCustomerName(),
                items,
                entity.getDeliveryAddress(),
                entity.getStatus(),
                history,
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    private void appendMissingHistory(OrderJpaEntity entity, List<OrderStatusEvent> domainHistory) {
        List<OrderStatusHistoryJpaEntity> persisted = entity.getStatusHistory();
        if (domainHistory.size() <= persisted.size()) {
            return;
        }

        for (int index = persisted.size(); index < domainHistory.size(); index++) {
            OrderStatusEvent event = domainHistory.get(index);
            OrderStatusHistoryJpaEntity entry = new OrderStatusHistoryJpaEntity(
                    UUID.randomUUID(),
                    event.getStatus(),
                    event.getOccurredAt()
            );
            entry.setOrder(entity);
            persisted.add(entry);
        }
    }

    private List<OrderStatusHistoryJpaEntity> toHistoryEntities(List<OrderStatusEvent> events) {
        return events.stream()
                .map(event -> new OrderStatusHistoryJpaEntity(
                        UUID.randomUUID(),
                        event.getStatus(),
                        event.getOccurredAt()
                ))
                .toList();
    }
}
