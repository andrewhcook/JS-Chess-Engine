class Board {
    constructor(boardState, isPlayer1toMove, moveNumber) {
        this.boardState = boardState;
        this.isPlayer1toMove = isPlayer1toMove;
        this.moveNumber = moveNumber;
    }
}

export default Board