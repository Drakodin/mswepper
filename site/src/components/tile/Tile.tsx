import React from 'react';
import { getTextColor } from '../../board/board-painter';
import './tile.css';

export interface TileProps {
    loss: number
    value: number
    revealed?: boolean
    id: string
}

export interface TileState {
    hidden: boolean
    id: string
    flagged: boolean
}

export default class Tile extends React.Component<TileProps, TileState> {
    constructor(props: TileProps) {
        super(props)
        this.state = {
            hidden: false,
            id: props.id,
            flagged: false
        }
        this.show = this.show.bind(this)
        this.flag = this.flag.bind(this)
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

    flag() {
        let flag = document.getElementById(`${this.props.id}_flag`)
        this.setState({flagged: !this.state.flagged}, () => {
            if (flag) {
                if (this.state.flagged) {
                    flag.style.display = 'block'
                } else {
                    flag.style.display = 'none'
                }
            }
        })
    }

    render() {
        return (
            <div
                id={this.props.id}
                className='tile tile-wrapper'
                style={{
                    backgroundColor: (this.state.hidden) ? '#61c9af' : 'rgb(255, 245, 213)',
                    width: '20px',
                    height: '20px'
                }}
            >
                <div
                    id={`${this.props.id}_flag`}
                    className='tile tile-flag'
                >
                </div>
                <div
                    id={`${this.props.id}_value`}
                    className={(this.props.value >= 0 && this.props.value < this.props.loss) ? 'tile tile-value' : 'tile tile-mine'}
                    style={{
                        visibility: (this.state.hidden) ? 'hidden' : 'visible',
                        color: getTextColor(this.props.value),
                    }}
                >
                    {(this.props.value > 0 && this.props.value < this.props.loss) ? this.props.value : ""}
                </div>
            </div>
        )
    }
}