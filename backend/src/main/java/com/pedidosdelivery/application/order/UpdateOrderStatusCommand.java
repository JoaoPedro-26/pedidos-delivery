package com.pedidosdelivery.application.order;

import com.pedidosdelivery.domain.model.OrderStatus;

import java.util.UUID;

public record UpdateOrderStatusCommand(
        UUID orderId,
        UUID ownerId,
        OrderStatus status
) {
}
