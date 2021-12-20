import React from 'react';
import { getTextColor } from '../../board/board-painter';
import './tile.css';

export interface TileProps {
    value: number
    revealed?: boolean
    id: string
}

export interface TileState {
    hidden: boolean
    id: string
}

export default class Tile extends React.Component<TileProps, TileState> {
    constructor(props: TileProps) {
        super(props)
        this.state = {
            hidden: false,
            id: props.id
        }
        this.show = this.show.bind(this)
    }

    componentDidMount() {
        if (this.props.revealed) {
            this.setState({hidden: false})
        } else {
            this.setState({hidden: true})
        }
    }

    show() {
        this.setState({hidden: false})
    }

    render() {
        return (
            <div
                id={this.props.id}
                className='tile tile-wrapper'
                style={{
                    backgroundColor: (this.state.hidden === false) 
                        ? (this.props.value === 9) ? 'darkred' : 'rgb(255, 245, 213)'
                        : 'blue',
                    width: '20px',
                    height: '20px'
                }}
                onClick={this.show}
            >
                <div
                    className='tile tile-value'
                    style={{
                        visibility: (this.state.hidden) ? 'hidden' : 'visible',
                        color: getTextColor(this.props.value),
                    }}
                >
                    {(this.props.value > 0) ? this.props.value : ""}
                </div>
            </div>
        )
    }
}