import {King,Queen,Rook, Bishop, Knight, Pawn} from "./individualPieces/index.js"
import {default as Move} from"./moveDefinition.js";
import { Piece } from "./pieceDefinition.js";
//write a test suite for the minimax
/// minimax should implement alpha beta pruning as well as move ordering to reduce search depth (also caching positions in a transposition table)
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

    generateMoveList(maximizing, pieceArray, oppPieceArray, lastMove) {
        //generateMoveList isn't working for some reason
        
        let moveArray = [];
        let allPseudoLegalMoves1 = this.generatePseudoLegalMoveList(maximizing, pieceArray);
       
        
        let allPseudoLegalMoves = this.prunePawnMoves(allPseudoLegalMoves1,lastMove, maximizing, pieceArray, oppPieceArray);
       
        
        let ownPseudoLegalMoves = this.pruneOutBlockedMoves(allPseudoLegalMoves, maximizing, pieceArray, oppPieceArray)
       
        for (let i of ownPseudoLegalMoves) {
            let capturedPiece = oppPieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1]});
              //  console.log(capturedPiece);
                if (capturedPiece) {
                    if (capturedPiece.type === "King") {
                    //    console.log('this works');
                        continue
                    }
                }
          //  this.generateOppPieceArrayAfterMove(i);
            if (this.determineIfMovesLeavesKingInCheck(maximizing, pieceArray, oppPieceArray)) {
                //console.log("detected move leaves king in check:", i)
                continue
            } else {
                
                moveArray.push(i)
            }
        }
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
            let patternIterator = i.movementPattern();
            for (let j of patternIterator) {

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
    determineIfMovesLeavesKingInCheck(white, pieceArray, oppPieceArray) {
        let attackMap = this.generateOppAttackMap(white, pieceArray, oppPieceArray);
        const value = this.getKingPosition(pieceArray)
        if (attackMap.find((squareAddress)=> {return squareAddress[0] === value[0] && squareAddress[1] === value[1]})) {
           // console.log("detected a move that left king in check");
            return true
        } else {return false}
    }

    ///////////////////////////////////////////
    generateOppAttackMap(white, pieceArray, oppPieceArray) {
        let squareArray = [];
        let plm = this.generatePseudoLegalMoveList(!white, oppPieceArray);
        let prunedlm = this.prunePawnMoves(plm,null, !white, oppPieceArray, pieceArray);
        let prunedblockedmoves = this.pruneOutBlockedMoves(prunedlm, true, oppPieceArray, pieceArray);
        for (let i of prunedblockedmoves ) {
            if (i.type === "Pawn" ){
                if (Math.abs(i.squareAddressTo[0] - i.squareAddressFrom[0]) === 2 || (Math.abs(i.squareAddressTo[1] - i.squareAddressFrom[1])=== 0)) {
                    continue
                }
            }
            const square = i.squareAddressTo;
            if (squareArray.find((squareAddress)=> {squareAddress[0] === square[0] && squareAddress[1] === square[1]})) {
                continue 
            } else {
                squareArray.push(square);
            }
        }
        return squareArray
    }
    getKingPosition(pieceArray) {
    //    console.log(pieceArray);
        let king = pieceArray.find((piece)=> {return piece.type === "King"});

        return king.squareAddress
    }
    pruneOutBlockedMoves(pseudoLegalMoves, myOwn, pieceArray, oppPieceArray) {
        let oppOccupiedSquares = [];
        let ownOccupiedSquares = [];
        oppPieceArray.forEach((piece)=> {oppOccupiedSquares.push(piece.squareAddress)});
        pieceArray.forEach((piece) => {ownOccupiedSquares.push(piece.squareAddress)});
    
        let prunedPseudoLegalMoves = [];
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
      
            
            }
             
        
      
        return prunedPseudoLegalMoves
    }

    prunePawnMoves(moveList,oppMove = null, maximizing, pieceArray, oppPieceArray) {
        let prunedPawnMoves = [];
        for (let i of moveList) {
            if (i.piece !== "Pawn") {
                prunedPawnMoves.push(i);
                continue
            }
            //proper direction based on starting side
            if ((maximizing && i.squareAddressTo[0] - i.squareAddressFrom[0] > 0) || ( !maximizing && i.squareAddressTo[0] - i.squareAddressFrom[0] < 0)) {
                continue
            }
            // no knight moves
            if (Math.abs(i.squareAddressFrom[1] - i.squareAddressTo[1]) !== 0 && Math.abs(i.squareAddressFrom[0] - i.squareAddressTo[0]) === 2) {
                continue
            }
            //pawn captures
            if (oppPieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1] && Math.abs(i.squareAddressTo[1] - i.squareAddressFrom[1]) !== 0})) {
                
                prunedPawnMoves.push(i);
                continue
            }
            //unblocked pushes --here lies the mistake
            if (!pieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1] })) {
                if (!oppPieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1] })) {
                    if (Math.abs(i.squareAddressTo[1] - i.squareAddressFrom[1]) === 0 && Math.abs(i.squareAddressTo[0] - i.squareAddressFrom[0])===1) {
                        prunedPawnMoves.push(i);
                        continue
                    }
                    
                    
                }
            }
            if  (maximizing &&  (i.squareAddressFrom[0] !== 6 && Math.abs(i.squareAddressTo[0] - i.squareAddressFrom[0])> 1)) {
                continue
            }
            if (!maximizing && i.squareAddressFrom[0] !== 2 && Math.abs(i.squareAddressTo[0] - i.squareAddressFrom[0]) > 1) {
                continue}
            
            if (oppMove){
                if (oppMove.piece === "Pawn" && Math.abs(oppMove.squareAddressTo[0] - oppMove.squareAddressFrom) === 2 && pieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && Math.abs(piece.squareAddress[1] - i.squareAddressTo[1]) ===1})) {
                    prunedPawnMoves.push(i);
                }
            }
            
             //oppMove passed over a capture square of pieceArray, append the appropriate move to prunedPawnMoves
        }
        return prunedPawnMoves
    }

    minimax = (maximizing, depth, maxPieceArray, minPieceArray,white) => {
       //add check for checkmate
   // console.log("minimax() called at depth: ", depth);
    let new_depth = JSON.parse(JSON.stringify(depth -1));
        if (maximizing) {
            if (depth <= 0) {
          //      console.log("values in minimax before QS:", maxPieceArray, minPieceArray, !white);
      //    console.log("QS() called");
                return this.quiescenceSearch(Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY, maxPieceArray, minPieceArray, white)
                
            }
            let max = Number.NEGATIVE_INFINITY;
            for (let i of this.generateMoveList(white, maxPieceArray, minPieceArray)) {
                let score = undefined;
                let [newMaxPieceArray, newMinPieceArray] = this.makeMove(maxPieceArray,minPieceArray,i);
                if (this.checkForCheckmate(newMaxPieceArray, newMinPieceArray, white)) {
                    score = Number.POSITIVE_INFINITY
                } else {score = this.minimax(false, new_depth, newMaxPieceArray, newMinPieceArray, !white);}
                
                max = Math.max(score,max);
            }

            return max;
        } else {
            if (depth <= 0) {
              //  console.log("values in minimax before QS:", minPieceArray, maxPieceArray, !white);
              
                return -this.quiescenceSearch(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, minPieceArray , maxPieceArray, white)
            }
                let min = Number.POSITIVE_INFINITY;

                for (let i of this.generateMoveList(white, minPieceArray, maxPieceArray)){
                    let score = undefined;
                    let [newMinPieceArray, newMaxPieceArray] = this.makeMove(minPieceArray,maxPieceArray,i);
                    if (this.checkForCheckmate(newMinPieceArray, newMaxPieceArray, white)) {
                        score = Number.NEGATIVE_INFINITY;
                    } else {score = this.minimax(true, new_depth, newMaxPieceArray, newMinPieceArray, !white)}
                    
                    min = Math.min(score, min);

                }

            return min
        }
    }
    makeMove(pieceArray, oppPieceArray, move) {
        //take the move and adjust the piece Array appropriately
        let returnPieceArray= [...pieceArray];
        let returnOppPieceArray = [...oppPieceArray];
        if (oppPieceArray.find((piece)=>{return move.squareAddressTo[0] === piece.squareAddress[0] && move.squareAddressTo[1] === piece.squareAddress[1]})){
             returnOppPieceArray  = returnOppPieceArray.filter((piece)=> {return move.squareAddressTo[0] !== piece.squareAddress[0] || move.squareAddressTo[1] !== piece.squareAddress[1]})
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
      
      returnPieceArray = returnPieceArray.filter((piece)=> {
       // console.log(piece.squareAddress, move.squareAddressFrom);
        return piece.squareAddress[0] !== move.squareAddressFrom[0] || piece.squareAddress[1] !== move.squareAddressFrom[1]});
      newPiece.squareAddress = move.squareAddressTo;
      returnPieceArray.push(newPiece);
        return [returnPieceArray,returnOppPieceArray]
    }
    nodeIsQuiescent(sideToMovePieceArray, sideWithoutmovePieceArray, alpha, beta) {

    }

    evaluate(pieceArray, oppPieceArray) {
        let score = 0
   
        for (let i of pieceArray) {
            score += i.staticValue;
        }
        for (let i of oppPieceArray) {
            score -= i.staticValue
        }
    
        return score
    }
    //return this.quiescenceSearch(-10000, 10000, maxPieceArray, minPieceArray, true)
    quiescenceSearch(alpha, beta, pieceArray, oppPieceArray, white){
        const stand_pat = this.evaluate(pieceArray, oppPieceArray);
        if (stand_pat >= beta) {
            return beta
        }
        if (alpha < stand_pat) {
            alpha = stand_pat
        }
        for (let i of this.generateCaptureMovesList(this.generateMoveList(white, pieceArray, oppPieceArray),oppPieceArray)) {
          //  console.log("capture move in QS", i.squareAddressTo, i.squareAddressFrom);
            const [newPieceArray, newOppPieceArray] = this.makeMove(pieceArray, oppPieceArray, i);
            let score = undefined;
            if (this.checkForCheckmate(newPieceArray, newOppPieceArray, white)) {
                return Number.POSITIVE_INFINITY;
            } else {score = -this.quiescenceSearch(-beta, -alpha, newOppPieceArray, newPieceArray, !white); }
            
            if (score >= beta) {
                return beta
            }
            if (score > alpha) {
                alpha = score
            }
            
        }
      //  console.log("reached alpha", alpha);
        return alpha

    }
    

    generateCaptureMovesList(moveList, oppPieceArray) {
        let capturedMoveList = [];
        for (let i of moveList) {
            if (oppPieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1]})){
                capturedMoveList.push(i);
            }
        }
    //  console.log(capturedMoveList);
        return capturedMoveList
    }
    findBestMove(maximizing,tempPieceArray,tempOppPieceArray, lastMove = null, white) {
        //after about 20 moves findBestMove returns undefined because every move is defined as "leaving king in check"
            let best = Number.NEGATIVE_INFINITY;
            let bestMove = undefined;
            for (let i of this.generateMoveList(white, tempPieceArray,tempOppPieceArray, lastMove)) {
           //  console.log(tempPieceArray, tempPieceArray);
                let [newPieceArray, newOppPieceArray] = this.makeMove(tempPieceArray, tempOppPieceArray, i);
                let score = this.minimax(false, 0, newOppPieceArray, newPieceArray, white);
         //       console.log(score, i);
                if (best < score) {
                    bestMove = i;
                    best = score
                }
            }
            console.log(best, bestMove);
            return bestMove
        }

        checkForCheckmate(pieceArray, oppPieceArray, white){
            if (this.checkForCheck(pieceArray,oppPieceArray, white)) {
                if (this.generateMoveList(white, oppPieceArray, pieceArray).length === 0) {
                    return true
                }
            }
            return false
        }

        checkForCheck(pieceArray, oppPieceArray, white) {
            if (this.determineIfMovesLeavesKingInCheck(!white, oppPieceArray, pieceArray)) {
                return true
            } else {
                return false
            }
        }
}

export default Player
