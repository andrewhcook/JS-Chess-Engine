import {King,Queen,Rook, Bishop, Knight, Pawn} from "./individualPieces"
import {Move} from "./moveDefinition"
class Player {
    constructor(name, isComputer, skillLevel, pieceArray, oppPieceArray) {
        this.name = name;
        this.isComputer = isComputer;
        this.skillLevel = skillLevel;
        this.pieceArray = pieceArray;
        this.oppPieceArray = oppPieceArray;
        this.tempPieceArray = null;
        this.tempOppPieceArray = null;
        this.ownAttackMap = null;
        this.oppAttackMap = null;
    }

    classifyMoves(moveArray) {
        //check for check
        // if check, check for checkmate 
        // check for draw (repetition, 50-move)
        // 
    }
    //[x] list out all legal moves => []determine move type / calculation order =>[] feed into thought process (decide on a move)=> make a move 

    
    generateOwnPieceArrayAfterMove(move) {
        this.tempPieceArray = this.pieceArray.filter((piece)=> {return (piece.squareAddress[0] !== move.squareAddressFrom[0] && piece.squareAddress[1]
            !== move.squareAddressFrom[1])});
            this.tempPieceArray.push(move.piece);
    }

    generateOppPieceArrayAfterMove(move) {
        this.tempOppPieceArray = this.oppPieceArray.filter((piece)=> {return (piece.squareAddress[0] !== move.squareAddressFrom[0] && piece.squareAddress[1]
            !== move.squareAddressFrom[1])});
            this.tempOppPieceArray.push(move.piece);
    }
    generateMoveList() {
        let moveArray = [];
        let ownPseudoLegalMoves = this.pruneOutBlockedMoves(this.generatePseudoLegalMoveList(true), true)
        
        for (let i in ownPseudoLegalMoves) {
            this.generateOppPieceArrayAfterMove(i);
            this.generateOppAttackMap();
            const king_position = typeof i.piece === King ? i.squareAddressTo : this.pieceArray.filter((piece)=> {return typeof piece === King}).squareAddress;
            if (this.determineIfMovesLeavesKingInCheck(this.tempOppPieceArray)) {
                continue
            } else {
                moveArray.push(i)
            }
        }
        return moveArray
    }
    generateOppMoveList(physicalBoard) {
        let moveArray = [];
        let oppPseudoLegalMoves = this.pruneOutBlockedMoves(this.generateOppPseudoLegalMoveList(true), false)
        
        for (let i in oppPseudoLegalMoves) {
            this.generateOwnPieceArrayAfterMove(i);
            this.generateOppAttackMap();
            const king_position = typeof i.piece === King ? i.squareAddressTo : this.pieceArray.filter((piece)=> {return typeof piece === King}).squareAddress;
            if (this.determineIfMovesLeavesOppKingInCheck(this.tempPieceArray)) {
                continue
            } else {
                moveArray.push(i)
            }
        }
        return moveArray
    }

    generatePseudoLegalMoveList(bool) {
        let iterator = this.pieceArray;
        if (bool) {
            iterator = this.tempPieceArray;
        }
        let moveArray = [];
        for (let i in iterator) {
            let patternIterator = i.movementPattern();
            for (let j in patternIterator) {
                if (this.determineIfMoveIsOnBoard(i.squareAddress,j)) {
                    let squareTo = [i.squareAddress[0] + j[0], i.squareAddress[1] + j[1]]
                    moveArray.push(new Move(i.squareAddress, squareTo, i, false,false,false, false, []))
                }
            }
        }
        return moveArray
    }
    generateOppPseudoLegalMoveList(bool) {
        let iterator = this.oppPieceArray;
        if (bool) {
            iterator = this.tempOppPieceArray;
        }
        let moveArray = [];
        for (let i in iterator) {
            let patternIterator = i.movementPattern();
            for (let j in patternIterator) {
                if (this.determineIfMoveIsOnBoard(i.squareAddress,j)) {
                    let squareTo = [i.squareAddress[0] + j[0], i.squareAddress[1] + j[1]]
                    moveArray.push(new Move(i.squareAddress, squareTo, i, false,false,false, false, []))
                }
            }
        }
        return moveArray
    }

