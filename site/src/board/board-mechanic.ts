let bfsQ: number[][] = []
let visited = new Set<string>()

const checkValid = (index: number[], min: number, max: number) => {
    if (index[0] < min && index[0] >= max && index[1] < min && index[1] >= max) {
        return false;
    }
    return true;
}

export const propagate = (refMap: any[][], params: {id?: string, idx?: number[]}): void => {
    // Identifies cell [r, c] tuple position in grid
    let cellPos: number[] = [];
    let cellR: number = 0;
    let cellC: number = 0;

    if (params.id) {
        cellPos = params.id.substring(params.id.indexOf('-') + 1).split(':').map(v => Number.parseInt(v))
        cellR = cellPos[0]
        cellC = cellPos[1]
    } else if (params.idx) {
        cellR = params.idx[0]
        cellC = params.idx[1]
    }

    bfsQ.push(cellPos)

    while (bfsQ.length != 0) {
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