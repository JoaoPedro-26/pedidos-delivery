package com.pedidosdelivery.infrastructure.persistence.adapter;

import com.pedidosdelivery.domain.model.Order;
import com.pedidosdelivery.domain.port.OrderRepositoryPort;
import com.pedidosdelivery.infrastructure.persistence.entity.OrderJpaEntity;
import com.pedidosdelivery.infrastructure.persistence.mapper.OrderPersistenceMapper;
import com.pedidosdelivery.infrastructure.persistence.repository.SpringDataOrderRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class OrderRepositoryAdapter implements OrderRepositoryPort {

    private final SpringDataOrderRepository repository;
    private final OrderPersistenceMapper mapper;

    public OrderRepositoryAdapter(SpringDataOrderRepository repository, OrderPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Order save(Order order) {
        Optional<OrderJpaEntity> existing = repository.findById(order.getId());

        OrderJpaEntity entity = existing
                .map(found -> {
                    mapper.updateEntity(found, order);
                    return found;
                })
                .orElseGet(() -> mapper.toEntity(order));

        return mapper.toDomain(repository.save(entity));
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Order> findAllByOwnerId(UUID ownerId) {
        return repository.findAllByOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .map(mapper::toDomain)
                .toList();
    }
}
