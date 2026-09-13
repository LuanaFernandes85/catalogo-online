# Catálogo Digital para Lojas

Sistema web para qualquer loja (roupas, calçados, tênis, jogos, cosméticos, eletrônicos etc.)
ter um catálogo online e receber pedidos direto no WhatsApp.

## Arquitetura

O projeto tem **duas áreas totalmente separadas**, que nunca compartilham telas ou navegação:

- **Catálogo público** — `/:storeSlug` (ex: `/loja-da-maria`). Sem login. É só o que os
  clientes da loja acessam: banner, logo, busca, categorias, produtos, carrinho e o botão
  "Enviar Pedido" (abre o WhatsApp da loja com o pedido preenchido).
- **Painel administrativo** — `/admin/*`. Exige login (Firebase Authentication) e é
  totalmente protegido por `ProtectedRoute`. O código do catálogo público nunca importa
  nada do painel administrativo, e vice-versa.

O banco de dados já nasce **multi-tenant**, pronto para virar SaaS:

```
stores/{storeId}
  name, slug, logoUrl, bannerUrl, whatsapp, instagram, facebook, address, hours
  stores/{storeId}/products/{productId}
  stores/{storeId}/categories/{categoryId}

users/{uid}
  storeId   -> conecta o login do lojista à loja que ele administra
```

Cada loja tem seu próprio `slug` (usado na URL pública) e seus próprios produtos e
categorias, isolados dos de outras lojas. Adicionar uma nova loja no futuro é só criar um
novo documento em `stores` e um usuário apontando para ela — nenhuma mudança de código é
necessária.

## Passo a passo para rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar um projeto no Firebase

No [console do Firebase](https://console.firebase.google.com):

1. Crie um projeto.
2. Ative **Authentication** → método **E-mail/senha**.
3. Ative **Firestore Database** (modo produção).
4. Ative **Storage**.
5. Em "Configurações do projeto" → "Seus apps", crie um app Web e copie as credenciais.

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e preencha com as credenciais copiadas no passo anterior.

### 4. Publicar as regras de segurança

Este projeto inclui `firestore.rules` e `storage.rules` já prontas para o modelo
multi-tenant (cada lojista só edita a própria loja; o catálogo é público para leitura).
Publique-as pelo [Firebase CLI](https://firebase.google.com/docs/cli) ou colando o
conteúdo direto no console, em Firestore → Regras e Storage → Regras.

### 5. Criar a primeira loja e o primeiro usuário administrador

Ainda não há tela de "criar conta" (o painel é só para quem já é dono de uma loja
cadastrada). Para criar a primeira loja:

1. Em **Authentication**, crie um usuário com e-mail e senha (será o login do lojista).
2. Copie o **UID** desse usuário.
3. Em **Firestore**, crie um documento em `stores` (deixe o Firestore gerar o ID, ou
   escolha um) com campos como:
   ```json
   {
     "name": "Minha Loja",
     "slug": "minha-loja",
     "whatsapp": "5511999999999"
   }
   ```
4. Copie o **ID desse documento** (o `storeId`).
5. Crie um documento em `users` com o **ID igual ao UID do usuário** (passo 2) e um campo:
   ```json
   { "storeId": "ID_DA_LOJA_DO_PASSO_4" }
   ```

Pronto — esse usuário já consegue logar em `/admin/login` e vai enxergar a loja criada.

### 6. Rodar em desenvolvimento

```bash
npm run dev
```

- Painel administrativo: `http://localhost:5173/admin/login`
- Catálogo público da loja criada: `http://localhost:5173/minha-loja`

## Funcionalidades

**Catálogo público:** banner, logo, busca, filtro por categoria, detalhes do produto,
seleção de quantidade, carrinho (adicionar/remover), resumo do pedido e envio automático
via WhatsApp com todos os produtos e quantidades na mensagem.

**Painel administrativo:** Dashboard (contagem de produtos/categorias), Produtos
(cadastrar, editar, excluir, ativar/desativar, várias fotos, destaque, promoção,
disponibilidade), Categorias (criar/editar/excluir — produtos sem categoria continuam
aparecendo no catálogo), Banner (upload de banner e logo), Configurações (WhatsApp,
Instagram, Facebook, endereço, horário) e Minha Conta (alterar senha e dados pessoais).

## Stack técnica

React 18 + Vite, React Router, Firebase (Authentication, Firestore, Storage), Tailwind CSS,
lucide-react para ícones.

## Próximos passos sugeridos para virar SaaS completo

- Tela de cadastro self-service (criação automática de `stores` + `users` no signup).
- Papéis de usuário (ex: funcionário x dono) dentro de uma mesma loja.
- Planos e cobrança recorrente.
- Domínio próprio por loja (hoje o isolamento já é feito por `slug`).
