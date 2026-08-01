package com.pedidosdelivery.domain.model;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class OrderStatusTransitionTest {

    @Test
    void shouldAllowValidFlowUntilDeliveredAndTrackHistory() {
        Order order = Order.create(
                java.util.UUID.randomUUID(),
                "Cliente",
                List.of(new OrderItem("Pizza", 1)),
                "Rua 1"
        );

        assertEquals(1, order.getStatusHistory().size());
        assertEquals(OrderStatus.RECEBIDO, order.getStatusHistory().get(0).getStatus());

        order.changeStatus(OrderStatus.EM_PREPARO);
        order.changeStatus(OrderStatus.SAIU_PARA_ENTREGA);
        order.changeStatus(OrderStatus.ENTREGUE);

        assertEquals(OrderStatus.ENTREGUE, order.getStatus());
        assertEquals(4, order.getStatusHistory().size());
        assertEquals(OrderStatus.ENTREGUE, order.getStatusHistory().get(3).getStatus());
    }

    @Test
    void shouldRejectInvalidTransition() {
        Order order = Order.create(
                java.util.UUID.randomUUID(),
                "Cliente",
                List.of(new OrderItem("Pizza", 1)),
                "Rua 1"
        );

        assertThrows(RuntimeException.class, () -> order.changeStatus(OrderStatus.ENTREGUE));
    }
}
