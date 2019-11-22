Este projeto foi feito utlizando a biblioteca [**ReactJS**](https://reactjs.org/), para saber mais sobre esta biblioteca, [clique aqui](https://reactjs.org/).

## Jogando online
 Para jogar online, [clique aqui](http://mundodewumpus.netlify.com/).

## Jogando em seu computador
Para jogar em seu computador é necessário ter o **Node.js** instalado, caso ainda não o tenha instalado, [clique aqui](https://nodejs.org/pt-br/).

### Como abrir o projeto no navegador
- Após instalar o [**Node.js**](https://nodejs.org/pt-br/) em seu computador, abra o `cmd` (Prompt de Comando ou Powershell, ou Git Bash) e navegue até a pasta do projeto (utilizando o comando `cd C:\caminho\da\pasta\do\projeto`).

- **Na primeira vez** em que realizar este procedimento, dentro da pasta do projeto (no `cmd`) execute o comando `npm install`.

- Após o termino da execução do comando anterior, execute o comando `npm start`. Diferentemente do comando anterior, **este comando deverá ser executado novamente** sempre que o terminal for fechado, para iniciar o servidor da aplicação.

- Após o termino da execução do comando anterior, uma **página será aberta em seu navegador**, onde será exibido a aplicação funcionando. Caso essa página não abra em seu navegador acesse o link [http://localhost:3000](http://localhost:3000).

- Enquanto o servidor da aplicação estiver sendo executado (enquanto o `cmd` estiver aberto) a **página automaticamente atualizará após qualquer alteração no código ser salva**. Erros de compilação serão mostrados no `cmd` e na página.
  
## Como editar o projeto

### Editor Recomendado

O editor recomendado para fazer alterações no projeto é o [Visual Studio Code](https://code.visualstudio.com/download) (VS Code). Toda a pasta do projeto pode ser aberta no VS Code, e o servidor da aplicação pode ser iniciado também pelo [terminal integrado](https://code.visualstudio.com/docs/editor/integrated-terminal) ao editor.

### Estrutura de Arquivos

Os arquivos que podem ser editados, estão dentro da pasta `src`, todas as outras páginas e arquivos foram geradas automáticamente durante a criação do projeto (Para saber mais, [clique aqui](https://github.com/facebook/create-react-app#create-react-app--)).

- Os arquivos `index.js` e `App.js` apenas adicionam o conteúdo da aplicação na tela.
- O arquivo `serviceWorker.js` foi gerado automaticamente durante a criação do projeto, e não deve ser alterado. O objetivo desse arquivo é transformar a aplicação em um *PWA* ([*Progressive Web App*](https://developers.google.com/web/progressive-web-apps)), que permite que o site seja acessado mesmo quando em um ambiente offline e possa ser instalado no desktop e em smartphones (Android e IOS).
- A pasta `containers` contém todas as páginas, que são as partes do código que controlam o estado ([*state*](https://reactjs.org/docs/state-and-lifecycle.html)) da aplicação, definindo o que será renderizado na tela.
- A pasta `components` contém todos os componentes utilizados nas páginas. Componentes são elementos [*JSX*](https://reactjs.org/docs/introducing-jsx.html) que são reutilizados em vários trechos da aplicação, que para evitar a repetição excessiva de código, são exportados para outro arquivo e somente importados e utilizados onde necessário.
- A pasta `services` contém a instância do [*axios*](https://github.com/axios/axios#axios) que é utilizada para salvar e buscar os dados do ranking salvos no banco de dados, nesse caso, hospedado no [*Firebase*](https://firebase.google.com/).
- A pasta `assets` contém todas as imagens utilizadas na aplicação
- O arquivo `routes.js` contém todas as rotas (URLs) da aplicação. Para adicionar uma nova rota, é necessário importar o container que será utilizado (Assim como já é feito com os outros containers importados no arquivo) e definir uma nova rota, da mesma forma como já é feito no arquivo.