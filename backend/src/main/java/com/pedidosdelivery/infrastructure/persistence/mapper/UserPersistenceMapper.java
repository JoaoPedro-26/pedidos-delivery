package com.pedidosdelivery.infrastructure.persistence.mapper;

import com.pedidosdelivery.domain.model.User;
import com.pedidosdelivery.infrastructure.persistence.entity.UserJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class UserPersistenceMapper {

    public UserJpaEntity toEntity(User user) {
        return new UserJpaEntity(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getCreatedAt()
        );
    }

    public User toDomain(UserJpaEntity entity) {
        return User.restore(
                entity.getId(),
                entity.getName(),
                entity.getEmail(),
                entity.getPasswordHash(),
                entity.getCreatedAt()
        );
    }
}
