import React from 'react';
import { 
    DIFFICULTIES,
    VARIANTS,
    GAME_BOARD_DATA
} from '../../constants/game';

export const Options = (props: {builder?: (shape: [number, number], mines: number, depth?: number) => any}) => {
    const [useDepth, setUseDepth] = React.useState(false);

    const forwardValues = (): void => {
        let variant = document.getElementById('variant') as HTMLSelectElement;
        let diff = document.getElementById('difficulty') as HTMLSelectElement;
        let depth = document.getElementById('depth-check') as HTMLInputElement;

        if (variant && diff && depth) {
            let varVal = variant.value;
            let diffVal = diff.value;
            let dVal = depth.checked;
            if (props.builder) {
                let boardData = GAME_BOARD_DATA[varVal][diffVal]
                props.builder(boardData.shape, boardData.mines, (dVal) ? 2 : 1)
            } else {
                console.log('No Builder');
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

    return (
        <div>
            <select id="variant" placeholder="Variant">
                {VARIANTS.map(v => (
                    <option key={`v:${v}`} value={v}>{v}</option>
                ))}
            </select>

            <select id="difficulty" placeholder="Difficulty">
                {DIFFICULTIES.map(v => (
                    <option key={`v:${v}`} value={v}>{v}</option>
                ))}
            </select>
            <label>Use Non-standard Depth?</label>
            <input id='depth-check' name="useDepth" type="checkbox" checked={useDepth} onChange={checkIfDepth}></input>
            <button onClick={forwardValues}>Submit</button>
        </div>
    )
}