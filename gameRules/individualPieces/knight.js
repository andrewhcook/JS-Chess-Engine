import {Piece} from "/home/ahc/personalProjects2023/JsChessEngine/gameRules/pieceDefinition.js";

class Knight extends Piece {
    movementPattern() {
        let squares = [];
        let iterator = [2,-2];
        let otherIterator = [1,-1];
        for (let i of iterator) {
            for (let j of otherIterator) {
                squares.push([i,j]);
                squares.push([j,i]);
            }
        }
        return squares
    }
}

export default Knight;