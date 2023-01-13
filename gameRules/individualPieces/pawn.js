import {Piece} from "/home/ahc/personalProjects2023/JsChessEngine/gameRules/pieceDefinition.js";

class Pawn extends Piece {
    movementPattern() {
        let squares = [];
        let iterator = [1,-1];
        let otherIterator = [-1,1,0];
        for (let i of iterator) {
            for (let j of otherIterator) {
                squares.push([i,j])
            }
        }
        return squares
    }
}

export default Pawn;