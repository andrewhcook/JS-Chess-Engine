import {Piece} from "/home/ahc/personalProjects2023/JsChessEngine/gameRules/pieceDefinition.js";

class King extends Piece {
    movementPattern() {
        let squares = [];
        let iterator = [-1,0,1];
        for (let i of iterator) {
            for (let j of iterator) {
                if (i === 0 && j === 0) {
                    continue
                }
                squares.push([i,j]);
            }
        }
        return squares
    }
}

export default King