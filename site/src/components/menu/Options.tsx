import React from 'react';
import { Type } from 'typescript';
import { 
    DIFFICULTIES,
    VARIANTS,
    GAME_BOARD_DATA
} from '../../constants/game';

import './options.css';

export const Options = (props: {builder?: (shape: [number, number], mines: number, depth?: number) => any}) => {
    const [useDepth, setUseDepth] = React.useState(false);
    const [useCustom, setUseCustom] = React.useState(false);
    // Different flags, these represent valid form elements
    const [customFlags, setCustomFlags] = React.useState([false, false, false]);

    const forwardValues = (): void => {
        let variant = document.getElementById('variant') as HTMLSelectElement;
        let diff = document.getElementById('difficulty') as HTMLSelectElement;
        let depth = document.getElementById('depth-check') as HTMLInputElement;

        if (variant && diff && depth && !variant.disabled) {
            let varVal = variant.value;
            let diffVal = diff.value;
            let dVal = depth.checked;
            if (props.builder) {
                let boardData = GAME_BOARD_DATA[varVal][diffVal]
                let boardObject = {shape: boardData.shape, mines: boardData.mines, depth: (dVal) ? 2 : 1};
                sessionStorage.setItem('board', JSON.stringify(boardObject));
                props.builder(boardData.shape, boardData.mines, (dVal) ? 2 : 1)
            } else {
                console.log('No Builder');
            }
        } else {
            let shapeNode = document.getElementById('custom-shape') as HTMLInputElement;
            let minesNode = document.getElementById('custom-mines') as HTMLInputElement;
            let depthNode = document.getElementById('custom-depth') as HTMLInputElement;

            if (shapeNode && minesNode && depthNode) {
                let rawShape = shapeNode.value.split(',')
                let shape: [number, number] = [Number.parseInt(rawShape[0]), Number.parseInt(rawShape[1])]
                let mines = Number.parseInt(minesNode.value);
                let depth = (depthNode.value) ? Number.parseInt(depthNode.value) : 1;
                if (props.builder) {
                    // Session storage: shape, mines, depth
                    let boardObject = {shape: shape, mines: mines, depth: depth};
                    sessionStorage.setItem('board', JSON.stringify(boardObject));
                    props.builder(shape, mines, depth);
                } else {
                    console.log('No Builder')
                }
            }
        }
        
    }

    const checkIfDepth = () => {
        let variant = document.getElementById('variant') as HTMLSelectElement;

        if (variant) {
            if (variant.value === 'Preset') {
                setUseDepth(true);
            } else {
                setUseDepth(false);
            }
        }
    }

    /**
     * Validator for custom board inputs
     * @param e The trigger event
     * @param inputType The type, as a string, of what is expected.
     *                  This need not be an actual type.
     * @param input The index of the input in the custom board maker.
     * @returns Whether or not the input is valid.
     */
    const validateInput = (e: any, inputType: string, input: number) => {
        let val: string = e.target.value;
        if (inputType === 'number') {
            if (Number.isNaN(Number.parseInt(val)) || Number.isNaN(Number.parseFloat(val))) {
                return false;
            }
            return true;
        }
        if (inputType === 'int,int') {
            let split = val.split(',');
            let parseChecked = split.map(v => Number.isNaN(Number.parseInt(v)));
            if (parseChecked.includes(false)) {
                return false;
            }
            return true;
        }
    }

    return (
        <div className="options-root">
            <select disabled={useCustom} id="variant" placeholder="Variant">
                {VARIANTS.map(v => (
                    <option key={`v:${v}`} value={v}>{v}</option>
                ))}
            </select>

            <select disabled={useCustom} id="difficulty" placeholder="Difficulty">
                {DIFFICULTIES.map(v => (
                    <option key={`v:${v}`} value={v}>{v}</option>
                ))}
            </select>
            <label>Use Non-standard Depth?</label>
            <input id='depth-check' name="useDepth" type="checkbox" checked={useDepth} onChange={checkIfDepth}></input>
            <label>Custom Board?</label>
            <input id='custom-board' name="customBoard" type="checkbox" checked={useCustom} onChange={() => setUseCustom(!useCustom)}></input>
            <div className="options-custom" style={{opacity: (useCustom) ? 1 : 0.25}}>
                <label>Shape (rows then columns): </label>
                <input disabled={!useCustom} id='custom-shape' placeholder={'example: 2,3'}></input>
                <label>Mines: </label>
                <input disabled={!useCustom} id='custom-mines' placeholder={'example: 1'} type='number'></input>
                <label>Depth: </label>
                <input disabled={!useCustom} id='custom-depth' placeholder={'example: 1'} type='number'></input>
            </div>
            <button onClick={forwardValues}>Submit</button>
        </div>
    )
}