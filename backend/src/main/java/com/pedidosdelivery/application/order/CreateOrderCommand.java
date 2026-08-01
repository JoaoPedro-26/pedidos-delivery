package com.pedidosdelivery.application.order;

import java.util.List;
import java.util.UUID;

public record CreateOrderCommand(
        UUID ownerId,
        String customerName,
        List<OrderItemCommand> items,
        String deliveryAddress
) {
}
