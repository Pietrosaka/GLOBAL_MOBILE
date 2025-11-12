Sistema de Votação e Enquetes em Tempo Real

Este é um aplicativo de página única (SPA) desenvolvido em React que permite a criação e participação em enquetes de votação em tempo real. Os dados são persistidos de forma segura e colaborativa usando o Firebase Firestore, garantindo que todos os usuários vejam as atualizações instantaneamente.

🚀 Funcionalidades Principais

Criação de Enquetes: Os usuários podem criar novas perguntas de enquete com opções de resposta personalizadas.

Votação em Tempo Real: Vote nas enquetes disponíveis e veja os resultados serem atualizados imediatamente para todos os usuários conectados.

Contagem de Votos Dinâmica: Os resultados são exibidos em barras de progresso (porcentagem) que refletem a contagem total de votos em tempo real.

Persistência de Dados (Firestore): Todas as enquetes e votos são armazenados no Firestore, garantindo que os dados não sejam perdidos ao recarregar a página.

Experiência de Usuário: Interface totalmente responsiva e moderna, criada com Tailwind CSS.

Usuários Colaborativos: O aplicativo é projetado para ser usado por múltiplos usuários simultaneamente.

💻 Tecnologias Utilizadas

O projeto é construído como um componente React funcional e autônomo, utilizando as seguintes tecnologias:

Frontend: React (Componentes Funcionais e Hooks).

Estilização: Tailwind CSS (Classes utilitárias para design responsivo e moderno).

Persistência de Dados: Firebase Firestore (Banco de dados NoSQL em tempo real).

Autenticação: Firebase Auth (Utilização de autenticação customizada ou anônima para identificação de usuários).

🗄️ Estrutura de Dados (Firestore)

Os dados são armazenados na seguinte estrutura pública, permitindo que todos os usuários interajam com as mesmas enquetes:

Coleção: /artifacts/{appId}/public/data/polls

Documento (Poll):

{
  "id": "UUID_DA_ENQUETE",
  "question": "Qual é a sua linguagem de programação favorita?",
  "options": [
    { "id": "op1", "text": "JavaScript", "votes": 42 },
    { "id": "op2", "text": "Python", "votes": 35 },
    // ... outras opções
  ]
}


Criação e Votação

Criação de uma Nova Enquete: Ao criar uma enquete, um novo documento é adicionado à coleção polls.

Votação: Quando um usuário vota, o contador votes da opção selecionada dentro do documento da enquete é incrementado usando uma transação para garantir a consistência dos dados.

Tempo Real: Um listener de tempo real (onSnapshot) garante que a interface seja atualizada instantaneamente sempre que houver uma alteração na contagem de votos no Firestore.

🛠️ Executando o Projeto

O aplicativo é um componente React de arquivo único e depende das variáveis de ambiente (__app_id, __firebase_config, __initial_auth_token) fornecidas pelo ambiente de hospedagem para se conectar ao Firebase.

Configuração do Firebase: Certifique-se de que o projeto Firebase esteja configurado com o Firestore habilitado.

Dependências: O código importa as bibliotecas Firebase via CDN (ou módulos React/npm) para gerenciamento de banco de dados e autenticação.

Inicialização: O aplicativo inicializa o Firebase, autentica o usuário (usando signInWithCustomToken ou anonimamente) e então estabelece o listener de tempo real no Firestore para carregar as enquetes existentes.

Desenvolvido com foco em interatividade e persistência de dados em tempo real.
