// Área de importação dos componentes que serão utilizados na renderização em tela
import React from 'react';
import { Link } from 'react-router-dom';
import AdSense from 'react-adsense';

import classes from './styles.module.css';
//

export default function Home(){
    // Renderiza o conteúdo da página principal na tela
    return (
        <>
            <div className={classes.MainDiv}>
                <h1>Mundo de Wumpus</h1>
                <div className={classes.BtnDiv}>
                    <div className={classes.divJogar}>
                        <Link to="/game"><button className={[classes.Btn, classes.Jogar].join(' ')}>Jogar</button></Link>
                    </div>
                    <div className={classes.BtnSubDiv}>
                        <div className={classes.divRanking}>
                            <Link to="/howtoplay"><button className={[classes.Btn, classes.HowToPlay].join(' ')}>Como Jogar</button></Link>
                        </div>
                        <div className={classes.divRanking}>
                            <Link to="/ranking"><button className={[classes.Btn, classes.Ranking].join(' ')}>Ranking</button></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div
            style={{
            width: '100%',
            }}
            >
                <AdSense.Google
                client="ca-pub-4408046485122960"
                slot="3869776338"
                style={{ display: 'block' }}
                format="auto"
                responsive="true"
                />
            </div>
        </>
    );
}