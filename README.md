## Currently Supported Variants
- Microsoft Minesweeper - Easy, Intermediate (Medium), Expert (Hard)
- Google Minesweeper - Easy, Medium, Hard
- Preset (Internal) Minesweeper - Easy, Medium, Hard

## Special Variants
- Non-standard Depth - Games will play with block depth of 2 rather than 1, creating a much more difficult experience. Flags will operate the same as 1-depth games and thus may be less reliable. This is only available using "Preset" boards.
- Expert difficulty - Though Microsoft claims their Expert difficult is the top, it is the equivalent of Google's Hard. Difficulty does not correlate to the number of mines, but rather the ratio. Thus, the ratio of expert games, save from the 2-depth gamemode, has been reduced to 4:1 as opposed to 4.84:1 while retaining good aspect ratio on the screen.

## Functionality
- Games are built by taking in a shape (`[r, c]`), mine number, and search depth. Thus, it is possible add more options to the Options component and to the constants where the board data is held and not break functionality. A custom mode via the menu form will be added in a later update.
- Standard Minesweeper functionality is upheld.
    - Left Mouse (LMB) - Clear one square and all of the squares around it. If the 1-Nearest Neighbor is a 0, then apply the opening functionality again. In a sense, when clicking, expand a tree using the click square as the root. The tree is expanded using the iterative version of the Breadth First Search algorithm in order to avoid a recursion error.
    - Middle Mouse (MMB) - If there is a square where the number of surrounding flags is equivalent to the value, then expand all nearby squares. Unlike the LMB, this expands all squares around the start, even if they are not 0s. If the player has incorrectly flagged a mine and performs this operation, the player will expose the mine and lose the game.
    - Right Mouse (RMB) - Places a flag on the square. Flags can only be removed using the right mouse button and clicking on the flag with any other key will not expose the square flagged. The flag must be removed in order to expose the square.
    - Safe Zone - Boards are generated at the time of the player's click rather than before as a condition must be met: the starting location must be 0. This ensures a safe space in order to start. The lowest size the start can be is 3x3, that is every square near the center does not neighbor a mine, but the neighbors of the center do. 
- A timer is kept internally starting when the player uncovers their first square(s). The time measured is exact by using system time rather than updating an object as that can carry small lag intervals. This is later floored when revealing the time upon completion or loss.
- Players have infinite flags. Google abides by this as well, alerting players of their flag count. An active counter of the number of mines to expect will be added at a later date.
- The context menu has been disabled. Earlier testing showed that in Firefox, event defaults still activate even if they have been prevented. Thus, the menu has been disabled entirely. In order to access the console, use keyboard shortcuts.
