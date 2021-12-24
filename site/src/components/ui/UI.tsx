import React from 'react';
import ReactDOM from 'react-dom';
import { visited } from '../../board/board-mechanic';
import Board from '../board/Board';
import { Options } from '../menu/Options';
import './ui.css';

interface GameProps {
    shape?: [number, number]
    mines?: number,
    depth?: number
    revealed?: boolean
}

const GameInterface = (props: GameProps) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        remountOptions()
    }, [])

    const reset = () => {
        visited.clear()
        remountOptions()
        unmountBoard()
    }

    const unmountBoard = () => {
        let wrapper = document.getElementById('board-wrapper');
        if (wrapper) {
            ReactDOM.unmountComponentAtNode(wrapper)
        }
        setMounted(false);
    }

    const unmountMenu = () => {
        let wrapper = document.getElementById('menu-wrapper');
        if (wrapper) {
            ReactDOM.unmountComponentAtNode(wrapper)
        }
    }

    const mountBoard = (shape: [number, number], mines: number, depth: number = 1) => {
        let wrapper = document.getElementById('board-wrapper');
        if (wrapper) {
            ReactDOM.render(<Board shape={shape} mines={mines} depth={depth} revealed={false}/>, wrapper)
        }
        unmountMenu()
        setMounted(true);
    }

    const remountOptions = () => {
        let wrapper = document.getElementById('menu-wrapper');
        if (wrapper) {
            ReactDOM.render(<Options builder={mountBoard}/>, wrapper)
        }
    }

    return (
        <div className='game'>
            <div id="menu-wrapper">
            </div>
            <div id="board-wrapper">
            </div>
            <button style={{display: (mounted) ? 'block' : 'none'}} onClick={reset}>Reset</button>
        </div>
    )
}

export default GameInterface;