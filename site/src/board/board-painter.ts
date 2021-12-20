// constants that color the board for a good viewing experience
const CELL_TEXT_COLORS: {[key: number]: string} = {
    1: '#4abaff',
    2: '#1aab32',
    3: '#e02f02',
    4: '#9a02e0',
    5: '#e6b402',
    6: '#02e6c0',
    7: '#303030',
    8: '#7a4500',
    9: '#08005c'
}

export const getTextColor = (value: number): string => {
    return CELL_TEXT_COLORS[value]
}