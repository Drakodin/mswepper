/**
 * Generates a board according the given board size tuple and mine number.
 * @param boardShape A "tuple" (size 2 list) representing the number of rows
 *                  and columns for the board
 * @param mines The number of mines to be placed on the board.
 */
export const getMineBoard = (boardShape: [number, number], mines: number, id: string): number[][] => {
    // First user click must be a 0. Thus, flatten incoming array location, set it to a 0
    let safety = id.substring(id.indexOf('-') + 1).split(':').map(v => Number.parseInt(v))
    let flatSafeCenter = boardShape[1] * safety[0] + safety[1]

    let safeTop = flatSafeCenter - boardShape[1]
    let safeBot = flatSafeCenter + boardShape[1]
    let safeVals = [
        safeTop - 1, safeTop, safeTop + 1,
        flatSafeCenter - 1, flatSafeCenter, flatSafeCenter + 1,
        safeBot - 1, safeBot, safeBot + 1
    ]

    // Calculates and places mines randomly
    let mineLocations: number[] = []
    let size = boardShape[0] * boardShape[1]
    while (mineLocations.length !== mines) {
        let idx = Math.floor(Math.random() * size)
        if (idx < size && mineLocations.indexOf(idx) === -1 && safeVals.indexOf(idx) === -1) {
            mineLocations.push(idx)
        }
    }

    let base = zeros(boardShape)
    mineLocations.forEach((v) => {
        let row = Math.trunc((v / boardShape[1]));
        let col = (v % boardShape[1]);
        base[row][col] = 1
    })

    return base;
}

/**
 * Generates a numerically tiled board given a board of equal shape
 * with mines. Radar numbers are dependent on the depth of the radar.
 * 
 * @param mines A 2D number array that contains the locations of the mines 
 * @param depth The depth of the radar search. Set to 1 by default.
 * @returns The minesweeper game board
 */
export const getRadarBoard = (mines: number[][], depth: number = 1): number[][] => {
    let shape: [number, number] = [mines.length, mines[0].length]
    let base = zeros(shape)
    for (let i = 0; i < shape[0]; i++) {
        for (let j = 0; j < shape[1]; j++) {
            base[i][j] = calculateRadar(depth, [i, j], mines)
        }
    }
    return base;
}

/**
 * Calculates the radar score for the tile
 * @param depth The radius (not including center tile) of the radar search.
 *              Value of this influences the mine square's value
 * @param idx The 2D index of the array location in which to calculate for.
 * @param board The board of mines in which to calculate the value from.
 * @returns The number of mines surrounding location or (2 * depth)^2
 *          if there is a mine at the location.
 */
const calculateRadar = (depth: number, idx: [number, number], board: number[][]): number => {
    if (board[idx[0]][idx[1]] === 1) {
        return Math.pow((2 * depth + 1), 2)
    }

    let radar: number = 0;
    for (let i = idx[0] - depth; i <= idx[0] + depth; i++) {
        for (let j = idx[1] - depth; j <= idx[1] + depth; j++) {
            // Out of bounds
            if (i < 0 || i >= board.length || j < 0 || j > board[0].length) {
                continue;
            }
            if (board[i][j] === 1) {
                radar++;
            }
        }
    }
    return radar;
}

/**
 * Creates a 2D number array of all zeros, similar to numpy.zeros(shape)
 * @param shape The shape of the array
 */
export const zeros = (shape: [number, number]): number[][] => {
    let final: number[][] = []
    for (let i = 0; i < shape[0]; i++) {
        let row: number[] = new Array(shape[1])
        row.forEach((v, i, a) => {a[i] = 0})
        final.push(row)
    }
    return final
}