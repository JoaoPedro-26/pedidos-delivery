package com.pedidosdelivery.infrastructure.persistence.adapter;

import com.pedidosdelivery.domain.model.User;
import com.pedidosdelivery.domain.port.UserRepositoryPort;
import com.pedidosdelivery.infrastructure.persistence.mapper.UserPersistenceMapper;
import com.pedidosdelivery.infrastructure.persistence.repository.SpringDataUserRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final SpringDataUserRepository repository;
    private final UserPersistenceMapper mapper;

    public UserRepositoryAdapter(SpringDataUserRepository repository, UserPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public User save(User user) {
        return mapper.toDomain(repository.save(mapper.toEntity(user)));
    }

    @Override
    public Optional<User> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email.toLowerCase()).map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email.toLowerCase());
    }
}
