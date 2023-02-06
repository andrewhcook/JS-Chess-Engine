import {Piece} from "../pieceDefinition.js";

class Bishop extends Piece {
    movementPattern() {
        let squares = [];
        let iterator = [1,-1];
        let otherIterator = [1,-1];
        for (let i of iterator) {
            for (let j of otherIterator) {
                for (let k = 1; k <= 7; k++) {
                    squares.push([i*k,j*k])
                }   
            }
        }
        return squares
    }
}

export default Bishop;