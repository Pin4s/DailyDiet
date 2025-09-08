## Introdução  
Este projeto é um desafio proposto pela **Rocketseat**, onde são fornecidos requisitos de sistema e o desenvolvedor deve criar uma solução com base neles.  

A aplicação desenvolvida é o **back-end/API do DailyDiet**, um app para controle de refeições e acompanhamento da dieta do usuário.  

### Funcionalidades  
- Registrar refeições com data e horário  
- Marcar se a refeição está **dentro ou fora da dieta**  
- Consultar estatísticas como a **maior sequência de refeições dentro da dieta**  
- E outras funcionalidades de acompanhamento  

## Status do Desenvolvimento 🚧  
O projeto está atualmente **em andamento**, recebendo novas funcionalidades e melhorias contínuas.  


# RF (Requisitos Funcionais)

- [x] Criar usuário
- [x] Identificar usuário entre requisições
- [x] Registrar refeição
- [x] Editar refeição
- [x] Apagar refeição
- [x] Listar todas as refeições de um usuário
- [x] Visualizar uma refeição
- [x] Recuperar métricas do usuário
  - [x] Quantidade total de refeições
  - [x] Refeições dentro da dieta
  - [x] Refeições fora da dieta
  - [x] Melhor sequência dentro da dieta

# RN (Regras de Negócio)

- Refeições devem estar vinculadas a um usuário
- Usuário só pode visualizar, editar e apagar suas próprias refeições

# RNF (Requisitos Não Funcionais) — opcional

- [x] Persistência em banco de dados
- [x] API REST com respostas padronizadas
- [x] Testes automatizados


# Rotas 🚧 (em andamento)

## 1️⃣ Usuários (/users)
| Método | Rota       | Descrição                        |
|--------|------------|----------------------------------|
| POST   | /users     | Criar novo usuário (signup)      |
| GET    | /users/:id | Obter dados de um usuário por ID |
| PUT    | /users/:id | Atualizar dados de um usuário    |
| DELETE | /users/:id | Deletar usuário                  |

## 2️⃣ Autenticação (/auth)
| Método | Rota        | Descrição                          |
|--------|-------------|------------------------------------|
| POST   | /auth/login | Autenticar usuário (retorna token) |
| POST   | /auth/logout | Encerrar sessão (opcional)        |

## 3️⃣ Refeições (/meals)
| Método | Rota        | Descrição                             |
|--------|-------------|---------------------------------------|
| POST   | /meals      | Criar nova refeição                   |
| GET    | /meals/:id  | Obter refeição específica             |
| GET    | /meals      | Listar todas as refeições do usuário  |
| PUT    | /meals/:id  | Atualizar uma refeição                |
| DELETE | /meals/:id  | Deletar uma refeição                  |

## 4️⃣ Estatísticas (/stats)
| Método | Rota   | Descrição                                                      |
|--------|--------|----------------------------------------------------------------|
| GET    | /stats | Retorna estatísticas do usuário (sequência, dentro/fora dieta) |