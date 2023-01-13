import {King,Queen,Rook, Bishop, Knight, Pawn} from "/home/ahc/personalProjects2023/JsChessEngine/gameRules/individualPieces/index.js"
import {Move} from "/home/ahc/personalProjects2023/JsChessEngine/gameRules/moveDefinition.js"
export class Player {
    constructor(name, isComputer, skillLevel, pieceArray, oppPieceArray) {
        this.name = name;
        this.isComputer = isComputer;
        this.skillLevel = skillLevel;
        this.pieceArray = pieceArray;
        this.oppPieceArray = oppPieceArray;
        this.tempPieceArray = pieceArray;
        this.tempOppPieceArray = oppPieceArray;
        this.ownAttackMap = [];
        this.oppAttackMap = [];
    }
// generate Move List is broken
// pruneOutBlockedMoves is only returning 6 Pawn @[6,0] moves
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
        let allPseudoLegalMoves = this.generatePseudoLegalMoveList(true);
       console.log(allPseudoLegalMoves.length);
        let ownPseudoLegalMoves = this.pruneOutBlockedMoves(allPseudoLegalMoves, true)
        console.log(ownPseudoLegalMoves.length);
        for (let i of ownPseudoLegalMoves) {
          //  this.generateOppPieceArrayAfterMove(i);
         //   console.log(this.pieceArray)
            if (this.determineIfMovesLeavesKingInCheck()) {
                continue
            } else {
                moveArray.push(i)
            }
        }
      //  console.log(moveArray.length);
        return moveArray
    }
    generateOppMoveList(physicalBoard) {
        let moveArray = [];
        let oppPseudoLegalMoves = this.pruneOutBlockedMoves(this.generateOppPseudoLegalMoveList(true), false)
        
        for (let i of oppPseudoLegalMoves) {
            this.generateOwnPieceArrayAfterMove(i);
            this.generateOppAttackMap();
            
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
        for (let i of iterator) {
         //   console.log(i);
            let patternIterator = i.movementPattern();
            for (let j of patternIterator) {
            //    console.log(j);
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
        for (let i of iterator) {
            let patternIterator = i.movementPattern();
            for (let j of patternIterator) {
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
       this.generateOppAttackMap();
        const value = this.getKingPosition(this.pieceArray)
        if (this.oppAttackMap.find((squareAddress)=> {return squareAddress[0] === value[0] && squareAddress[1] === value[1]})) {
            
            return true
        } else {return false}
    }
    determineIfMovesLeavesOppKingInCheck() {
        const value = this.getKingPosition(this.oppPieceArray)
        if (this.attackMap.find((squareAddress)=> { squareAddress[0] === value[0] && squareAddress[1] === value[1]})) {
            
            return true
        } else {return false}
    }


    findPawnMoves(physicalBoard) {

        }

    generateOwnAttackMap() {
        
        let squareArray = [];
        for (let i of this.pruneOutBlockedMoves(this.generatePseudoLegalMoveList(true), true) ) {
            const square = i.squareAddressTo;
            if (squareArray.find((squareAddress)=> {squareAddress === i[0] && squareAddress[1] === i[1]})) {
                continue 
            } else {
                squareArray.push(square);
            }
        }
        this.ownAttackMap = squareArray
    }
    generateOppAttackMap() {
        let squareArray = [];
        for (let i of this.pruneOutBlockedMoves(this.generateOppPseudoLegalMoveList(true), false) ) {
            const square = i.squareAddressTo;
            if (squareArray.find((squareAddress)=> {squareAddress === i[0] && squareAddress[1] === i[1]})) {
                continue 
            } else {
                squareArray.push(square);
            }
        }
        this.oppAttackMap = squareArray
    }
    getKingPosition(pieceArray) {
       // console.log(pieceArray);
        let king = pieceArray.find((piece)=> {return piece.type === "King"});
      //  console.log(king);
        return king.squareAddress
    }
    getOppKingPosition(oppPieceArray) {
        let [king] = oppPieceArray.filter((piece)=> {typeof piece === King});
        return king.squareAddress
    }
    pruneOutBlockedMoves(pseudoLegalMoves, myOwn) {
        let oppOccupiedSquares = [];
        let ownOccupiedSquares = [];
       // console.log(pseudoLegalMoves.length);
        this.oppPieceArray.forEach((piece)=> {oppOccupiedSquares.push(piece.squareAddress)});
        this.pieceArray.forEach((piece) => {ownOccupiedSquares.push(piece.squareAddress)});
        

       // console.log(oppOccupiedSquares)
        let prunedPseudoLegalMoves = [];
       // console.log(pseudoLegalMoves.length);
        for (let i of pseudoLegalMoves) {
            if (i.piece.type === "Knight") {
                if (oppOccupiedSquares.find((squareAddress)=> {return squareAddress[0] === i.squareAddressTo[0] && squareAddress[1] === i.squareAddressTo[1]})) {
                    prunedPseudoLegalMoves.push(i)
                    
                } else if (!ownOccupiedSquares.find((squareAddress)=> {return squareAddress[0] === i.squareAddressTo[0] && squareAddress[1] === i.squareAddressTo[1]})) {
                    prunedPseudoLegalMoves.push(i)
                }
                continue
            }
            let rank_iter_direction =  (i.squareAddressTo[0] - i.squareAddressFrom[0]) /  Math.abs(i.squareAddressTo[0] - i.squareAddressFrom[0]);
            let file_iter_direction = (i.squareAddressTo[1] - i.squareAddressFrom[1]) / Math.abs(i.squareAddressTo[1] - i.squareAddressFrom[1]);
            if (!rank_iter_direction) {
                rank_iter_direction = 0;
            }
            if (!file_iter_direction) {
                file_iter_direction = 0;
            }
           // console.log(file_iter_direction);
            let rank_limit = 0;
            let file_limit = 0;
            let rank_distance = Math.abs(i.squareAddressFrom[0] - i.squareAddressTo[0]);
            let file_distance = Math.abs(i.squareAddressFrom[1] - i.squareAddressTo[1]);
            let iter_distance = Math.max(rank_distance, file_distance);
            let addmove = true;
            for (let j = 1; j <= iter_distance; j++) {
                const new_square = [i.squareAddressFrom[0] + j * rank_iter_direction, i.squareAddressFrom[1] + j * file_iter_direction];
                let onBoard = true;
                for (let j of new_square) {
                    if (j > 7 || j < 0) {
                        onBoard = false
                    }
                }
                if (!onBoard) {
                    break
                }

                if (oppOccupiedSquares.find((squareAddress)=> {return squareAddress[0]=== i.squareAddressFrom[0] + j* rank_iter_direction && squareAddress[1] === i.squareAddressFrom[1] + j * file_iter_direction})) {
                    if (j < iter_distance) {
                        addmove = false
                    }
                    break
                } else if (ownOccupiedSquares.find((squareAddress)=> {return squareAddress[0]=== i.squareAddressFrom[0] + j* rank_iter_direction && squareAddress[1] === i.squareAddressFrom[1] + j * file_iter_direction})){
                    addmove = false;
                    break
                } else {
                    continue
                }
            } if (addmove) {
                prunedPseudoLegalMoves.push(i);
            }
          //  console.log(rank_limit, file_limit);
            
            }
             
        
        //console.log(prunedPseudoLegalMoves.length);
        return prunedPseudoLegalMoves
    }


    makeMove() {}
    
}
