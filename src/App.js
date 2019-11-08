import React, { useState } from 'react';
import './App.css';

function App() {
    const [ size, setSize ] = useState('3');
    const [ gameMap, setGameMap ] = useState([]);
    const [ effectiveSize, setEffectiveSite ] = useState('');
    const [ playerLocation, setPlayerLocation ] = useState(+size-1);
    const [ gameStatus, setGameStatus ] = useState(false);
    const handleChange = e => {
        if(e.target.value > 15) return setSize(15);
        if(e.target.value === '') setGameMap([]);
        return setSize(e.target.value);
    }

    const generateMap = () => {
        const gameMapArr = [];
        for(let k=0;k<+size;k++){
            for(let k=0;k<+size;k++){                
            gameMapArr.push(1);
            }
        }
        let r = Math.floor(Math.random() * (Math.pow(size, 2) - 1));
        if(r !== +size-1){
            gameMapArr[r] = 'W';
        } else {
            gameMapArr[r + 1] = 'W';
        }
        gameMapArr[+size-1] = 'P';
        setEffectiveSite(+size);
        setPlayerLocation(+size-1);
        setGameStatus(true);
        return setGameMap([...gameMapArr]);
    }

    const updatePlayerLocation = (currentLocation, newLocation) => {
        let gameMapArr = [...gameMap];
        gameMapArr[currentLocation] = 1;
        if(gameMapArr[newLocation] === 'W'){
            endGame();
        } else {
            gameMapArr[newLocation] = 'P';
        }
        setPlayerLocation(newLocation);
        setGameMap(gameMapArr);
    }

    const endGame = () => {
        setGameStatus(false);
        console.log("Player morreu!")
    }

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
        <div>
            <label htmlFor="size">Tamanho do mapa:</label>
            <input id="size" type="text" value={size} onChange={handleChange}/>
            <button onClick={generateMap}>Alterar Mapa</button>
        </div>
        
        <div className="Map" style={{columns: effectiveSize, columnGap: '2px'}}>
            {gameMap.map((el, index) => 
            <div key={index} onClick={() => console.log(index)} className="Square">
                {el === 'P' ? <p>PLAYER</p> : null}
                {el === 'W' ? <p>WUMPUS</p> : null}
            </div>)}
        </div>
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
