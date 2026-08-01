package com.pedidosdelivery.application.order;

import com.pedidosdelivery.domain.model.Order;
import com.pedidosdelivery.domain.model.OrderItem;
import com.pedidosdelivery.domain.model.OrderStatus;
import com.pedidosdelivery.domain.model.OrderStatusEvent;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        String customerName,
        List<OrderItemResponse> items,
        String deliveryAddress,
        OrderStatus status,
        List<StatusHistoryResponse> statusHistory,
        Instant createdAt,
        Instant updatedAt
) {

    public static OrderResponse from(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(OrderItemResponse::from)
                .toList();

        List<StatusHistoryResponse> history = order.getStatusHistory().stream()
                .map(StatusHistoryResponse::from)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                items,
                order.getDeliveryAddress(),
                order.getStatus(),
                history,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    public record OrderItemResponse(String name, int quantity) {
        public static OrderItemResponse from(OrderItem item) {
            return new OrderItemResponse(item.getName(), item.getQuantity());
        }
    }

    public record StatusHistoryResponse(OrderStatus status, Instant occurredAt) {
        public static StatusHistoryResponse from(OrderStatusEvent event) {
            return new StatusHistoryResponse(event.getStatus(), event.getOccurredAt());
        }
    }
}
