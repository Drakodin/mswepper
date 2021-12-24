import React from 'react';
import Tile from '../tile/Tile';
import { getMineBoard, getRadarBoard, zeros } from '../../board/board-generator';
import { checkState, flagTile, getProps, mmbPropagate, propagate, visited } from '../../board/board-mechanic';
import './board.css';

interface BoardProps {
    shape: [number, number];
    mines: number;
    depth: number;
    revealed?: boolean
}

interface BoardState {
    tiles: JSX.Element[][],
    loaded: boolean
    revealed: boolean
    start: number
}

export default class Board extends React.Component<BoardProps, BoardState> {
    tileRefs: any = []
    loss: number = 0
    constructor(props: BoardProps) {
        super(props)
        this.state = {
            tiles: [],
            loaded: false,
            revealed: (props.revealed) ? props.revealed : false,
            start: 0
        }

        this.loss = (2 * props.depth + 1) * (2 * props.depth + 1)
        this.generateBoard = this.generateBoard.bind(this)
        this.click = this.click.bind(this)
        this.lostGame = this.lostGame.bind(this)
        this.winGame = this.winGame.bind(this)
    }

    componentDidMount() {
        let radarBoard = zeros(this.props.shape)
        let tileBoard: JSX.Element[][] = []
        for (let i = 0; i < this.props.shape[0]; i++) {
            tileBoard.push([])
            this.tileRefs.push([])
            for (let j = 0; j < this.props.shape[1]; j++) {
                tileBoard[i][j] = <Tile loss={this.loss} ref={el => this.tileRefs[i][j] = el} revealed={false} key={`Cell-${i}:${j}`} id={`Cell-${i}:${j}`} value={radarBoard[i][j]}/>
            }
        }
        this.setState({tiles: tileBoard})
    }

    async generateBoard(e: any) {
        let radarBoard = getRadarBoard(getMineBoard(this.props.shape, this.props.mines, e.target.id), this.props.depth)
        let tileBoard: JSX.Element[][] = []

        if (this.props.revealed) {
            for (let i = 0; i < this.props.shape[0]; i++) {
                tileBoard.push([])
                for (let j = 0; j < this.props.shape[1]; j++) {
                    tileBoard[i][j] = <Tile loss={this.loss} ref={el => this.tileRefs[i][j] = el} revealed={true} key={`Cell-${i}:${j}`} id={`Cell-${i}:${j}`} value={radarBoard[i][j]}/>
                }
            }
        } else {
            for (let i = 0; i < this.props.shape[0]; i++) {
                tileBoard.push([])
                for (let j = 0; j < this.props.shape[1]; j++) {
                    tileBoard[i][j] = <Tile loss={this.loss} ref={el => this.tileRefs[i][j] = el} key={`Cell-${i}:${j}`} id={`Cell-${i}:${j}`} value={radarBoard[i][j]}/>
                }
            }
        }
        this.setState({tiles: tileBoard, loaded: true, start: Date.now()}) 
    }

    lostGame() {
        for (let i = 0; i < this.tileRefs.length; i++) {
            for (let j = 0; j < this.tileRefs[0].length; j++) {
                this.tileRefs[i][j].show()
            }
        }
    }

    winGame() {
        let squaresLeft: number = 0;
        for (let i = 0; i < this.tileRefs.length; i++) {
            for (let j = 0; j < this.tileRefs[0].length; j++) {
                if (this.tileRefs[i][j].state.hidden) {
                    squaresLeft++;
                }
            }
        }
        if (squaresLeft === this.props.mines) {
            return true;
        }
        return false;
    }

    async click(e: any) {
        if (this.state.revealed) {
            return;
        }

        if (e.button === 0) {
            let tileState = checkState(this.tileRefs, {id: e.target.id})
            if (tileState.flagged) {
                // Can't click on a flag
                return;
            }

            if (!this.state.loaded) {
                await this.generateBoard(e)
                await propagate(this.tileRefs, {id: e.target.id})
            } else {
                await propagate(this.tileRefs, {id: e.target.id})
            }

            let props = getProps(this.tileRefs, {id: e.target.id})
            if (props.value === this.loss) {
                this.setState({revealed: true}, () => {
                    this.lostGame();
                    window.alert(`Game over! Time: ${Math.floor((Date.now() - this.state.start) / 1000)}s`)
                })
            } else if (this.winGame()) {
                window.alert(`Game won! Time: ${Math.floor((Date.now() - this.state.start) / 1000)}s`)
            }
        }

        if (e.button === 1) {
            let state = checkState(this.tileRefs, {id: e.target.id})
            if (state.hidden === true) {
                return;
            } else {
                await mmbPropagate(this.tileRefs, {id: e.target.id, mine: this.loss}).then(() => {
                    visited.forEach(v => {
                        let valPos = v.split(',').map(val => Number.parseInt(val))
                        let tile = this.tileRefs[valPos[0]][valPos[1]]
                        if (tile.state.hidden === false && tile.props.value === this.loss) {
                            this.lostGame()
                            window.alert(`Game over! Time: ${Math.floor((Date.now() - this.state.start) / 1000)}s`)
                        }
                    })
                    if (this.winGame()) {
                        window.alert(`Game won! Time: ${Math.floor((Date.now() - this.state.start) / 1000)}s`)
                    }
                })
            }
        }

        if (e.button === 2) {
            flagTile(this.tileRefs, {id: e.target.id})
        }
    }

    render() {
        return (
            <div className="board" onMouseDown={this.click}>
                {this.state.tiles.map((v, i) => {
                    return (
                        <div key={`row-${i}`} className="board-row">
                            {v.map(v => v)}
                        </div>
                    )
                })}
            </div>
        )
    }
}