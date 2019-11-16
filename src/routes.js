// Área de importação dos componentes que serão utilizados na renderização em tela
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Game from './containers/Game';
import Ranking from './containers/Ranking';
import Home from './containers/Home';
//

export default function Routes(){

    // Renderiza a página associada a cada url
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/game" component={Game} />
                <Route path="/ranking" component={Ranking} />
                <Route component={Home} />
            </Switch>
        </BrowserRouter>
    );
}