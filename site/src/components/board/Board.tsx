import React from 'react';
import Tile from '../tile/Tile';
import { getMineBoard, getRadarBoard, zeros } from '../../board/board-generator';
import { propagate } from '../../board/board-mechanic';
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
}

export default class Board extends React.Component<BoardProps, BoardState> {
    tileRefs: any = []
    constructor(props: BoardProps) {
        super(props)
        this.state = {
            tiles: [],
            loaded: false,
        }
        this.generateBoard = this.generateBoard.bind(this)
        this.click = this.click.bind(this)
    }

    componentDidMount() {
        let radarBoard = zeros(this.props.shape)
        let tileBoard: JSX.Element[][] = []
        for (let i = 0; i < this.props.shape[0]; i++) {
            tileBoard.push([])
            this.tileRefs.push([])
            for (let j = 0; j < this.props.shape[1]; j++) {
                tileBoard[i][j] = <Tile ref={el => this.tileRefs[i][j] = el} revealed={false} key={`Cell-${i}:${j}`} id={`Cell-${i}:${j}`} value={radarBoard[i][j]}/>
            }
        }
        this.setState({tiles: tileBoard})
    }

    async generateBoard(e: any) {
        console.log(e.target.id)
        let radarBoard = getRadarBoard(getMineBoard(this.props.shape, this.props.mines, e.target.id), this.props.depth)
        let tileBoard: JSX.Element[][] = []

        if (this.props.revealed) {
            for (let i = 0; i < this.props.shape[0]; i++) {
                tileBoard.push([])
                for (let j = 0; j < this.props.shape[1]; j++) {
                    tileBoard[i][j] = <Tile ref={el => this.tileRefs[i][j] = el} revealed={true} key={`Cell-${i}:${j}`} id={`Cell-${i}:${j}`} value={radarBoard[i][j]}/>
                }
            }
        } else {
            for (let i = 0; i < this.props.shape[0]; i++) {
                tileBoard.push([])
                for (let j = 0; j < this.props.shape[1]; j++) {
                    tileBoard[i][j] = <Tile ref={el => this.tileRefs[i][j] = el} key={`Cell-${i}:${j}`} id={`Cell-${i}:${j}`} value={radarBoard[i][j]}/>
                }
            }
        }
        this.setState({tiles: tileBoard, loaded: true}) 
    }

    async click(e: any) {
        if (e.button === 0) {
            if (!this.state.loaded) {
                await this.generateBoard(e)
                propagate(this.tileRefs, {id: e.target.id})
            } else {
                propagate(this.tileRefs, {id: e.target.id})
            }
        }
    }

    render() {
        return (
            <div className="board" onClick={this.click}>
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