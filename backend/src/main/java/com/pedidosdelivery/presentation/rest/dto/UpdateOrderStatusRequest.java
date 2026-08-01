package com.pedidosdelivery.presentation.rest.dto;

import com.pedidosdelivery.domain.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull(message = "Status é obrigatório.")
        OrderStatus status
) {
}
