package com.pedidosdelivery.application.order;

import com.pedidosdelivery.domain.exception.ResourceNotFoundException;
import com.pedidosdelivery.domain.model.Order;
import com.pedidosdelivery.domain.port.OrderRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateOrderStatusUseCase {

    private final OrderRepositoryPort orderRepository;

    public UpdateOrderStatusUseCase(OrderRepositoryPort orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public OrderResponse execute(UpdateOrderStatusCommand command) {
        Order order = orderRepository.findById(command.orderId())
                .filter(found -> found.getOwnerId().equals(command.ownerId()))
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado."));

        order.changeStatus(command.status());
        return OrderResponse.from(orderRepository.save(order));
    }
}
