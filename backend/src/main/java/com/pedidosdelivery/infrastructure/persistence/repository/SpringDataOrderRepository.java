package com.pedidosdelivery.infrastructure.persistence.repository;

import com.pedidosdelivery.infrastructure.persistence.entity.OrderJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataOrderRepository extends JpaRepository<OrderJpaEntity, UUID> {

    List<OrderJpaEntity> findAllByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
