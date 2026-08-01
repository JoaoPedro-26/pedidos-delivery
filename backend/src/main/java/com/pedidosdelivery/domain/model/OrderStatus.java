package com.pedidosdelivery.domain.model;

import java.util.EnumSet;
import java.util.Set;

public enum OrderStatus {
    RECEBIDO,
    EM_PREPARO,
    SAIU_PARA_ENTREGA,
    ENTREGUE,
    CANCELADO;

    private static final Set<OrderStatus> FROM_RECEBIDO = EnumSet.of(EM_PREPARO, CANCELADO);
    private static final Set<OrderStatus> FROM_EM_PREPARO = EnumSet.of(SAIU_PARA_ENTREGA, CANCELADO);
    private static final Set<OrderStatus> FROM_SAIU = EnumSet.of(ENTREGUE, CANCELADO);

    public boolean canTransitionTo(OrderStatus next) {
        return switch (this) {
            case RECEBIDO -> FROM_RECEBIDO.contains(next);
            case EM_PREPARO -> FROM_EM_PREPARO.contains(next);
            case SAIU_PARA_ENTREGA -> FROM_SAIU.contains(next);
            case ENTREGUE, CANCELADO -> false;
        };
    }
}
