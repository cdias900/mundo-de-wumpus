import React, { useState } from 'react';
import './App.css';

function App() {
    const [ size, setSize ] = useState('3');
    const [ gameMap, setGameMap ] = useState([]);
    const handleChange = e => {
        if(e.target.value > 15) return setSize(15);
        if(e.target.value === '') setGameMap([]);
        return setSize(e.target.value);
    }

    const changeMap = () => {
        const gameMapArr = [];
        for(let k=0;k<size;k++){
            for(let k=0;k<size;k++){
            gameMapArr.push(1);
            }
        }
        return setGameMap([...gameMapArr]);
    }

    const movePlayer = (action) => {
        switch(action){
            case 'w':

            break;

            case 'a':

            break;

            case 's':

            break;

            case 'd':

            break;
        }
    }
  return (
    <div className="App">
        <div>
            <label htmlFor="size">Tamanho do mapa:</label>
            <input id="size" type="text" value={size} onChange={handleChange} />
            <button onClick={changeMap}>Alterar Mapa</button>
        </div>
        <div className="Map" style={{columns: size, columnGap: '2px'}}>
            {gameMap.map((el, index) => <div key={index} onClick={() => console.log(index)} className="Square"></div>)}
        </div>
        <div>
            <button type="button" onClick={() => movePlayer('w')}>{"^"}</button>
            <button type="button" onClick={() => movePlayer('a')}>{"<"}</button>
            <button type="button" onClick={() => movePlayer('s')}>{">"}</button>
            <button type="button" onClick={() => movePlayer('d')}>{"v"}</button>
        </div>
    </div>
  );
}

export default App;
