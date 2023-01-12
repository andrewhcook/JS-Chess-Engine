import Piece from "../pieceDefinition";

class Rook extends Piece {
    movementPattern() {
        let squares = [];
        let iterator = [1,-1];
        for (let i in iterator) {
            for (let j = 1; j < 7; j++) {
                squares.push([i*j,0]);
                squares.push([0, i*j]);
            }
        }      
        return squares
    }
}

export default Rook;