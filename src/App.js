import React, { useState } from 'react';
import './App.css';
import Modal from './components/Layout/Modal';

function App() {
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
    })
    const [ score, setScore ] = useState(0);
    const [ hasGold, setHasGold ] = useState(false);
    const [ pits, setPits ] = useState(1);

    const handleChange = e => {
        if(e.target.value > 15) return setSize(15);
        if(e.target.value === '') setGameMap([]);
        return setSize(e.target.value.replace(/\D+/g, ''));
    }

    const handlePitsChange = e => {
        if(e.target.value > 15) return setPits(15);
        return setPits(e.target.value.replace(/\D+/g, ''));
    }

    const generateMap = () => {
        if(size <= 2) return;
        const gameMapArr = [];
        for(let k=0;k<+size;k++){
            for(let k=0;k<+size;k++){
            gameMapArr.push(1);
            }
        }
        gameMapArr[size-1] = 'P';
        let r;
        for(let i=0;i<pits;i++){
            do{
                r = Math.ceil(Math.random() * (Math.pow(size, 2) - 1));
            }while(gameMapArr[r] !== 1);
            gameMapArr[r] = 'B';
        }

        do{
            r = Math.ceil(Math.random() * (Math.pow(size, 2) - 1));
        } while(gameMapArr[r] !== 1);
        gameMapArr[r] = 'G';

        let flag = false;
        while(!flag){
            r = Math.ceil(Math.random() * (Math.pow(size, 2) - 1));
            if(gameMapArr[r] === 1){
                gameMapArr[r] = 'W';
                flag = true;
            }
        }
        setPlayerMoves(0);
        setScore(0);
        setEffectiveSite(+size);
        setPlayerLocation(+size-1);
        setGameStatus(true);
        return setGameMap([...gameMapArr]);
    }

    const updatePlayerLocation = (currentLocation, newLocation) => {
        let gameMapArr = [...gameMap];
        setScore(score - 1);
        setPlayerMoves(playerMoves + 1);
        gameMapArr[currentLocation] = 1;
        if(gameMapArr[newLocation] === 'W' || gameMapArr[newLocation] === 'B'){
            endGame(score - 1, false);
        } else if(gameMapArr[newLocation] === 'G'){
            setHasGold(true);
            gameMapArr[newLocation] = 'P';
        } else {
            gameMapArr[newLocation] = 'P';
        }
        if(newLocation === size - 1 && hasGold){
            endGame(score - 1, true);
        }
        setPlayerLocation(newLocation);
        setGameMap(gameMapArr);
    }

    const endGame = (sc, win) => {
        setGameStatus(false);
        setModal({
            status: true,
            message: <>Player {win ? "Ganhou" : "Morreu"}! <br/>Pontuação: {sc + (win ? 1000 : -1000)}</> ,
            loading: false
        })
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
    <div className="App" onKeyPress={e => gameStatus ? movePlayer(e.key) : null} tabIndex="0">
        <Modal show={modal.status} Loading={modal.loading} Message={modal.message} closeModal={closeModal}/>
        <div>
            <label htmlFor="size">Tamanho do mapa:</label>
            <input style={{width: 30}} id="size" type="text" value={size} onChange={handleChange}/>
            <button onClick={generateMap}>Alterar Mapa</button>
        </div>
        <div>
            <label htmlFor="pits">Quantidade de buracos:</label>
            <input style={{width: 30}} id="pits" type="text" value={pits} onChange={handlePitsChange}/>
        </div>
        <div className="Map" style={{columns: effectiveSize, columnGap: '2px'}}>
            {gameMap.map((el, index) =>
            <div key={index} onClick={() => console.log(index, el)} className="Square">
                {el === 'P' ? <p>P</p> : null}
                {el === 'W' ? <p>W</p> : null}
                {el === 'B' ? <p>B</p> : null}
                {el === 'G' ? <p>G</p> : null}
            </div>)}
        </div>
        <div>Movimentos: {playerMoves}  Pontuação: {score}</div>
        <div className={`BtnDiv ${!gameStatus ? 'Disabled' : ''}`}>
            <button type="button" disabled={!gameStatus} onClick={() => movePlayer('w')}>{"^"}</button>
            <div>
                <button type="button" disabled={!gameStatus} onClick={() => movePlayer('a')}>{"<"}</button>
                <button type="button" disabled={!gameStatus} onClick={() => movePlayer('s')}>{"v"}</button>
                <button type="button" disabled={!gameStatus} onClick={() => movePlayer('d')}>{">"}</button>
            </div>
        </div>
    </div>
  );
}

export default App;
