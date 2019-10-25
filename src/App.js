import React, { useState } from 'react';
import './App.css';

function App() {
    const [ size, setSize ] = useState(9);
    let gameMap = [];
    for(let k=0;k<size;k++){
        gameMap.push(<td></td>)
    }
  return (
    <div className="App">
        <label htmlFor="size">Tamanho do mapa:</label>
        <input id="size" type="text" value={size} onChange={e => setSize(e.target.value)} />
        <table>
            {gameMap}
        </table>

    </div>
  );
}

export default App;
