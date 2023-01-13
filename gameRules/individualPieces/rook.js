import {Piece} from "/home/ahc/personalProjects2023/JsChessEngine/gameRules/pieceDefinition.js";

class Rook extends Piece {
    movementPattern() {
        let squares = [];
        let iterator = [1,-1];
        for (let i of iterator) {
            for (let j = 1; j < 7; j++) {
                squares.push([i*j,0]);
                squares.push([0, i*j]);
            }
        }      
        return squares
    }
}

export default Rook;