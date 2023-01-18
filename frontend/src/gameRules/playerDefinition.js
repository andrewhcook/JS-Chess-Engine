import {King,Queen,Rook, Bishop, Knight, Pawn} from "./individualPieces/index.js"
import {default as Move} from"./moveDefinition.js";
import { Piece } from "./pieceDefinition.js";
class Player {
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
    generateMoveList(maximizing, pieceArray, oppPieceArray, lastMove) {
        //generateMoveList isn't working for some reason
        console.log(maximizing, pieceArray, oppPieceArray);
        let moveArray = [];
      //  console.log(pieceArray, maximizing)
        let allPseudoLegalMoves1 = this.generatePseudoLegalMoveList(maximizing, pieceArray);
       console.log(allPseudoLegalMoves1.length);
        
        let allPseudoLegalMoves = this.prunePawnMoves(allPseudoLegalMoves1,lastMove, maximizing, pieceArray, oppPieceArray);
       console.log(allPseudoLegalMoves.length);
        
        let ownPseudoLegalMoves = this.pruneOutBlockedMoves(allPseudoLegalMoves, maximizing, pieceArray, oppPieceArray)
        console.log(ownPseudoLegalMoves.length);
     //   console.log(ownPseudoLegalMoves.length);
        for (let i of ownPseudoLegalMoves) {
          //  this.generateOppPieceArrayAfterMove(i);
         //   console.log(maximizing, pieceArray, oppPieceArray);
            if (this.determineIfMovesLeavesKingInCheck(maximizing, pieceArray, oppPieceArray)) {
                continue
            } else {
                moveArray.push(i)
            }
        }
        //console.log(moveArray.length);
        return moveArray
    }
    generatePseudoLegalMoveList(bool, pieceArray) {
        let iterator = pieceArray;
        /* 
        if (!bool) {
            iterator = oppPieceArray;
            
        } */
        
        let moveArray = [];
        for (let i of iterator) {
           // console.log(i);
            let patternIterator = i.movementPattern();
            for (let j of patternIterator) {
            //    console.log(j);
                if (this.determineIfMoveIsOnBoard(i.squareAddress,j)) {
                    let squareTo = [i.squareAddress[0] + j[0], i.squareAddress[1] + j[1]];
                    let squareFrom = i.squareAddress;
                    moveArray.push(new Move(squareFrom, squareTo, i.type, false,false,false, false, []))
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
    determineIfMovesLeavesKingInCheck(maximizing, pieceArray, oppPieceArray) {
      let attackMap = this.generateOppAttackMap(maximizing, pieceArray, oppPieceArray);
   //    console.log(pieceArray);
        const value = this.getKingPosition(pieceArray)
        if (attackMap.find((squareAddress)=> {return squareAddress[0] === value[0] && squareAddress[1] === value[1]})) {
            
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
    generateOppAttackMap(maximizing, pieceArray, oppPieceArray) {
        let squareArray = [];
        for (let i of this.pruneOutBlockedMoves(this.generatePseudoLegalMoveList(maximizing, oppPieceArray, pieceArray),false, oppPieceArray, pieceArray) ) {
            const square = i.squareAddressTo;
            if (squareArray.find((squareAddress)=> {squareAddress === i[0] && squareAddress[1] === i[1]})) {
                continue 
            } else {
                squareArray.push(square);
            }
        }
        return squareArray
    }
    getKingPosition(pieceArray) {
       // console.log(pieceArray);
        let king = pieceArray.find((piece)=> {return piece.type === "King"});
      // console.log(king);
        return king.squareAddress
    }
    getOppKingPosition(oppPieceArray) {
        let [king] = oppPieceArray.filter((piece)=> {typeof piece === King});
        return king.squareAddress
    }
    pruneOutBlockedMoves(pseudoLegalMoves, myOwn, pieceArray, oppPieceArray) {
        let oppOccupiedSquares = [];
        let ownOccupiedSquares = [];
       // console.log(pseudoLegalMoves.length);
        oppPieceArray.forEach((piece)=> {oppOccupiedSquares.push(piece.squareAddress)});
        pieceArray.forEach((piece) => {ownOccupiedSquares.push(piece.squareAddress)});
        

       // console.log(oppOccupiedSquares)
        let prunedPseudoLegalMoves = [];
       // console.log(pseudoLegalMoves.length);
        for (let i of pseudoLegalMoves) {
            if (i.piece === "Knight") {
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

    prunePawnMoves(moveList,oppMove = null, maximizing, pieceArray, oppPieceArray) {
        let prunedPawnMoves = [];
    //    console.log(moveList.length);
        for (let i of moveList) {
            if (i.piece !== "Pawn") {
                prunedPawnMoves.push(i);
                continue
            }
            if ((maximizing && i.squareAddressTo[0] - i.squareAddressFrom[0] > 0) || ( !maximizing && i.squareAddressTo[0] - i.squareAddressFrom[0] < 0)) {
                continue
            }
            if (Math.abs(i.squareAddressFrom[1] - i.squareAddressTo[1]) !== 0 && Math.abs(i.squareAddressFrom[0] - i.squareAddressTo[0]) === 2) {
                continue
            }
            if (oppPieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1] && Math.abs(i.squareAddressTo[1] - i.squareAddressFrom[1]) !== 0})) {
            //    console.log(i.squareAddressFrom, i.squareAddressTo)
                
                prunedPawnMoves.push(i);
                continue
            }
            if (!pieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1] })) {
                if (!oppPieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1] })) {
                    if (Math.abs(i.squareAddressTo[1] - i.squareAddressFrom[1]) === 0) {
                        prunedPawnMoves.push(i);
                        continue
                    }
                    
                    
                }
            }
            if  (maximizing &&  (i.squareAddressFrom[0] !== 6 && Math.abs(i.squareAddressTo[0] - i.squareAddressFrom)> 1)) {
                continue
            } else if (i.squareAddressFrom[0] !== 2 && Math.abs(i.squareAddressTo[0] - i.squareAddressFrom[0]) > 1) {
                continue}
            
            if (oppMove){
                if (oppMove.piece === "Pawn" && Math.abs(oppMove.squareAddressTo[0] - oppMove.squareAddressFrom) === 2 && pieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && Math.abs(piece.squareAddress[1] - i.squareAddressTo[1]) ===1})) {
                    prunedPawnMoves.push(i);
                }
            }
            