    determineIfMoveIsOnBoard(currentSquare, movementPattern) {
        let first_value = currentSquare[0] + movementPattern[0];
        let second_value = currentSquare[1] + movementPattern[1];
        if (first_value > 7 || first_value < 0 || second_value > 7 || second_value < 0) {
            return false
        } else {return true}
    }
    determineIfMovesLeavesKingInCheck() {
        if (this.oppAttackMap.find(this.getKingPosition(this.tempPieceArray))) {
            return true
        } else {return false}
    }
    determineIfMovesLeavesOppKingInCheck() {
        if (this.AttackMap.find(this.getOppKingPosition(this.tempOppPieceArray))) {
            return true
        } else {return false}
    }


    findPawnMoves(physicalBoard) {

        }

    generateOwnAttackMap() {
        let squareArray = [];
        for (let i in this.pruneOutBlockedMoves(this.generatePseudoLegalMoveList(),true) ) {
            const square = i.squareAddressTo;
            if (squareArray.find(i)) {
                continue 
            } else {
                squareArray.push(square);
            }
        }
        this.attackMap = squareArray
    }
    generateOppAttackMap() {
        let squareArray = [];
        for (let i in this.pruneOutBlockedMoves(this.generateOppPseudoLegalMoveList(), false) ) {
            const square = i.squareAddressTo;
            if (squareArray.find(i)) {
                continue 
            } else {
                squareArray.push(square);
            }
        }
        this.oppAttackMap = squareArray
        return       
    }
    getKingPosition(pieceArray) {
        let [king] = pieceArray.filter((piece)=> {typeof piece === King});
        return king.squareAddress
    }
    getOppKingPosition(oppPieceArray) {
        let [king] = oppPieceArray.filter((piece)=> {typeof piece === King});
        return king.squareAddress
    }
    pruneOutBlockedMoves(pseudoLegalMoves, myOwn) {
        const oppOccupiedSquares = this.oppPieceArray.forEach((piece)=> {return piece.squareAddress});
        const ownOccupiedSquares = this.pieceArray.forEach((piece) => {return piece.squareAddress});
        if (!myOwn) {
            [oppOccupiedSquares, ownOccupiedSquares] = [ownOccupiedSquares, oppOccupiedSquares];
        };
        let prunedPseudoLegalMoves = [];
        // determine starting position and piece direction 
        // determine first blocker along diagonal
        // prune out moves at or above blocker on the diagonal depending on if the blocker is opp or own
        // start queen at [0,0] own blocker at [2,2] how to determine moves to prune out along the [0,0] - [7,7] diagonal?
       // determine start and end point if type is NOT knight determine if any piece lay in between these two points
        for (let i in pseudoLegalMoves) {
            if (typeof i.piece === Knight) {
                continue
            };
            const [rankStart, fileStart] = i.squareAddressFrom;
            const [rankEnd, fileEnd] = i.squareAddressTo;
            const rankDirection = rankStart + rankEnd;
            const fileDirection = fileStart + fileEnd;
            let [rankLimit, fileLimit] = [0,0];
            for (let j = 0; j < 7; j++) {
                if (ownOccupiedSquares.find([rankStart + (j* rankDirection), fileStart + (j * fileDirection)])) {
                    [rankLimit, fileLimit] = [(j-1)* rankDirection , (j-1)*fileDirection]
                    break
                } else if (oppOccupiedSquares.find([rankStart + (j* rankDirection), fileStart + (j * fileDirection)])) {
                    [rankLimit, fileLimit] = [rankStart + (j* rankDirection), fileStart + (j * fileDirection)];
                    break
                } 
            }
         if (i.squareAddressTo[0] > rankLimit || i.squareAddressTo[1] > fileLimit) {
            continue
         } else {
            prunedPseudoLegalMoves.push(i);
         }
        }
        return prunedPseudoLegalMoves
    }

    makeMove() {}
    
}

export default Player