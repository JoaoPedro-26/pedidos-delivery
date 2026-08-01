package com.pedidosdelivery.presentation.rest;

import com.pedidosdelivery.application.order.CreateOrderCommand;
import com.pedidosdelivery.application.order.CreateOrderUseCase;
import com.pedidosdelivery.application.order.GetOrderByIdUseCase;
import com.pedidosdelivery.application.order.ListOrdersUseCase;
import com.pedidosdelivery.application.order.OrderItemCommand;
import com.pedidosdelivery.application.order.OrderResponse;
import com.pedidosdelivery.application.order.UpdateOrderStatusCommand;
import com.pedidosdelivery.application.order.UpdateOrderStatusUseCase;
import com.pedidosdelivery.presentation.rest.dto.CreateOrderRequest;
import com.pedidosdelivery.presentation.rest.dto.UpdateOrderStatusRequest;
import com.pedidosdelivery.presentation.rest.support.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final CreateOrderUseCase createOrderUseCase;
    private final ListOrdersUseCase listOrdersUseCase;
    private final GetOrderByIdUseCase getOrderByIdUseCase;
    private final UpdateOrderStatusUseCase updateOrderStatusUseCase;

    public OrderController(
            CreateOrderUseCase createOrderUseCase,
            ListOrdersUseCase listOrdersUseCase,
            GetOrderByIdUseCase getOrderByIdUseCase,
            UpdateOrderStatusUseCase updateOrderStatusUseCase
    ) {
        this.createOrderUseCase = createOrderUseCase;
        this.listOrdersUseCase = listOrdersUseCase;
        this.getOrderByIdUseCase = getOrderByIdUseCase;
        this.updateOrderStatusUseCase = updateOrderStatusUseCase;
    }

    @GetMapping
    public List<OrderResponse> list() {
        return listOrdersUseCase.execute(CurrentUser.id());
    }

    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable UUID id) {
        return getOrderByIdUseCase.execute(id, CurrentUser.id());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        List<OrderItemCommand> items = request.items().stream()
                .map(item -> new OrderItemCommand(item.name(), item.quantity()))
                .toList();

        return createOrderUseCase.execute(
                new CreateOrderCommand(
                        CurrentUser.id(),
                        request.customerName(),
                        items,
                        request.deliveryAddress()
                )
        );
    }

    @PatchMapping("/{id}/status")
    public OrderResponse updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return updateOrderStatusUseCase.execute(
                new UpdateOrderStatusCommand(id, CurrentUser.id(), request.status())
        );
    }
}
