import {King,Queen,Rook, Bishop, Knight, Pawn} from "./individualPieces/index.js"
import {default as Move} from"./moveDefinition.js";
import { Piece } from "./pieceDefinition.js";
//write a test suite for the minimax
// checkmate is being detected too frequently
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
        this.evaluationCache = {};
        this.MAX_DEPTH = 10;
    }
// generate Move List is broken
// pruneOutBlockedMoves is only returning 6 Pawn @[6,0] moves
    classifyMoves(moveArray, ownPieceArray, oppPieceArray, white) {
        const moveIsACapture = (move, oppPieceArray) => {
            if (oppPieceArray.find((piece)=> {return move.squareAddressTo[0] === piece.squareAddress[0] && move.squareAddressTo[1] === piece.squareAddress[1]})) {
                return true
            } else {
                return false
            }
        }
        const moveIsACheck = (move, pieceArray, oppPieceArray, white) => {
            let [newPieceArray, newOppPieceArray] = this.makeMove(pieceArray, oppPieceArray, move);
            if (this.checkForCheck(newPieceArray, newOppPieceArray, white)) {
            //    console.log("move detected as a check", move);
                return true
            } else {
                return false
            }
        }

        // check for capture-checks 
        // check for checks
        // check for captures
        // check for threats
        // look at all other moves
        //pseudo code :
        // take a list of each move type
        // meld those lists in the appropriate order
        let finalOrderedMoveList = [];
        let captureChecks = [];
        let checks = [];
        let captures = [];
        let threats = []; 
        //capture checks
        for (let i of moveArray) {
            if (moveIsACapture(i,oppPieceArray) && moveIsACheck(i,ownPieceArray,oppPieceArray,white)) {
                
                if (!finalOrderedMoveList.find((move)=> {return JSON.stringify(move.squareAddressTo) === JSON.stringify(i.squareAddressTo) && JSON.stringify(move.squareAddressFrom) === JSON.stringify(i.squareAddressFrom)})) {
                   // console.log("move detected as a capture-check", i);    
                    finalOrderedMoveList.push(i)
                }
            }
        }
        //checks
        for (let i of moveArray) {
            if (moveIsACheck(i, ownPieceArray, oppPieceArray, white)) {
              //  if (i.squareAddressTo[0] === 5 && i.squareAddressTo[1] === 5) {console.log(i);}
                
                if (!finalOrderedMoveList.find((move)=> {return JSON.stringify(move.squareAddressTo) === JSON.stringify(i.squareAddressTo) && JSON.stringify(move.squareAddressFrom) === JSON.stringify(i.squareAddressFrom)})) {
                    finalOrderedMoveList.push(i)
                }
            }
        }

        //captures
        for (let i of moveArray) {
            if (moveIsACapture(i,oppPieceArray)) {
                if (!finalOrderedMoveList.find((move)=> {return JSON.stringify(move.squareAddressTo) === JSON.stringify(i.squareAddressTo) && JSON.stringify(move.squareAddressFrom) === JSON.stringify(i.squareAddressFrom)})) {
                    finalOrderedMoveList.push(i)
                }
            }
        }

        //threats
        for (let i of moveArray) {
            //unimplemented
        }

        //allOthers

        for (let i of moveArray) {
            if (!finalOrderedMoveList.find((move)=> {return JSON.stringify(move.squareAddressTo) === JSON.stringify(i.squareAddressTo) && JSON.stringify(move.squareAddressFrom) === JSON.stringify(i.squareAddressFrom)})) {
                finalOrderedMoveList.push(i)
            }
        }
        return finalOrderedMoveList
    }
    //[x] list out all legal moves => []determine move type / calculation order =>[] feed into thought process (decide on a move)=> make a move 

    generateMoveList(white, pieceArray, oppPieceArray, lastMove) {
        //generateMoveList isn't working for some reason
        
        let moveArray = [];
        let allPseudoLegalMoves1 = this.generatePseudoLegalMoveList(white, pieceArray);
       
        
        let allPseudoLegalMoves = this.prunePawnMoves(allPseudoLegalMoves1,lastMove, white, pieceArray, oppPieceArray);
       
        
        let ownPseudoLegalMoves = this.pruneOutBlockedMoves(allPseudoLegalMoves, white, pieceArray, oppPieceArray)
       
        for (let i of ownPseudoLegalMoves) {
            let capturedPiece = oppPieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1]});
                if (capturedPiece) {
                    if (capturedPiece.type === "King") {
                        continue
                    }
                }
       const [newPieceArray, newOppPieceArray] = this.makeMove(pieceArray, oppPieceArray, i)
            if (this.determineIfMovesLeavesKingInCheck(white, newPieceArray, newOppPieceArray)) {
                continue
            } else {       
                moveArray.push(i)
            }
        }

        for (let i of moveArray) {
            if ((i.squareAddressTo[0] === 0 || i.squareAddressTo[0] === 7) && i.type === "Pawn") {
                i.type = "Queen"
            }
        }

        return moveArray
    }
    generatePseudoLegalMoveList(bool, pieceArray) {
        let iterator = pieceArray;
        
        
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
    // this checks if pieceArray has been left in check by oppPieceArray 
    //white is the color of pieceArray
// if (this.determineIfMovesLeavesKingInCheck(white, newPieceArray, newOppPieceArray))

    determineIfMovesLeavesKingInCheck(white, pieceArray, oppPieceArray) {
        let attackMap = this.generateAttackMap(!white, oppPieceArray, pieceArray);
        const value = this.getKingPosition(pieceArray)
        if (attackMap.find((squareAddress)=> {return squareAddress[0] === value[0] && squareAddress[1] === value[1]})) {
      
            return true
        } else {return false}
    }

    ///////////////////////////////////////////
    generateAttackMap(white, pieceArray, oppPieceArray) {
        const allPseudoLegalMoves = this.generatePseudoLegalMoveList(white, pieceArray);
        const pruneOutBlockMoves = this.pruneOutBlockedMoves(allPseudoLegalMoves, true, pieceArray, oppPieceArray);
        const prunedPawnMoves = this.prunePawnMoves(pruneOutBlockMoves, null, white, pieceArray, oppPieceArray);
        let squareArray = []
        for (let i of prunedPawnMoves) {
            let square = i.squareAddressTo;
            squareArray.push(square)
        }

        return squareArray
    }
    getKingPosition(pieceArray) {
    
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
            
            if  (maximizing  && (i.squareAddressFrom[0] === 6 && Math.abs(i.squareAddressTo[0] - i.squareAddressFrom[0])> 1) && !pieceArray.find((piece) => { return JSON.stringify(piece.squareAddress) === JSON.stringify(i.squareAddressTo)})) {prunedPawnMoves.push(i)} 
            if  (maximizing  && (i.squareAddressFrom[0] === 1 && Math.abs(i.squareAddressTo[0] - i.squareAddressFrom[0])> 1) && !pieceArray.find((piece) => { return JSON.stringify(piece.squareAddress) === JSON.stringify(i.squareAddressTo)})) {prunedPawnMoves.push(i)} 
            
            if (oppMove){
                if (oppMove.piece === "Pawn" && Math.abs(oppMove.squareAddressTo[0] - oppMove.squareAddressFrom) === 2 && pieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && Math.abs(piece.squareAddress[1] - i.squareAddressTo[1]) ===1})) {
                    prunedPawnMoves.push(i);
                }
            }
            
             
            
        }
        return prunedPawnMoves
    }

    minimax = (maximizing, depth, maxPieceArray, minPieceArray,white) => {
       //add check for checkmate
       let key = JSON.stringify(maxPieceArray) + JSON.stringify(minPieceArray);
       if (this.evaluationCache[key]) {
        return this.evaluationCache[key]
       }
        if (maximizing) {
            if (depth <= 0) {
               // this.evaluationCache = {};
                return this.quiescenceSearch(Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY, maxPieceArray, minPieceArray, white)
            }
            let max = Number.NEGATIVE_INFINITY;
            let unorderedmoveList = this.generateMoveList(white, maxPieceArray, minPieceArray)
            for (let i of this.classifyMoves(unorderedmoveList, maxPieceArray,minPieceArray, white)) {
                let score = undefined;
                let [newMaxPieceArray, newMinPieceArray] = this.makeMove(maxPieceArray,minPieceArray,i);
                if (this.checkForCheckmate(newMaxPieceArray, newMinPieceArray, !white)) {
                    score = Number.POSITIVE_INFINITY
                } else {
                    this.evaluationCache = {};
                    score = this.minimax(false,depth-1, newMaxPieceArray, newMinPieceArray, !white);}
                    this.cacheBoard(newMaxPieceArray,newMinPieceArray, score);
                max = Math.max(score,max);
            }

            return max;
        } else {
            if (depth <= 0) {

          //    console.log(minPieceArray,maxPieceArray,white);
                return -this.quiescenceSearch(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, minPieceArray , maxPieceArray, white)
            }
                let min = Number.POSITIVE_INFINITY;
                let unorderedMoveList = this.generateMoveList(white, minPieceArray, maxPieceArray)
                for (let i of this.classifyMoves(unorderedMoveList, minPieceArray, maxPieceArray, white)){
                    let score = undefined;
                    let [newMinPieceArray, newMaxPieceArray] = this.makeMove(minPieceArray,maxPieceArray,i);
                    if (this.checkForCheckmate(newMinPieceArray, newMaxPieceArray, !white)) {
                        score = Number.NEGATIVE_INFINITY;
                    } else {
                    //    this.evaluationCache = {};
                    score = this.minimax(true, depth-1, newMaxPieceArray, newMinPieceArray, !white)}
                    this.cacheBoard(newMaxPieceArray,newMinPieceArray, score);
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
      
        return piece.squareAddress[0] !== move.squareAddressFrom[0] || piece.squareAddress[1] !== move.squareAddressFrom[1]});
      newPiece.squareAddress = move.squareAddressTo;
      returnPieceArray.push(newPiece);
      if (move.piece === "Pawn" && (move.squareAddressTo[0] === 0 || move.squareAddressTo[0] === 7)) {
        returnPieceArray = returnPieceArray.filter((piece)=> {return JSON.stringify(piece.squareAddress) !== JSON.stringify(move.squareAddressTo)})
        returnPieceArray.push(new Queen("Queen", 9,9, move.squareAddressTo))
      }
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
    // add threat detection at the end of Qsearch => if threat outweighs alpha 
   







     /*  quiescenceSearchHelper(alpha, beta, pieceArray, oppPieceArray, white, depth) {
      //  console.log(alpha,beta, depth);
        if (depth === 0) {
            return this.evaluate(pieceArray, oppPieceArray);
        }
        let stand_pat = this.evaluate(pieceArray, oppPieceArray);
        if (stand_pat >= beta) {
            return beta;
        }
        if (stand_pat > alpha) {
            alpha = stand_pat;
        }
        let unorderedMoveList = this.generateMoveList(white, pieceArray, oppPieceArray);
        for (let i of unorderedMoveList) {
            let [newPieceArray, newOppPieceArray] = this.makeMove(pieceArray, oppPieceArray, i);
            if (this.checkForCheckmate(newPieceArray, newOppPieceArray, white)) {
                return Number.POSITIVE_INFINITY
            }
            let score = -this.quiescenceSearchHelper(-beta, -alpha, newOppPieceArray, newPieceArray, !white, depth - 1);
            if (score >= beta) {
                return beta;
            }
            if (score > alpha) {
                alpha = score;
            }
        }
        return alpha;
    } */
    

    generateCaptureMovesList(moveList, oppPieceArray) {
        let capturedMoveList = [];
        for (let i of moveList) {
            if (oppPieceArray.find((piece)=> {return piece.squareAddress[0] === i.squareAddressTo[0] && piece.squareAddress[1] === i.squareAddressTo[1]})){
                capturedMoveList.push(i);
            }
        }
        return capturedMoveList
    }



    listForcingMoves(moveList,pieceArray, oppPieceArray, white, alpha,beta) {
      const moveIsACapture = (move, oppPieceArray) => {
        if (oppPieceArray.find((piece)=> {return move.squareAddressTo[0] === piece.squareAddress[0] && move.squareAddressTo[1] === piece.squareAddress[1]})) {
            return true
        } else {
            return false
        }
    }
    const moveIsACheck = (move, pieceArray, oppPieceArray, white) => {
        let [newPieceArray, newOppPieceArray] = this.makeMove(pieceArray, oppPieceArray, move);
        if (this.checkForCheck(newPieceArray, newOppPieceArray, white)) {
        //    console.log("move detected as a check", move);
            return true
        } else {
            return false
        }
    }
    const moveIsPromotion = (move, pieceArray, white) => {
        if (move.piece === "Queen" && move.squareAddressTo[0] === 0 && white) {
            return true
        }
        if (move.piece === "Queen" && move.squareAddressTo[7] === 0 && !white) {
            return true
        }
        return false
    }

        //check for all threats whose value exceeds alpha => this includes ALL threats to give check
        const threatValue = (move, pieceArray, oppPieceArray, white, beta) => {
            let [newPieceArray, newOppPieceArray] = this.makeMove(pieceArray, oppPieceArray,move);

            let attackMap = this.generateAttackMap(white, newPieceArray, newOppPieceArray, white);

            let max = beta;

            for (let i of attackMap) {
                let piece = newOppPieceArray.find((piece)=> {return piece.squareAddress[0] === i[0] && piece.squareAddress[1] === i[1]});
                if (piece) {
                    if (piece.value > max){
                    max = piece.value
                }
            }
        }
        
        let newMoves = this.generateMoveList(white, newPieceArray, newOppPieceArray)
        for (let i of newMoves) {
            let [threatPieceArray, threatOppPieceArray] = this.makeMove(newPieceArray, newOppPieceArray, i);
            let newAttackMap = this.generateAttackMap(white, threatPieceArray,threatOppPieceArray)
            for (let j of newAttackMap) {
            let piece = threatOppPieceArray.find((piece)=> {return piece.squareAddress[0] === j[0] && piece.squareAddress[1] === j[1]});
                if (piece) {
                    if (piece.value > max){
                    max = piece.value;
                }
            }
        }
    }
    return max
        
}

    let finalMoveList = [];
    for (let i of moveList) {
                if (this.checkForCheck(oppPieceArray, pieceArray, !white)) {
                    finalMoveList.push(i)
                }
            }
        


        for (let i of moveList) {
            if (moveIsACapture(i,oppPieceArray) || moveIsACheck(i, pieceArray, oppPieceArray, white) || moveIsPromotion(pieceArray, white)) {
             //   console.log("move being listed as a capture or check in listForcingmoves:", i);
                finalMoveList.push(i);
                continue
            }
            if (threatValue(i, pieceArray, oppPieceArray, white, alpha) >= beta) {
                //console.log("threat value >= alpha")
                finalMoveList.push(i);
            }

        }
        return finalMoveList
    }


    findBestMove(maximizing,tempPieceArray,tempOppPieceArray, lastMove = null, white) {
        let best = Number.NEGATIVE_INFINITY;
        let bestMove = undefined;
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;
        let unorderedMoveList = this.generateMoveList(white, tempPieceArray,tempOppPieceArray, lastMove)
        for (let i of unorderedMoveList) {
            let [newPieceArray, newOppPieceArray] = this.makeMove(tempPieceArray, tempOppPieceArray, i);
            if (this.checkForCheckmate(newPieceArray, newOppPieceArray, white)) {
                bestMove = i;
                console.alert("checkmate detected!: ", bestMove);
                return bestMove
            }
            this.evaluationCache = {};
            let score = -this.search(alpha, beta, newOppPieceArray ,newPieceArray, !white, 0)
            if (score > alpha) {
                alpha = score;
            }
            if (best < score) {
                bestMove = i;
                best = score
            }
        }
        console.log(best, bestMove);
        return bestMove
    }
    

        //checks if pieceArray has checkmated oppPieceArray
        //white refers to the color of pieceArray
        checkForCheckmate(pieceArray, oppPieceArray, white){
            if (this.checkForCheck(pieceArray,oppPieceArray, white)) {
                if (this.generateMoveList(!white, oppPieceArray, pieceArray).length === 0) {
                    return true
                }
            }
            return false
        }
        //checks if pieceArray leaves oppPieceArray in check
        checkForCheck(pieceArray, oppPieceArray, white) {
            if (this.determineIfMovesLeavesKingInCheck(!white, oppPieceArray, pieceArray)) {
                return true
            } else {
                return false
            }
        }

        cacheBoard(pieceArray, oppPieceArray, evaluationValue) {
            let maxPieceArray = [...pieceArray];
            let minPieceArray = [...oppPieceArray];

            let key = JSON.stringify(maxPieceArray) + JSON.stringify(minPieceArray);
            this.evaluationCache[key] = evaluationValue
        }

        
        //CHAT GPT TEST
        
        
        alphaBetaSearch(alpha, beta, pieceArray, oppPieceArray, white, depth) {
            if (depth === 0) {
                // Return an evaluation of the position when the depth limit is reached
                return this.quiescenceSearch(alpha, beta, pieceArray, oppPieceArray, white, depth);
            } 
            
            const stand_pat = this.evaluate(pieceArray, oppPieceArray);
            if (stand_pat >= beta) {
                return beta;
            }
            if (alpha < stand_pat) {
                alpha = stand_pat;
            }
            
            const unorderedMoveList = this.generateMoveList(white, pieceArray, oppPieceArray);
            
            for (let i of unorderedMoveList) {
                const [newPieceArray, newOppPieceArray] = this.makeMove(pieceArray, oppPieceArray, i);
                let score = undefined;
                
                if (this.checkForCheckmate(newPieceArray, newOppPieceArray, !white)) {
                    return Number.POSITIVE_INFINITY;
                } else {
                    score = -this.alphaBetaSearch(-beta, -alpha, newOppPieceArray, newPieceArray, !white, depth - 1);
                    this.cacheBoard(newPieceArray, newOppPieceArray, score);
                }
                
                if (score >= beta) {
                    return beta;
                }
                if (score > alpha) {
                    alpha = score;
                }
            }
            
            return alpha;
        }
        
        quiescenceSearch(alpha, beta, pieceArray, oppPieceArray, white, depth) {
            const stand_pat = this.evaluate(pieceArray, oppPieceArray);
            if (stand_pat >= beta) {
                return beta;
            }
            if (alpha < stand_pat) {
                alpha = stand_pat;
            }
            let all_moves = this.generateMoveList(white, pieceArray, oppPieceArray)
            
            
            const unorderedMoveList = this.listForcingMoves(
                all_moves,
                pieceArray,
                oppPieceArray,
                white,
                alpha,
                beta
                );
                
                for (let i of this.classifyMoves(unorderedMoveList, pieceArray, oppPieceArray, white)) {
                    
                    const [newPieceArray, newOppPieceArray] = this.makeMove(pieceArray, oppPieceArray, i);
                    let score = undefined;
                    
                    if (this.checkForCheckmate(newPieceArray, newOppPieceArray, !white)) {
                        return Number.POSITIVE_INFINITY;
                    } else {
                        score = -this.quiescenceSearch(-beta, -alpha, newOppPieceArray, newPieceArray, !white, depth - 1);
                        this.cacheBoard(newPieceArray, newOppPieceArray, score);
                    }
                    
                    if (score >= beta) {
                        return beta;
                    }
                    if (score > alpha) {
                        alpha = score;
                    }
                }
                
                return alpha;
            }
            
            // Entry point for the search with a specified depth limit
            search(alpha, beta, pieceArray, oppPieceArray, white, depth) {
                if (depth <= 0) {
                    // Use quiescence search at the specified depth
                    return this.quiescenceSearch(alpha, beta, pieceArray, oppPieceArray, white, depth);
                } else {
                    // Use alpha-beta search at higher depths
                    return this.alphaBetaSearch(alpha, beta, pieceArray, oppPieceArray, white, depth);
                }
            }
            
            
        }
            
            export default Player
            