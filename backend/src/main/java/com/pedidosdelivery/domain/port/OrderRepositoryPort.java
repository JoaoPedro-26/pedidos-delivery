package com.pedidosdelivery.domain.port;

import com.pedidosdelivery.domain.model.Order;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepositoryPort {

    Order save(Order order);

    Optional<Order> findById(UUID id);

    List<Order> findAllByOwnerId(UUID ownerId);
}
