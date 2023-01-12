import Piece from "../pieceDefinition";

class Knight extends Piece {
    movementPattern() {
        let squares = [];
        let iterator = [2,-2];
        let otherIterator = [1,-1];
        for (let i in iterator) {
            for (let j in otherIterator) {
                squares.push([i,j]);
                squares.push([j,i]);
            }
        }
        return squares
    }
}

export default Knight;