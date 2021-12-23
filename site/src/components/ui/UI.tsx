import React from 'react';
import ReactDOM from 'react-dom';
import { visited } from '../../board/board-mechanic';
import Board from '../board/Board';
import './ui.css';

interface GameProps {
    shape?: [number, number]
    mines?: number,
    depth?: number
    revealed?: boolean
}

const GameInterface = (props: GameProps) => {
    React.useEffect(() => {
        remakeBoard()
    }, [])
    
    const reset = () => {
        visited.clear()
        remakeBoard()
    }

    const remakeBoard = () => {
        let wrapper = document.getElementById('board-wrapper');
        if (wrapper) {
            ReactDOM.unmountComponentAtNode(wrapper)
            ReactDOM.render(<Board shape={[20, 24]} mines={99} depth={1} revealed={false}/>, wrapper)
        }
    }

    return (
        <div className='game'>
            <div id="board-wrapper">
            </div>
            <button onClick={reset}>Reset</button>
        </div>
    )
}

export default GameInterface;