import React from 'react';
import { resetBoard } from '../../board/board-mechanic';
import Board from '../board/Board';
import './ui.css';

interface GameProps {
    shape?: [number, number]
    mines?: number
    revealed?: boolean
}

const GameInterface = (props: GameProps) => {
    return (
        <div className='game'>
            <Board shape={[16, 30]} mines={99} depth={1} revealed={false}/>
            <button onClick={resetBoard}>Reset</button>
        </div>
    )
}

export default GameInterface;