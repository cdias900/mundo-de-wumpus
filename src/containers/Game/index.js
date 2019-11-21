// Área de importação dos componentes que serão utilizados na renderização em tela
import React, { useState, useRef } from 'react';

import Modal from '../../components/Layout/Modal';
import classes from './styles.module.css';
import Player from '../../assets/player.png';
import Pit32 from '../../assets/pit32.png';
import Pit16 from '../../assets/pit16.png';
import Wumpus32 from '../../assets/wumpus32.png';
import Wumpus16 from '../../assets/wumpus16.png';
import Gold32 from '../../assets/gold32.png';
import Gold16 from '../../assets/gold16.png';
import Arrow32 from '../../assets/arrow32.png';
import Blood32 from '../../assets/blood32.png';
import axios from '../../services/axios';
//

function Game() {
    // Define as variáveis que serão usadas para atualizar o estado do jogo
    const [ size, setSize ] = useState('3'); // Tamanho do mapa digitado pelo usuário
    const [ gameMap, setGameMap ] = useState([]); // Array que guarda o mapa do jogo
    const [ effectiveSize, setEffectiveSize ] = useState(''); // Tamanho do mapa mostrado em tela, após o usuário clicar no botão "Alterar Mapa"
    const [ playerLocation, setPlayerLocation ] = useState(+size-1); // Localização do jogador no mapa
    const [ gameStatus, setGameStatus ] = useState(false); // Status do jogo (Ativo, finalizado)
    const [ playerMoves, setPlayerMoves ] = useState(0); // Quantidade de movimentos do jogador
    const [ modal, setModal ] = useState({
        status: false,
        message: '',
        loading: false
    }); // Tela de carregamento/avisos mostrada na tela ocasionalmente
    const [ score, setScore ] = useState(0); // Pontuação do jogador
    const [ hasGold, setHasGold ] = useState(false); // Inidica se o jogador já pegou o ouro ou não
    const [ pits, setPits ] = useState(1); // Quantidade de buracos no mapa
    const [ visible, setVisible ] = useState(false); // Indica se os items do mapa são visíveis ou não
    const [ username, setUsername ] = useState(''); // Nome de usuário digitado pelo jogador
    const [ scoreSaved, setScoreSaved ] = useState(false); // Indica se a pontuação daquele jogo já foi salva
    const [ arrow, setArrow ] = useState({
        amount: 1,
        status: false,
        direction: '',
    });
    const divEl = useRef(null);
    //


    const handleChange = e => { // Atualiza o tamanho do mapa digitado pelo usuário
        if(e.target.value > 15) return setSize(15); // Define 15 como o tamanho máximo do mapa
        if(e.target.value === '') setGameMap([]); // Remove o mapa se o tamanho do mapa for apagado
        setPits(1); // Altera a quantidade de burcacos de volta para 1
        return setSize(e.target.value.replace(/\D+/g, '')); // Remove tudo digitado pelo usuário que não for numérico
    }

    const handlePitsChange = e => {
        if(e.target.value >= Math.pow(size, 2) - 3) return setPits(Math.pow(size, 2) - 4);
        return setPits(e.target.value.replace(/\D+/g, ''));
    }

    const generateMap = () => { // Gera a array que contém o mapa do jogo
        if(size < 3) return; // Não gera o mapa se o tamanho for menor que 3
        let gameMapArr = [];
        for(let k=0;k<+size;k++){ // Inicializa a array com o tamanho escolhido pelo usuário
            for(let k=0;k<+size;k++){
            gameMapArr.push(1);
            }
        }
        gameMapArr[size-1] = 'P'; // Coloca o player na posição mais a esquerda inferior
        let r;
        for(let i=0;i<pits;i++){ // Adiciona os buracos em posições aleatórias
            do{
                r = Math.floor(Math.random() * (Math.pow(size, 2)));
            }while(gameMapArr[r] !== 1);
            gameMapArr[r] = 'B';
        }

        do{ // Adiciona o ouro em uma posição aleatória
            r = Math.floor(Math.random() * (Math.pow(size, 2)));
        } while(gameMapArr[r] !== 1);
        gameMapArr[r] = 'G';

        let flag = false;
        while(!flag){ // Adiciona o Wumpus em uma posição aleatória
            r = Math.floor(Math.random() * (Math.pow(size, 2)));
            if(gameMapArr[r] === 1){
                gameMapArr[r] = 'W';
                flag = true;
            }
        }
        // Reseta todas as variáveis relacionadas ao estado do jogo, para iniciar um novo jogo
        setScoreSaved(false);
        setVisible(false);
        setPlayerMoves(0);
        setScore(0);
        setEffectiveSize(+size);
        setGameStatus(true);
        setHasGold(false);
        setPlayerLocation(size-1);
        setArrow({
            status: false,
            amount: 1,
            direction: ''
        })
        gameMapArr = checkPlayerSurroundings(gameMapArr, size-1, 'W', size);
        gameMapArr = checkPlayerSurroundings(gameMapArr, size-1, 'B', size);
        return setGameMap([...gameMapArr]);
    }

    const updatePlayerLocation = (currentLocation, newLocation) => { // Atualiza a localização do jogador no mapa
        let gameMapArr = [...gameMap];
        setScore(score - 1); // Penalidade de 1 ponto por movimento
        setPlayerMoves(playerMoves + 1); // Soma 1 a quantidade de movimentos realizados
        gameMapArr[currentLocation] = 1; // Remove o jogador da localização atual
        if(gameMapArr[newLocation] === 'W' || gameMapArr[newLocation] === 'B'){ // Se a nova localização do jogador for aonde está o wumpus (W) ou um buraco (B), o jogo é finalizado e os elementos do mapa são mostrados
            setVisible(true);
            setGameMap(gameMapArr);
            return endGame(score - 1, false);
        } else if(gameMapArr[newLocation] === 'G'){ // Se a nova localização do jogador for aonde está o ouro (G), a variável hasGold é atualizada para inidicar que o jogador agora possui o ouro
            setHasGold(true);
            gameMapArr[newLocation] = 'PG'; // Adiciona o jogador a localização, junto com o ouro, verificado na renderização
        } else { // Caso nenhuma das opções acima seja verdadeira, o jogador é adicionado a sua nova localização
            gameMapArr[newLocation] = 'P';
        }
        if(newLocation === effectiveSize - 1 && hasGold){ // Se o jogador voltar a sua posição inicial e possuir o ouro, o jogo é finalizado
            endGame(score - 1, true);
        }

        gameMapArr = checkPlayerSurroundings(gameMapArr, newLocation, 'W'); // Verifica se o wumpus está ao redor do jogador
        gameMapArr = checkPlayerSurroundings(gameMapArr, newLocation, 'B'); // Verifica se há um buraco ao redor do jogador

        setPlayerLocation(newLocation); // Atualiza a localização do jogador
        setGameMap(gameMapArr); // Atualiza o mapa
    }

    const checkPlayerSurroundings = (gameMapArr, newLocation, element, size = null) => { // Verifica se o elemento recebido por parâmetro está ao redor do jogador
        const s = effectiveSize || size;
        if((newLocation % s !== s-1 && gameMapArr[newLocation + 1] === element)
        || (newLocation % s !== 0 && gameMapArr[newLocation - 1] === element)
        || (newLocation < (Math.pow(size, 2) - s) && gameMapArr[newLocation + s] === element)
        || (newLocation >= s && gameMapArr[newLocation - s] === element)){
            gameMapArr[newLocation] += element;
        }
        return gameMapArr;
    }

    const endGame = (sc, win) => { // Finaliza o jogo
        setGameStatus(false); // Atualiza o status do jogo para finalizado
        const scr = sc + (win ? 1000 : -1000); // Adiciona 1000 ao score se o jogador venceu o jogo ou subtrai 1000 se o jogador perdeu
        setModal({
            status: true,
            message: (
                        <>
                            Player {win ? "Ganhou" : "Morreu"}! 
                            <br/>Pontuação: {scr}
                        </>
                    ),
            loading: false
        }); // Ativa tela de aviso, com a mensagem de vitória ou derrota
        setHasGold(false);
        setScore(scr);
    }

    const saveScore = () => { // Salva a pontuação do jogador no banco de dados
        if(username === ''){ // Se o nome de usuário não for digitado, mostra uma mensagem ao usuário
            return setModal({
                status: true,
                message: 'Digite um nome de usuário antes de salvar!',
                loading: false
            });
        }

        setModal({
            status: true,
            message: '',
            loading: true
        }); // Ativa tela de carregamento
        axios.post('/ranking.json', { username, score, mapSize: effectiveSize }) // Manda os dados do usuário para o banco de dados
            .then(res => { // Se os dados foram salvos com sucesso, mostra a mensagem de sucesso ao usuário
                setScoreSaved(true);
                setModal({
                status: true,
                message: 'Pontuação salva com sucesso!',
                loading: false
                })
            })
            .catch(error => setModal({ // Se houve algum erro no salvamento das informações, mostra a mensagem de erro ao usuário
                status: true,
                message: 'Erro ao salvar pontuação!',
                loading: false
            }));
        
    }

    const closeModal = () => setModal({ // Fecha a tela de carregamento/avisos
        status: false,
        message: '',
        loading: false
    });

    const movePlayer = (action) => { // Recebe o input do usuário, e baseado na tecla pressionada, verifica se o jogador pode se mover, e caso possa, atualiza sua localização
        switch(action){
            case 'w':
                if(playerLocation % effectiveSize === 0) return;
                updatePlayerLocation(playerLocation, playerLocation - 1);
            break;

            case 'a':
                if(playerLocation - effectiveSize < 0) return;
                updatePlayerLocation(playerLocation, playerLocation - effectiveSize);
            break;

            case 's':
                if(playerLocation % effectiveSize === size - 1) return;
                updatePlayerLocation(playerLocation, playerLocation + 1);
            break;

            case 'd':
                if(playerLocation + effectiveSize >= Math.pow(effectiveSize, 2)) return;
                updatePlayerLocation(playerLocation, playerLocation + effectiveSize);
            break;

            case 'f':
                if(arrow.amount > 0) setArrow({
                                        ...arrow,
                                        status: true,
                                    });
            break;

            default:
            return;
        }
    }

    const moveArrow = (direction) => {
        let gameMapArr = [...gameMap];
        gameMapArr[playerLocation] += "F";
        setArrow({
            status: false,
            amount: arrow.amount - 1,
            direction: direction.toUpperCase()
        });
        setGameMap([...gameMapArr]);
        gameMapArr[playerLocation] = gameMapArr[playerLocation].replace('F', '');
        switch(direction){
            case 'w':
                for(let k = playerLocation; k % effectiveSize > 0; k--){
                    if(gameMapArr[k-1] === 'W') {
                        gameMapArr[k-1] = 'S';
                        //gameMapArr[playerLocation].replace('W', '');
                    } 
                }
            break;

            case 'a':
                for(let k = playerLocation; k - effectiveSize > 0; k-=effectiveSize){
                    if(gameMapArr[k] === 'W') {
                        gameMapArr[k] = 'S';
                        //gameMapArr[playerLocation].replace('W', '');
                    } 
                }
            break;

            case 's':
                for(let k = playerLocation; k % effectiveSize < effectiveSize - 1; k--){
                    if(gameMapArr[k+1] === 'W') {
                        gameMapArr[k+1] = 'S';
                        //gameMapArr[playerLocation].replace('W', '');
                    } 
                }
            break;

            case 'd':
                for(let k = playerLocation; k + effectiveSize < Math.pow(effectiveSize, 2); k+=effectiveSize){
                    if(gameMapArr[k] === 'W') {
                        gameMapArr[k] = 'S';
                        //gameMapArr[playerLocation].replace('W', '');
                    } 
                }
            break;
            
            default:
            break;
        }
        gameMapArr = checkPlayerSurroundings(gameMapArr, playerLocation, 'W');
        gameMapArr = checkPlayerSurroundings(gameMapArr, playerLocation, 'B');
        setGameStatus(false);
        setTimeout(() => {
            setGameMap([...gameMapArr]);
            setGameStatus(true);
            divEl.current.focus();

        }, 2000);
    }

    const shootArrow = (action) => {
        switch(action){
            case 'w':
                if(playerLocation % effectiveSize === 0) return;
                moveArrow(action);
            break;

            case 'a':
                if(playerLocation - effectiveSize < 0) return; 
                moveArrow(action);
            break;

            case 's':
                if(playerLocation % effectiveSize === size - 1) return;
                moveArrow(action);
            break;

            case 'd':
                if(playerLocation + effectiveSize >= Math.pow(effectiveSize, 2)) return;
                moveArrow(action);
            break;

            case 'f':
                setArrow({
                    ...arrow,
                    status: false,
                });
            break;

            default:
            return;
        }
    }

    const moveOrShoot = (action) => {
        return arrow.status ? shootArrow(action) : movePlayer(action);
    }

    const toggleArrow = () => {
        if(arrow.amount > 0){
            setArrow({
                ...arrow,
                status: !arrow.status
            });
        }
    }

  // Renderiza todo o conteúdo na tela
  return (
    <div className={classes.Game} onKeyPress={e => gameStatus ? moveOrShoot(e.key) : null} tabIndex="0" ref={divEl}>
        <Modal show={modal.status} Loading={modal.loading} Message={modal.message} closeModal={closeModal}/>
        <div className={classes.MapSize}>
            <label htmlFor="size">Tamanho do mapa:</label>
            <input style={{width: 30}} id="size" type="text" value={size} onChange={handleChange}/>
            <button className={classes.Btn} onClick={generateMap}>Novo Jogo</button>
        </div>
        <div className={classes.Pits}>
            <label htmlFor="pits">Quantidade de buracos:</label>
            <input style={{width: 30}} id="pits" type="text" value={pits} onChange={handlePitsChange}/>
        </div>
        <div className={classes.Map} style={{columns: effectiveSize, columnGap: '2px'}}>
            {gameMap.map((el, index) =>
            <div key={index} className={classes.Square} onClick={() => console.log(el)}>
                {typeof el === 'string' && el === 'W' && visible ? <img src={Wumpus32} alt="Wumpus"></img> : null}
                {typeof el === 'string' && el === 'B' && visible ? <img src={Pit32} alt="Pit"></img> : null}
                {typeof el === 'string' && el === 'G' && visible ? <img src={Gold32} alt="Gold"></img> : null}
                {typeof el === 'string' && el === 'S' ? <img src={Blood32} alt="Blood"></img> : null}
                {typeof el === 'string' && el === 'F' ? <img src={Arrow32} alt="Gold"></img> : null}

                <div className={classes.TopIcons}>
                    {typeof el === 'string' && el.includes('W') && el !== 'W' ? <img src={Wumpus16} alt="Wumpus"></img> : null}
                    {typeof el === 'string' && el.includes('B') && el !== 'B' ? <img src={Pit16} alt="Pit"></img> : null}
                </div>
                <div className={classes.BottomIcons}>
                    {typeof el === 'string' && el.includes('P') ? <img src={Player} alt="Player"></img> : null}
                    {typeof el === 'string' && el.includes('F') ? <img src={Arrow32} className={classes['Arrow'+arrow.direction]} alt="Arrow"></img> : null}
                    <div>
                    {typeof el === 'string' && el.includes('G') && el !== 'G' ? <img src={Gold16} alt="Gold" style={{marginLeft: 5, width: '100%', height: '100%'}}></img> : null}
                    </div>
                </div>
            </div>)}
        </div>
        <div className={classes.BtnDiv}>
            <button type="button" disabled={!gameStatus} onClick={() => moveOrShoot('w')}>{"^"}</button>
            <div>
                <button type="button" disabled={!gameStatus} onClick={() => moveOrShoot('a')}>{"<"}</button>
                <button type="button" disabled={!gameStatus} onClick={() => moveOrShoot('s')}>{"v"}</button>
                <button type="button" disabled={!gameStatus} onClick={() => moveOrShoot('d')}>{">"}</button>
            </div>
            <button type="button" className={arrow.status ? classes.ActiveArrow : arrow.amount > 0 ? '' : classes.UsedArrow} disabled={!gameStatus || !arrow.amount > 0} onClick={toggleArrow}><img src={Arrow32} alt="Arrow"/></button>
        </div>
        
        <div style={{marginTop: 20}}>Movimentos: {playerMoves}</div>
        <div style={{marginTop: 10, marginBottom: 10}}>Pontuação: {score}</div>
        <input style={{marginBottom: 10}} type="text" placeholder="Nome de usuário" value={username} onChange={e => setUsername(e.target.value)}/>
        <button className={classes.Btn} onClick={saveScore} disabled={score === 0 || gameStatus || scoreSaved}>Salvar Pontuação</button>
    </div>
  );
}

export default Game;
