import Piece from "../pieceDefinition";

class Bishop extends Piece {
    movementPattern() {
        let squares = [];
        let iterator = [1,-1];
        let otherIterator = [1,-1];
        for (let i in iterator) {
            for (let j in otherIterator) {
                for (let k = 1; k <7; k++) {
                    squares.push([i*k,j*k])
                }   
            }
        }
        return squares
    }
}

export default Bishop;