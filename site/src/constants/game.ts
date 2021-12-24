// Difficulty Choices
export const DIFFICULTIES: string[] = [
    'Easy',
    'Medium',
    'Hard',
    'Expert'
]

export const VARIANTS: string[] = [
    'Microsoft',
    'Google',
    'Preset'
]

// Game Board Data
export const GAME_BOARD_DATA: {[key: string]: {[k: string]: {'shape': [number, number], 'mines': number}}} = {
    'Microsoft': {
        'Easy': {'shape': [8, 8], 'mines': 10},
        'Medium': {'shape': [16, 16], 'mines': 40},
        'Hard': {'shape': [16, 30], 'mines': 99},
        'Expert': {'shape': [20, 30], 'mines': 150}
    },
    'Google': {
        'Easy': {'shape': [8, 10], 'mines': 10},
        'Medium': {'shape': [14, 18], 'mines': 40},
        'Hard': {'shape': [20, 24], 'mines': 99},
        'Expert': {'shape': [25, 30], 'mines': 188}
    },
    'Preset': {
        'Easy': {'shape': [15, 15], 'mines': 10},
        'Medium': {'shape': [20, 25], 'mines': 25},
        'Hard': {'shape': [25, 30], 'mines': 40},
        'Expert': {'shape': [30, 30], 'mines': 60}
    }
}