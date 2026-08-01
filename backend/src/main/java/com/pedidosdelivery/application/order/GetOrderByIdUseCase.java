package com.pedidosdelivery.application.order;

import com.pedidosdelivery.domain.exception.ResourceNotFoundException;
import com.pedidosdelivery.domain.port.OrderRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GetOrderByIdUseCase {

    private final OrderRepositoryPort orderRepository;

    public GetOrderByIdUseCase(OrderRepositoryPort orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public OrderResponse execute(UUID orderId, UUID ownerId) {
        return orderRepository.findById(orderId)
                .filter(order -> order.getOwnerId().equals(ownerId))
                .map(OrderResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado."));
    }
}
