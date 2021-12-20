import { TileState } from "../components/tile/Tile";

let bfsQ: number[][] = []
let visited = new Set<string>()

const checkValid = (index: number[], min: number, max: number) => {
    if (index[0] < min && index[0] >= max && index[1] < min && index[1] >= max) {
        return false;
    }
    return true;
}

const getPos = (params: {id: string}) => {
    return params.id.substring(params.id.indexOf('-') + 1).split(':').map(v => Number.parseInt(v))
}

export const propagate = async (refMap: any[][], params: {id: string}): Promise<void> => {
    // Identifies cell [r, c] tuple position in grid
    let cellPos = getPos({id: params.id})

    bfsQ.push(cellPos)

    while (bfsQ.length !== 0) {
        let pos = bfsQ.pop()
        if (pos) {
            if (pos[0] < 0 || pos[0] >= refMap.length || pos[1] < 0 || pos[1] >= refMap[0].length) {
                continue;
            }

            visited.add(pos.toString())

            refMap[pos[0]][pos[1]].show()

            if (refMap[pos[0]][pos[1]].props.value === 0) {
                let surround: number[][] = [
                    [pos[0] - 1, pos[1] - 1],
                    [pos[0] - 1, pos[1]],
                    [pos[0] - 1, pos[1] + 1],
                    [pos[0], pos[1] - 1],
                    [pos[0], pos[1] + 1],
                    [pos[0] + 1, pos[1] - 1],
                    [pos[0] + 1, pos[1]],
                    [pos[0] + 1, pos[1] + 1]
                ]
        
                surround.forEach(v => {
                    if (!visited.has(v.toString()) && checkValid(v, 0, refMap[0].length)) {
                        bfsQ.push(v)
                    }
                })
            }
        }
    }
}

export const checkState = (refs: any[][], params: {id: string}): TileState => {
    let cellPos = getPos({id: params.id})
    let cellR = cellPos[0]
    let cellC = cellPos[1]

    return refs[cellR][cellC].state
}

export const flagTile = (refs: any[][], params: {id: string}) => {
    let cellPos = getPos({id: params.id})
    let cellR = cellPos[0]
    let cellC = cellPos[1]

    refs[cellR][cellC].flag()   
}

export const getProps = (refs: any[][], params: {id: string}) => {
    let cellPos = getPos({id: params.id});
    return refs[cellPos[0]][cellPos[1]].props
}