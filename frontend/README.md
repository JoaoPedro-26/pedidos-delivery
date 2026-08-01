# Mini Rastreador de Pedidos (Frontend)

React + TypeScript + Vite, integrado à API Spring Boot.

## Rodar

Suba o backend antes (`cd backend && mvn spring-boot:run`).

```bash
npm install
npm run dev
```

http://localhost:5173

## Fluxo

1. Cadastro ou login (`/register`, `/login`)
2. JWT salvo no `localStorage`
3. Pedidos via `GET/POST/PATCH /api/orders`

Variável de ambiente: `VITE_API_URL` (padrão `http://localhost:8080`).
