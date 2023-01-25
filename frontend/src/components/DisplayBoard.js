import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Move, Player} from "../gameRules";
import {King, Queen, Rook, Bishop, Knight, Pawn} from "../gameRules/individualPieces"
const DisplayBoard = (props) => {
    const {physicalBoard, whitePieceArray, setWhitePieceArray, blackPieceArray, setBlackPieceArray, player1, player2} = props;
    const [selectedSquare, setSelectedSquare] = useState(null);


    const [whiteTrigger, setWhiteTrigger] = useState(true);
    useEffect(()=> {
        const timer = setTimeout(()=> {
           // console.log(whiteTrigger);
        if (!whiteTrigger){
            let [newBlackPieceArray, newWhitePieceArray] = player2.makeMove(blackPieceArray,whitePieceArray, player2.findBestMove(false,blackPieceArray, whitePieceArray, null,false));
            
        console.log("new white piece array: ", newWhitePieceArray);
        console.log("new black piece array: ", newBlackPieceArray);
                setWhitePieceArray(newWhitePieceArray);
                setBlackPieceArray(newBlackPieceArray);
                setWhiteTrigger(!whiteTrigger)}

        }, 3000)
        return () => clearTimeout(timer);
    }, [whiteTrigger])

    const handleSquareClick = (square) => {
        if (!selectedSquare) {
          // If no square is currently selected, select the square that was clicked
          setSelectedSquare(square);
        } else {
          // If a square is already selected, turn the click into a move
          console.log(selectedSquare);
          let piece_type = whitePieceArray.find((piece)=> {return JSON.stringify(piece.squareAddress) === JSON.stringify(selectedSquare)})
          const move = new Move(selectedSquare, square, piece_type, false, false, false, false, false, [])
          const [newPieceArray, newOppPieceArray] = player1.makeMove(whitePieceArray, blackPieceArray, move);
          setWhitePieceArray(newPieceArray);
          setBlackPieceArray(newOppPieceArray);
          setSelectedSquare(null);
          setWhiteTrigger(!whiteTrigger);
        }
      };
      
    return <div id = "game-board">{physicalBoard.map((file, fileIndex)=>{return <div className="file"> {file.map((square, squareIndex)=> {
        let squareColor = "light";
        if ((fileIndex + squareIndex) % 2 !== 0 ) {
            squareColor = "dark";
        }
        let whitePiece = whitePieceArray.find((piece)=> {return piece.squareAddress[1] === squareIndex && piece.squareAddress[0] === fileIndex});
        let blackPiece = blackPieceArray.find((piece)=> {return piece.squareAddress[1] === squareIndex && piece.squareAddress[0] === fileIndex});
        if (whitePiece) {
           // console.log(whitePiece);
          //  console.log("white piece exists is DisplayBoard");
            return <div className={`${whitePiece.type} white ${squareColor}`} onClick={() => handleSquareClick([fileIndex, squareIndex])}></div>
        } else if (blackPiece) {
            return <div className= {`${blackPiece.type} black ${squareColor}`} onClick={() => handleSquareClick([fileIndex, squareIndex])}></div>
        } else {return <div className= {`${squareColor}`} onClick={() => handleSquareClick([fileIndex, squareIndex])}></div>}
    })}</div>})  
    }</div>
}



export default DisplayBoard