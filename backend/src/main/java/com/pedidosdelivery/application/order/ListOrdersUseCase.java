package com.pedidosdelivery.application.order;

import com.pedidosdelivery.domain.port.OrderRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ListOrdersUseCase {

    private final OrderRepositoryPort orderRepository;

    public ListOrdersUseCase(OrderRepositoryPort orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> execute(UUID ownerId) {
        return orderRepository.findAllByOwnerId(ownerId).stream()
                .map(OrderResponse::from)
                .toList();
    }
}
