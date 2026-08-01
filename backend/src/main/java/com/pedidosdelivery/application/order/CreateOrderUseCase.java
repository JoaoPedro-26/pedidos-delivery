package com.pedidosdelivery.application.order;

import com.pedidosdelivery.domain.model.Order;
import com.pedidosdelivery.domain.model.OrderItem;
import com.pedidosdelivery.domain.port.OrderRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CreateOrderUseCase {

    private final OrderRepositoryPort orderRepository;

    public CreateOrderUseCase(OrderRepositoryPort orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public OrderResponse execute(CreateOrderCommand command) {
        List<OrderItem> items = command.items().stream()
                .map(item -> new OrderItem(item.name(), item.quantity()))
                .toList();

        Order order = Order.create(
                command.ownerId(),
                command.customerName(),
                items,
                command.deliveryAddress()
        );

        return OrderResponse.from(orderRepository.save(order));
    }
}
