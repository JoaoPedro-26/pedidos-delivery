# Mini Rastreador de Pedidos — API

Backend Spring Boot com Clean Architecture (hexagonal simplificada).

## Camadas

```
domain/           → regras de negócio, entidades e ports
application/      → use cases (casos de uso)
infrastructure/   → JPA/SQLite, JWT, adapters
presentation/     → controllers REST e DTOs HTTP
```

## Endpoints

| Método | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | público |
| POST | `/api/auth/login` | público |
| GET | `/api/orders` | JWT |
| GET | `/api/orders/{id}` | JWT |
| POST | `/api/orders` | JWT |
| PATCH | `/api/orders/{id}/status` | JWT |

## Rodar

```bash
mvn spring-boot:run
```

API em http://localhost:8080

Banco SQLite criado em `backend/data/pedidos.db`.
