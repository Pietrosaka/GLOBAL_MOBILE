# 🗳️ Sistema de Votação e Enquetes em Tempo Real

Este é um **aplicativo de página única (SPA)** desenvolvido em **React**, que permite a **criação e participação em enquetes de votação em tempo real**.  
Os dados são armazenados e sincronizados de forma colaborativa no **Firebase Firestore**, garantindo que todos os usuários vejam as atualizações instantaneamente.

---

## 🚀 Funcionalidades Principais

- **Criação de Enquetes:** Permite criar novas perguntas com opções de resposta personalizadas.  
- **Votação em Tempo Real:** Vote nas enquetes disponíveis e veja os resultados atualizados instantaneamente.  
- **Contagem Dinâmica de Votos:** Exibição dos resultados em barras de progresso (porcentagem) atualizadas em tempo real.  
- **Persistência de Dados (Firestore):** Enquetes e votos são salvos de forma permanente e segura no Firebase.  
- **Experiência de Usuário Moderna:** Interface responsiva e estilizada com **Tailwind CSS**.  
- **Usuários Colaborativos:** Suporte para múltiplos usuários interagirem simultaneamente.  

---

## 💻 Tecnologias Utilizadas

| Categoria | Tecnologia |
|------------|-------------|
| **Frontend** | React (Componentes Funcionais + Hooks) |
| **Estilização** | Tailwind CSS |
| **Banco de Dados** | Firebase Firestore |
| **Autenticação** | Firebase Auth (Custom Token ou Anônima) |

---

## 🗄️ Estrutura de Dados (Firestore)

Os dados são armazenados em uma coleção pública, permitindo a interação em tempo real entre os usuários.
```
/artifacts/{appId}/public/data/polls
```
### Documento (Poll)
```json
{
  "id": "UUID_DA_ENQUETE",
  "question": "Qual é a sua linguagem de programação favorita?",
  "options": [
    { "id": "op1", "text": "JavaScript", "votes": 42 },
    { "id": "op2", "text": "Python", "votes": 35 }
  ]
}
```
⚙️ Criação e Votação

Criação de Nova Enquete:
Um novo documento é adicionado à coleção polls com a pergunta e suas opções.

Votação:
Ao votar, o campo votes da opção selecionada é incrementado via transação Firestore, garantindo a consistência dos dados.

Atualização em Tempo Real:
O app utiliza onSnapshot() para refletir imediatamente as mudanças no Firestore na interface do usuário.
🛠️ Executando o Projeto
1. Configuração do Firebase

Crie um projeto no Firebase Console
.

Habilite o Firestore Database e o Firebase Authentication.

2. Variáveis de Ambiente

O aplicativo utiliza as seguintes variáveis injetadas pelo ambiente de hospedagem:
```
__app_id
__firebase_config
__initial_auth_token
```
3. Dependências

Certifique-se de importar as bibliotecas Firebase via CDN ou npm:
```
npm install firebase react
```
4. Inicialização

O app inicializa o Firebase.

Autentica o usuário (com Custom Token ou anonimamente).

Cria listeners de tempo real no Firestore para exibir e atualizar as enquetes.

🧩 Estrutura do Projeto (Simplificada)
```
src/
├── components/
│   ├── PollList.jsx
│   ├── PollCreator.jsx
│   └── PollResults.jsx
├── firebase/
│   └── config.js
└── App.jsx
```
🧠 Autor

Pietro Saccarrão Cougo

📧 pietrocougo@gmail.com


🧱 Feito com horas de trabalho e usando React + Firebase
