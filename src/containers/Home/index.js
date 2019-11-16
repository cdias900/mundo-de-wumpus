// Área de importação dos componentes que serão utilizados na renderização em tela
import React from 'react';
import { Link } from 'react-router-dom';

import classes from './styles.module.css';
//

export default function Home(){
    // Renderiza o conteúdo da página principal na tela
    return (
        <div className={classes.MainDiv}>
            <h1>Mundo de Wumpus</h1>
            <div className={classes.BtnDiv}>
                <div className={classes.divJogar}>
                    <Link to="/game"><button className={classes.Jogar}>Jogar</button></Link>
                </div>
                <div className={classes.divRanking}>
                    <Link to="/ranking"><button className={classes.Ranking}>Ranking</button></Link>
                </div>
            </div>
        </div>
    );
}