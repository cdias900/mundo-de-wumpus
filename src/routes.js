import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Game from './containers/Game';
import Ranking from './containers/Ranking';
import Home from './containers/Home';

export default function Routes(){
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