             //oppMove passed over a capture square of pieceArray, append the appropriate move to prunedPawnMoves
        }
     //   console.log(prunedPawnMoves.length);
        return prunedPawnMoves
    }

    minimax = (maximizing, depth, maxPieceArray, minPieceArray) => {
       // console.log(minPieceArray.length, maxPieceArray.length);
       //add check for checkmate
    
        if (maximizing) {
            if (depth === 0) {
                return this.quiescenceSearch(-10000, 10000, maxPieceArray, minPieceArray, true)
                
            }
            let max = -100000;
            for (let i of this.generateMoveList(true, maxPieceArray, minPieceArray)) {
                let [newMaxPieceArray, newMinPieceArray] = this.makeMove(maxPieceArray,minPieceArray,i)
                let score = this.minimax(false, depth-1, newMaxPieceArray, newMinPieceArray);
               // console.log(score);
                max = Math.max(score,max);
            }
           // console.log("max:",max);
            return max;
        } else {
            if (depth === 0) {
                return this.quiescenceSearch(-10000, 10000,minPieceArray , maxPieceArray, false)
            }
                let min = 100000;
               // console.log("min piece array before generateMoveList() call", minPieceArray);
                for (let i of this.generateMoveList(false, minPieceArray, maxPieceArray)){
                  //  console.log("move: in minimax: ", i);

                  //  console.log(minPieceArray, maxPieceArray, i);
                    let [newMinPieceArray, newMaxPieceArray] = this.makeMove(minPieceArray,maxPieceArray,i)
                    let score = this.minimax(true, depth-1, newMaxPieceArray, newMinPieceArray)
                    min = Math.min(score, min);
               //     console.log("min in loop:", min);
                }
          //  console.log("min:", min);
            return min
        }
    }
    makeMove(pieceArray, oppPieceArray, move) {
        //take the move and adjust the piece Array appropriately
        // pointer issues with line 309 : can't seem to change values of newPiece.squareAddress without affecting the original version as well
     //   console.log("piece array passed into makeMove(): ", pieceArray);
    //    console.log("move in makeMove(): ", move);
        let returnPieceArray= [...pieceArray];
        let returnOppPieceArray = [...oppPieceArray];
        if (oppPieceArray.includes((piece)=>{return move.squareAddressTo[0] === piece.squareAddress[0] && move.squareAddressTo[1] === piece.squareAddress[1]})){
             returnOppPieceArray  = returnOppPieceArray.filter((piece)=> {return move.squareAddressTo[0] !== piece.squareAddress[0] && move.squareAddressTo[1] !== piece.squareAddress[1]})
        }

        const cloner = (pieceToClone) => {if (pieceToClone.type === "Pawn") {
            return Object.assign(new Pawn, pieceToClone)
        } else if (pieceToClone.type ==="Rook") {
            return Object.assign(new Rook, pieceToClone)
        }else if (pieceToClone.type ==="Knight") {
            return Object.assign(new Knight, pieceToClone)
        }else if (pieceToClone.type ==="Bishop") {
            return Object.assign(new Bishop, pieceToClone)
        }else if (pieceToClone.type ==="Queen") {
            return Object.assign(new Queen, pieceToClone)
        }else if (pieceToClone.type ==="King") {
            return Object.assign(new King, pieceToClone)
        }
    }


    
        //let newPiece = Object.assign({},returnPieceArray.find((piece) => {return piece.squareAddress[0]=== move.squareAddressFrom[0] && piece.squareAddress[1] === move.squareAddressFrom[1]}))
        let newPiece = cloner(returnPieceArray.find((piece) => {return piece.squareAddress[0]=== move.squareAddressFrom[0] && piece.squareAddress[1] === move.squareAddressFrom[1]}))
      //  console.log("return piece array in makeMove() before filter",returnPieceArray);
        returnPieceArray = returnPieceArray.filter((piece)=> {return piece.squareAddress[0] !== move.squareAddressFrom[0] || piece.squareAddress[1] !== move.squareAddressFrom[1]});
      //  console.log("return piece array in makeMove() AFTER filter",returnPieceArray);
     
    //  console.log("new piece before reassignment: ", newPiece);
      newPiece.squareAddress = move.squareAddressTo;
     // console.log(newPiece.squareAddress, move.squareAddressTo);
     // console.log("new piece AFTER reassignment: ", newPiece);
        returnPieceArray.push(newPiece);
      //  console.log("return piece array in makemove: ", returnPieceArray);
        return [returnPieceArray,returnOppPieceArray]
    }
    nodeIsQuiescent(sideToMovePieceArray, sideWithoutmovePieceArray, alpha, beta) {

    }

    evaluate(pieceArray, oppPieceArray) {
        let score = 0
      //  console.log(pieceArray.length, oppPieceArray.length);
        for (let i of pieceArray) {
            score += i.staticValue;
        }
        for (let i of oppPieceArray) {
            score -= i.staticValue
        }
     //   console.log("score in evaluate",score);
        return score
    }
    quiescenceSearch(alpha, beta, pieceArray, oppPieceArray, maximizing){
     //   console.log( alpha, beta, pieceArray, oppPieceArray, maximizing);
        const stand_pat = this.evaluate(pieceArray, oppPieceArray);
        if (stand_pat >= beta) {
            return beta
        }
        if (alpha < stand_pat) {
            alpha = stand_pat
        }
        for (let i of this.generateCaptureMovesList(this.generateMoveList(maximizing, pieceArray, oppPieceArray),oppPieceArray)) {
           // console.log("new piece Array, new Opp piece Array: ", newPieceArray, newOppPieceArray);
            const [newPieceArray, newOppPieceArray] = this.makeMove(pieceArray, oppPieceArray, i);
            const score = -this.quiescenceSearch(-beta, -alpha, newOppPieceArray, newPieceArray, !maximizing); 
            if (score >= beta) {
                return beta
            }
            if (score > alpha) {
                alpha = score
            }
            
        }
        return alpha

    }
    

    generateCaptureMovesList(moveList, oppPieceArray) {
        let capturedMoveList = [];
        for (let i of moveList) {
            if (oppPieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1]})){
                capturedMoveList.push(i);
            }
        }
      //  console.log(capturedMoveList.length);
        return capturedMoveList
    }
    findBestMove(maximizing,tempPieceArray,tempOppPieceArray, lastMove = null) {
        
            let best = -10000;
            let bestMove = undefined;
            for (let i of this.generateMoveList(maximizing, tempPieceArray,tempOppPieceArray, lastMove)) {
             console.log(i);
                let [newPieceArray, newOppPieceArray] = this.makeMove(tempPieceArray, tempOppPieceArray, i);
              //  console.log("new piece Array in before first call to Minimax()", newPieceArray);
                let score = this.minimax(false, 1, newOppPieceArray, newPieceArray);
                if (best < score) {
                    bestMove = i;
                    best = score
                }
            }
       //     console.log(bestMove, maximizing)
            return bestMove
        }
}

export default Player
