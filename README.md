# GDASH Desafio Técnico 2025.2

## Como rodar localmente (com Docker)
1. Copie `.env.example` para `.env` e ajuste valores.
2. Rode: docker compose up --build
3. Acesse:
   - Backend: http://localhost:3000/api
   - Frontend: http://localhost:5173
   - RabbitMQ management: http://localhost:15672 (guest/guest)

## Fluxo
Python Producer (collect) -> RabbitMQ -> Go Worker -> POST /api/weather/logs -> MongoDB -> Frontend consulta

## Testes
- Backend: cd backend-nestjs && npm test
- Frontend: cd frontend && npm test
