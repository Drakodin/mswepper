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
        let val = document.getElementById(`${this.props.id}_value`)
        if (val) {
            val.style.visibility = 'visible'
        }

        let wrapper = document.getElementById(this.props.id)
        if (wrapper) {
            wrapper.style.backgroundColor = (this.props.value === 9) ? 'darkred' : 'rgb(255, 245, 213)'
        }
        this.setState({hidden: false})
    }

    flag() {
        let flag = document.getElementById(`${this.props.id}_flag`)
        this.setState({flagged: true}, () => {
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
                    backgroundColor: 'blue',
                    width: '20px',
                    height: '20px'
                }}
                onClick={this.show}
            >
                <div
                    className='tile tile-flag'
                >
                </div>
                <div
                    id={`${this.props.id}_value`}
                    className='tile tile-value'
                    style={{
                        visibility: 'hidden',
                        color: getTextColor(this.props.value),
                    }}
                >
                    {(this.props.value > 0) ? this.props.value : ""}
                </div>
            </div>
        )
    }
}