// Área de importação dos componentes que serão utilizados na renderização em tela
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';
//

// Adiciona todo o código na página html
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();
