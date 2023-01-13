export class Move {
    constructor(squareAddressFrom, squareAddressTo, piece, isCapture, isCheck, isCheckmate, withAThreat,threatenedPieces) {
        this.squareAddressFrom = squareAddressFrom;
        this.squareAddressTo = squareAddressTo;
        this.piece = piece;
        this.isCapture = isCapture;
        this.isCheck = isCheck;
        this.isCheckmate = isCheckmate;
        this.withAThreat = withAThreat;
        this.threatenedPieces = threatenedPieces;
    }
}

