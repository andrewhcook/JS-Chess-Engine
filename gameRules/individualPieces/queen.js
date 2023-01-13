import {Piece} from "/home/ahc/personalProjects2023/JsChessEngine/gameRules/pieceDefinition.js";
class Queen extends Piece {
    movementPattern() {
        let squares = [];
        let iterator = [-1,1,0];
        let otherIterator = [-1,1,0];
        for (let i of iterator) {
            for (let j of otherIterator) {
                for (let k = 1; k < 8; k++) {
                    if (i === 0 && j === 0) {
                        continue
                    }
                    squares.push([i*k, j *k])
                }
            }
        }
        return squares
    }
}

export default Queen;