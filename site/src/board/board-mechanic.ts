import { TileState } from "../components/tile/Tile";

// Set of exposed squares
let visited = new Set<string>()

/**
 * Checks if the index location is valid. Valid locations fit the conditions
 * - r = [min, max)
 * - c = [min2, max)
 * 
 * @param index An index of [r, c] in an array
 * @param min The lower bound, inclusive, for r
 * @param min2 The lower bound, inclusivie for c
 * @param max The upper bound, non-inclusive, for r
 * @param max2 The upper bound, non-inclusive, for c
 * @returns A boolean as to whether or not the index is in the array
 */
const checkValid = (index: number[], min: number, min2: number, max: number, max2: number) => {
    if (index[0] < min || index[0] >= max || index[1] < min2 || index[1] >= max2) {
        return false;
    }
    return true;
}

/**
 * Gets the numerical array position from an inputted id string.
 * @param params The parameters of the function. Required: id of type string corresponding to the
 *               starting square
 * @returns An array of type [r, c] for the position in the array
 */
const getPos = (params: {id: string}) => {
    return params.id.substring(params.id.indexOf('-') + 1).split(':').map(v => Number.parseInt(v))
}

/**
 * Gets the 1-Nearest Neighbors of an array position
 * @param pos The center position in which to get the neighbors for.
 * @returns A list of numerical positions of which to check for in the array.
 */
const getNeighbors = (pos: number[]): number[][] => {
    return [
        [pos[0] - 1, pos[1] - 1],
        [pos[0] - 1, pos[1]],
        [pos[0] - 1, pos[1] + 1],
        [pos[0], pos[1] - 1],
        [pos[0], pos[1] + 1],
        [pos[0] + 1, pos[1] - 1],
        [pos[0] + 1, pos[1]],
        [pos[0] + 1, pos[1] + 1]
    ];
}

/**
 * Opens all possible squares on the minesweeper board after a LMB click. Squares are
 * opened according to an iterative Breadth-First traversal of the tree with root with the
 * required id.
 * 
 * Only opens squares that have not previously been opened.
 * 
 * @param refMap A map of Tile React Component references corresponding
 *               to the tiles present on the screen.
 * @param params The parameters of the function. Required: id of type string corresponding to the
 *               starting square
 */
export const propagate = async (refMap: any[][], params: {id: string}): Promise<void> => {
    // Temporary queue for BFS execution
    let bfsQ: number[][] = []
    // Identifies cell [r, c] tuple position in grid
    let cellPos = getPos({id: params.id})

    bfsQ.push(cellPos)

    while (bfsQ.length !== 0) {
        let pos = bfsQ.pop()
        if (pos) {
            if (!checkValid(pos, 0, 0, refMap.length, refMap[0].length)) {
                continue;
            }

            visited.add(pos.toString())

            refMap[pos[0]][pos[1]].show()

            if (refMap[pos[0]][pos[1]].props.value === 0) {
                let surround: number[][] = getNeighbors(pos)
        
                surround.forEach(v => {
                    if (!visited.has(v.toString()) && checkValid(v, 0, 0, refMap.length, refMap[0].length)) {
                        bfsQ.push(v)
                    }
                })
            }
        }
    }
}

/**
 * A shortcut seen in mnay modern implementations of minesweeper in which a MMB click on an already
 * opened square forces open propagation of squares around, given that there are an equal number of
 * flags surrounding as it does have mines.
 * 
 * Operates the same as the standard propagate with the exception that the first round of non-zero
 * squares are included rather than not.
 * 
 * @param refMap A map of Tile React Component references corresponding
 *               to the tiles present on the screen.
 * @param params The parameters of the function. Required: id of type string corresponding to the
 *               starting square, mine of type number for the number of mines surrounding the start
 *               square
 * @returns A void promise signalling end of asynchronous execution.
 */
export const mmbPropagate = async (refMap: any[][], params: {id: string, mine: number}): Promise<void> => {
    let cellPos = getPos({id: params.id})
    let bfsQ: number[][] = []

    bfsQ.push(cellPos)
    let surround = getNeighbors(cellPos)

    // Check number of flags around position.
    let flags = 0;
    surround.forEach(v => {
        if (checkValid(v, 0, 0, refMap.length, refMap[0].length)) {
            if (refMap[v[0]][v[1]].state.flagged) {
                flags++;
            }
        }
    });

    if (flags !== refMap[cellPos[0]][cellPos[1]].props.value) {
        return;
    }

    bfsQ.push(...surround);

    while (bfsQ.length !== 0) {
        let pos = bfsQ.pop();
        if (pos) {
            if (!checkValid(pos, 0, 0, refMap.length, refMap[0].length)) {
                continue;
            }

            if (refMap[pos[0]][pos[1]].props.value === params.mine) {
                continue;
            }

            visited.add(pos.toString())

            refMap[pos[0]][pos[1]].show();
            if (refMap[pos[0]][pos[1]].props.value === 0) {
                let neighbors: number[][] = getNeighbors(pos)
        
                neighbors.forEach(v => {
                    if (!visited.has(v.toString()) && checkValid(v, 0, 0, refMap.length, refMap[0].length)) {
                        console.log(`new point: ${v}`)
                        bfsQ.push(v)
                    }
                })
            }
        }
    }
}

/**
 * Returns the state of the tile with the given id
 * @param refs A map of Tile React Component references corresponding
 *               to the tiles present on the screen.
 * @param params The parameters of the function. Required: id of type string corresponding to the
 *               starting square
 * @returns The state of the object requested
 */
export const checkState = (refs: any[][], params: {id: string}): TileState => {
    let cellPos = getPos({id: params.id})
    let cellR = cellPos[0]
    let cellC = cellPos[1]

    return refs[cellR][cellC].state
}

/**
 * Flags the tile with the given id.
 * @param refs A map of Tile React Component references corresponding
 *               to the tiles present on the screen.
 * @param params The parameters of the function. Required: id of type string corresponding to the
 *               starting square
 * @returns Void. Only executes the flagging operation with early returns
 */
export const flagTile = (refs: any[][], params: {id: string}) => {
    let cellPos = getPos({id: params.id})
    let cellR = cellPos[0]
    let cellC = cellPos[1]

    if (refs[cellR][cellC].state.hidden === false) {
        return;
    }

    refs[cellR][cellC].flag()   
}

/**
 * Returns the passed properties to the tile with the given id.
 * @param refs A map of Tile React Component references corresponding
 *               to the tiles present on the screen.
 * @param params The parameters of the function. Required: id of type string corresponding to the
 *               starting square
 * @returns The props of the Tile React Component
 */
export const getProps = (refs: any[][], params: {id: string}) => {
    let cellPos = getPos({id: params.id});
    return refs[cellPos[0]][cellPos[1]].props
}