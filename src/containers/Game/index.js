import React, { useState } from 'react';

import Modal from '../../components/Layout/Modal';
import classes from './styles.module.css';
import Player from '../../assets/player.png';
import Pit32 from '../../assets/pit32.png';
import Pit16 from '../../assets/pit16.png';
import Wumpus32 from '../../assets/wumpus32.png';
import Wumpus16 from '../../assets/wumpus16.png';
import Gold32 from '../../assets/gold32.png';
import Gold16 from '../../assets/gold16.png';
import axios from '../../services/axios';

function Game() {
    const [ size, setSize ] = useState('3');
    const [ gameMap, setGameMap ] = useState([]);
    const [ effectiveSize, setEffectiveSite ] = useState('');
    const [ playerLocation, setPlayerLocation ] = useState(+size-1);
    const [ gameStatus, setGameStatus ] = useState(false);
    const [ playerMoves, setPlayerMoves ] = useState(0);
    const [ modal, setModal ] = useState({
        status: false,
        message: '',
        loading: false
    });
    const [ score, setScore ] = useState(0);
    const [ hasGold, setHasGold ] = useState(false);
    const [ pits, setPits ] = useState(1);
    const [ visible, setVisible ] = useState(false);
    const [ username, setUsername ] = useState('');
    const [ scoreSaved, setScoreSaved ] = useState(false);

    const handleChange = e => {
        if(e.target.value > 15) return setSize(15);
        if(e.target.value === '') setGameMap([]);
        setPits(1);
        return setSize(e.target.value.replace(/\D+/g, ''));
    }

    const handlePitsChange = e => {
        if(e.target.value >= Math.pow(size, 2) - 3) return setPits(Math.pow(size, 2) - 4);
        return setPits(e.target.value.replace(/\D+/g, ''));
    }

    const generateMap = () => {
        if(size <= 2) return;
        let gameMapArr = [];
        for(let k=0;k<+size;k++){
            for(let k=0;k<+size;k++){
            gameMapArr.push(1);
            }
        }
        gameMapArr[size-1] = 'P';
        let r;
        for(let i=0;i<pits;i++){
            do{
                r = Math.floor(Math.random() * (Math.pow(size, 2)));
            }while(gameMapArr[r] !== 1);
            gameMapArr[r] = 'B';
        }

        do{
            r = Math.floor(Math.random() * (Math.pow(size, 2)));
        } while(gameMapArr[r] !== 1);
        gameMapArr[r] = 'G';

        let flag = false;
        while(!flag){
            r = Math.floor(Math.random() * (Math.pow(size, 2)));
            if(gameMapArr[r] === 1){
                gameMapArr[r] = 'W';
                flag = true;
            }
        }
        gameMapArr = lookForWumpus(gameMapArr, size-1);
        gameMapArr = lookForPit(gameMapArr, size-1);
        setScoreSaved(false);
        setVisible(false);
        setPlayerMoves(0);
        setScore(0);
        setEffectiveSite(+size);
        setGameStatus(true);
        setHasGold(false);
        setPlayerLocation(size-1);
        return setGameMap([...gameMapArr]);
    }

    const updatePlayerLocation = (currentLocation, newLocation) => {
        let gameMapArr = [...gameMap];
        setScore(score - 1);
        setPlayerMoves(playerMoves + 1);     
        gameMapArr[currentLocation] = 1;
        if(gameMapArr[newLocation] === 'W' || gameMapArr[newLocation] === 'B'){
            setVisible(true);
            setGameMap(gameMapArr);
            return endGame(score - 1, false);
        } else if(gameMapArr[newLocation] === 'G'){
            setHasGold(true);
            gameMapArr[newLocation] = 'PG';
        } else {
            gameMapArr[newLocation] = 'P';
        }
        if(newLocation === effectiveSize - 1 && hasGold){
            endGame(score - 1, true);
        }

        gameMapArr = lookForWumpus(gameMapArr, newLocation);
        gameMapArr = lookForPit(gameMapArr, newLocation);

        setPlayerLocation(newLocation);
        setGameMap(gameMapArr);
    }

    const lookForWumpus = (gameMapArr, newLocation) => {
        if((newLocation % effectiveSize !== effectiveSize-1 && gameMapArr[newLocation + 1] === 'W')
        || (newLocation % effectiveSize !== 0 && gameMapArr[newLocation - 1] === 'W')
        || (newLocation < (Math.pow(size, 2) - effectiveSize) && gameMapArr[newLocation + effectiveSize] === 'W')
        || (newLocation >= effectiveSize && gameMapArr[newLocation - effectiveSize] === 'W')){
            gameMapArr[newLocation] += 'W';
        }
        return gameMapArr;
    }

    const lookForPit = (gameMapArr, newLocation) => {
        if((newLocation % effectiveSize !== effectiveSize-1 && gameMapArr[newLocation + 1] === 'B')
        || (newLocation % effectiveSize !== 0 && gameMapArr[newLocation - 1] === 'B')
        || (newLocation < (Math.pow(size, 2) - effectiveSize) && gameMapArr[newLocation + effectiveSize] === 'B')
        || (newLocation >= effectiveSize && gameMapArr[newLocation - effectiveSize] === 'B')){
            gameMapArr[newLocation] += 'B';
        }
        return gameMapArr;
    }

    const endGame = (sc, win) => {
        setGameStatus(false);
        const scr = sc + (win ? 1000 : -1000);
        setModal({
            status: true,
            message: (
                        <>
                            Player {win ? "Ganhou" : "Morreu"}! 
                            <br/>Pontuação: {scr}
                        </>
                    ),
            loading: false
        })
        setHasGold(false);
        setScore(scr);
    }

    const saveScore = () => {
        if(username === ''){
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
        });
        axios.post('/ranking.json', { username, score, mapSize: effectiveSize })
            .then(res => {
                setScoreSaved(true);
                setModal({
                status: true,
                message: 'Pontuação salva com sucesso!',
                loading: false
                })
            })
            .catch(error => setModal({
                status: true,
                message: 'Erro ao salvar pontuação!',
                loading: false
            }));
        
    }

    const closeModal = () => setModal({
        status: false,
        message: '',
        loading: false
    });

    const movePlayer = (action) => {
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

            default:
            break;
        }
    }
  return (
    <div className={classes.Game} onKeyPress={e => gameStatus ? movePlayer(e.key) : null} tabIndex="0">
        <Modal show={modal.status} Loading={modal.loading} Message={modal.message} closeModal={closeModal}/>
        <div className={classes.MapSize}>
            <label htmlFor="size">Tamanho do mapa:</label>
            <input style={{width: 30}} id="size" type="text" value={size} onChange={handleChange}/>
            <button className={classes.Btn} onClick={generateMap}>Alterar Mapa</button>
        </div>
        <div className={classes.Pits}>
            <label htmlFor="pits">Quantidade de buracos:</label>
            <input style={{width: 30}} id="pits" type="text" value={pits} onChange={handlePitsChange}/>
        </div>
        <div className={classes.Map} style={{columns: effectiveSize, columnGap: '2px'}}>
            {gameMap.map((el, index) =>
            <div key={index} onClick={() => console.log(index, el)} className={classes.Square}>
                {typeof el === 'string' && el === 'W' && visible ? <img src={Wumpus32} alt="Wumpus"></img> : null}
                {typeof el === 'string' && el === 'B' && visible ? <img src={Pit32} alt="Pit"></img> : null}
                {typeof el === 'string' && el === 'G' && visible ? <img src={Gold32} alt="Gold"></img> : null}

                <div className={classes.TopIcons}>
                    {typeof el === 'string' && el.includes('W') && el !== 'W' ? <img src={Wumpus16} alt="Wumpus"></img> : null}
                    {typeof el === 'string' && el.includes('B') && el !== 'B' ? <img src={Pit16} alt="Pit"></img> : null}
                </div>
                <div className={classes.BottomIcons}>
                    {typeof el === 'string' && el.includes('P') ? <img src={Player} alt="Player"></img> : null}
                    <div>
                    {typeof el === 'string' && el.includes('G') && el !== 'G' ? <img src={Gold16} alt="Gold" style={{marginLeft: 5, width: '100%', height: '100%'}}></img> : null}
                    </div>
                </div>
            </div>)}
        </div>
        <div className={classes.BtnDiv}>
            <button type="button" disabled={!gameStatus} onClick={() => movePlayer('w')}>{"^"}</button>
            <div>
                <button type="button" disabled={!gameStatus} onClick={() => movePlayer('a')}>{"<"}</button>
                <button type="button" disabled={!gameStatus} onClick={() => movePlayer('s')}>{"v"}</button>
                <button type="button" disabled={!gameStatus} onClick={() => movePlayer('d')}>{">"}</button>
            </div>
        </div>
        <div style={{marginTop: 20}}>Movimentos: {playerMoves}</div>
        <div style={{marginTop: 10, marginBottom: 10}}>Pontuação: {score}</div>
        <input style={{marginBottom: 10}} type="text" placeholder="Nome de usuário" value={username} onChange={e => setUsername(e.target.value)}/>
        <button className={classes.Btn} onClick={saveScore} disabled={score === 0 || gameStatus || scoreSaved}>Salvar Pontuação</button>
    </div>
  );
}

export default Game;
