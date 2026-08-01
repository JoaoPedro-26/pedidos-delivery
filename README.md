# Mini Rastreador de Pedidos

Desafio técnico — sistema simplificado para criar e acompanhar pedidos de delivery.

```
pedidos-delivery/
├── frontend/   # React + TypeScript (Vite)
└── backend/    # Java 17 + Spring Boot + SQLite
```

---

## Como rodar

### Back-end

```bash
cd backend
mvn spring-boot:run
```

API em http://localhost:8080  
Banco SQLite em `backend/data/pedidos.db`

### Front-end

```bash
cd frontend
npm install
npm run dev
```

App em http://localhost:5173

Fluxo: **cadastro/login → JWT → listar / criar / atualizar pedidos**

---

## API

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| `POST` | `/api/auth/register` | público | Cadastro (nome, e-mail, senha) |
| `POST` | `/api/auth/login` | público | Login (e-mail, senha) → JWT |
| `GET` | `/api/orders` | JWT | Listar pedidos do usuário |
| `GET` | `/api/orders/{id}` | JWT | Buscar pedido por ID |
| `POST` | `/api/orders` | JWT | Criar pedido |
| `PATCH` | `/api/orders/{id}/status` | JWT | Atualizar status |

### Status do pedido

`RECEBIDO` → `EM_PREPARO` → `SAIU_PARA_ENTREGA` → `ENTREGUE`  
Em qualquer etapa ativa também é possível ir para `CANCELADO`.

Cada mudança de status gera um evento na **linha do tempo** (`statusHistory`).

---

## Arquitetura do back-end

Clean Architecture (hexagonal simplificada): o **domínio** no centro; frameworks e banco ficam nas bordas.

```
presentation  →  application  →  domain
                      ↑
               infrastructure
```

```
backend/src/main/java/com/pedidosdelivery/
├── PedidosDeliveryApplication.java
├── domain/           # regras de negócio (sem Spring)
├── application/      # casos de uso
├── infrastructure/   # banco, JWT, adapters
└── presentation/     # controllers REST
```

### `domain/` — coração do sistema

Regras de negócio puras, sem depender de framework.

| Pasta / peça | O que faz |
|--------------|-----------|
| `model/Order` | Entidade pedido (itens, endereço, status, histórico) |
| `model/User` | Entidade usuário |
| `model/OrderStatus` | Status + transições válidas |
| `model/OrderStatusEvent` | Evento da timeline (status + data/hora) |
| `port/` | Interfaces (contratos): repositório, senha, token |
| `exception/` | Erros de negócio (não encontrado, conflito, etc.) |

### `application/` — casos de uso

Orquestra o que o sistema faz. Recebe *commands* e devolve *responses*.

| Use case | Função |
|----------|--------|
| `RegisterUserUseCase` / `LoginUseCase` | Cadastro e autenticação |
| `CreateOrderUseCase` | Cria pedido em `RECEBIDO` |
| `ListOrdersUseCase` | Lista pedidos do usuário logado |
| `GetOrderByIdUseCase` | Busca por ID |
| `UpdateOrderStatusUseCase` | Atualiza status e grava histórico |

### `infrastructure/` — detalhes técnicos

Implementa os *ports* com tecnologia real.

| Pasta | Função |
|-------|--------|
| `persistence/` | JPA + SQLite (entidades, adapters, mappers) |
| `security/` | JWT, BCrypt, filtro de autenticação, CORS |
| `SecurityConfig` | Define rotas públicas vs autenticadas |

Trocar SQLite por outro banco, em geral, muda quase só esta camada.

### `presentation/` — porta HTTP

| Peça | Função |
|------|--------|
| `AuthController` | Endpoints de cadastro/login |
| `OrderController` | Endpoints de pedidos |
| `dto/` | Payloads de entrada + validação |
| `GlobalExceptionHandler` | Converte erros em respostas HTTP claras |

**Fluxo resumido:** Request → Controller → Use Case → Domain → Adapter (banco/JWT) → Response

---

## Arquitetura do front-end

Organização por **features** (domínio) + pasta `shared` para o que é reutilizável.

```
frontend/src/
├── app/                 # bootstrap, rotas, layout
├── features/
│   ├── auth/            # login, cadastro, sessão JWT
│   └── orders/          # listagem, criação, status, timeline
├── shared/              # UI genérica, HTTP client, estilos
└── mocks/               # mocks antigos (não usados na API real)
```

### `app/`

| Peça | Função |
|------|--------|
| `App.tsx` | Rotas: públicas (login/register) e protegidas |
| `AppLayout` | Header, marca, logout, shell da aplicação |
| `AuthenticatedLayout` | Envolve a área logada com o provider de pedidos |

### `features/auth/`

| Peça | Função |
|------|--------|
| `pages/LoginPage` / `RegisterPage` | Telas de autenticação |
| `hooks/useAuth` | Estado do usuário logado |
| `services/authService` | Chamadas de register/login |
| `services/tokenStorage` | Persiste JWT no `localStorage` |
| `ProtectedRoute` / `GuestRoute` | Guarda de rotas (só autenticado / só visitante) |

### `features/orders/`

| Peça | Função |
|------|--------|
| `pages/OrdersPage` | Dashboard: filtros, stats, lista, modal de criação |
| `hooks/useOrders` | Estado dos pedidos + loading por card |
| `services/httpOrderRepository` | Cliente HTTP da API de pedidos |
| `services/orderRepository` | Contrato (interface) — facilita trocar mock ↔ API |
| `components/OrderCard` | Card do pedido |
| `components/StatusTimeline` | Linha do tempo visual dos status |
| `components/StatusBadge` / `StatusActions` | Badge e botões de transição |
| `components/OrderForm` | Formulário de novo pedido |
| `types/` | Tipagens TypeScript do domínio |

### `shared/`

| Peça | Função |
|------|--------|
| `api/httpClient` | `fetch` tipado + JWT + tratamento de erro |
| `components/` | Button, Field, Modal, BrandMark |
| `styles/` | Design tokens (cores Foody) e CSS global |
| `utils/format` | Formatação de datas e itens |

**Fluxo resumido:** UI → hook/contexto → repository HTTP → API Spring Boot

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Front | React 19, TypeScript, Vite, React Router, CSS Modules |
| Back | Java 17, Spring Boot 3, Spring Security, JPA, SQLite, JWT |
| Auth | JWT + BCrypt |

Paleta visual inspirada em [Foody Delivery](https://foodydelivery.com/).
