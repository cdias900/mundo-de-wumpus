import React from 'react';
import AdSense from 'react-adsense';

import classes from './styles.module.css';
import gold from '../../assets/gold16.png'
import wumpus from '../../assets/wumpus16.png'
import pit from '../../assets/pit16.png'
import arrow from '../../assets/arrow16.png'

const howToPlay = (props) => (
  <>
    <div className={classes.MainDiv}>
      <h1>O Mundo de Wumpus</h1>
      <h2>Como Jogar</h2>
      <p>Bem-Vindo ao Mundo de Wumpus! Seu objetivo é pegar o ouro <img src={gold} alt="Ouro"></img> e voltar para sua posição inicial (Quadrado mais a esquerda, em baixo) para sair da caverna. Você pode se mover utilizando as teclas WASD do teclado ou utilizando as setas mostradas em tela.</p>
      <p>O malvado Wumpus <img src={wumpus} alt="Wumpus"/> está se escondendo em algum lugar na caverna. Se você entrar no quadrado do Wumpus, ele irá te comer. O Wumpus pode ser detectado em quadrados adjacentes. Você pode matar o Wumpus atirando uma flecha <img src={arrow} alt="Flecha"/> na direção dele.</p>
      <p>Também há buracos sem fundo <img src={pit} alt="Buraco"/> na caverna. Se você entrar em um quadrado que tem um buraco, você cairá nele, e nunca mais será visto. Buracos podem ser detectados em quadrados adjacentes</p>
      <p>Há somente um ouro, um Wumpus, uma flecha, o tamanho do mapa e a quantidade de buracos pode ser definida pelo jogador.</p>
      <p>Cada movimenta custa 1 ponto, Atirar a flecha custa 9 pontos. Se você morrer, você perde 1000 pontos. O ouro vale 1000 pontos, se você conseguir trazê-lo de volta para fora da caverna.</p>
      <p>A qualquer momento você pode iniciar um novo jogo, clicando em "Novo Jogo".</p>

      <h2>Créditos</h2>
      <p>O jogo Mundo de Wumpus foi introduzido pela primeira vez pelo pesquisador de IA Michael Genesereth como um teste para sistemas de IA e é baseado no jogo de Atari "Hunt the Wumpus". O jogo Mundo de Wumpus foi descrito por Stuart Russel e Peter Norvig em seu livro "Artificial Intelligence: A Modern Approach". (<a target="_blank" href="http://aima.cs.berkeley.edu/" rel="noopener noreferrer">http://aima.cs.berkeley.edu/</a>)</p>
      <p>Essa versão do jogo foi baseada na versão de Android do mesmo, disponível para download <a href="https://play.google.com/store/apps/details?id=com.adaptelligence.wumpusWorld" target="_blank" rel="noopener noreferrer">neste link</a>.</p>
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

export default howToPlay;