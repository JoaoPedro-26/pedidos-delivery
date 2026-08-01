package com.pedidosdelivery.presentation.rest.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateOrderRequest(
        @NotBlank(message = "Nome do cliente é obrigatório.")
        String customerName,

        @NotEmpty(message = "Informe ao menos um item.")
        List<@Valid OrderItemRequest> items,

        @NotBlank(message = "Endereço de entrega é obrigatório.")
        String deliveryAddress
) {

    public record OrderItemRequest(
            @NotBlank(message = "Nome do item é obrigatório.")
            String name,

            @NotNull(message = "Quantidade é obrigatória.")
            @Min(value = 1, message = "Quantidade deve ser maior que zero.")
            Integer quantity
    ) {
    }
}
