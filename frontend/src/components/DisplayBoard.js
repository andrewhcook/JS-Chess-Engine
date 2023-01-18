import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Player} from "../gameRules";
import {King, Queen, Rook, Bishop, Knight, Pawn} from "../gameRules/individualPieces"

const DisplayBoard = (props) => {
    const {physicalBoard, whitePieceArray, setWhitePieceArray, blackPieceArray, setBlackPieceArray, player1, player2} = props;
    
    return <div id = "game-board">{physicalBoard.map((file, fileIndex)=>{return <div className="file"> {file.map((square, squareIndex)=> {
        let squareColor = "light";
        if ((fileIndex + squareIndex) % 2 !== 0 ) {
            squareColor = "dark";
        }
        let whitePiece = whitePieceArray.find((piece)=> {return piece.squareAddress[1] === squareIndex && piece.squareAddress[0] === fileIndex});
        let blackPiece = blackPieceArray.find((piece)=> {return piece.squareAddress[1] === squareIndex && piece.squareAddress[0] === fileIndex});
        if (whitePiece) {
          //  console.log("white piece exists is DisplayBoard");
            return <div className={`${whitePiece.type} white ${squareColor}`}  > </div>
        } else if (blackPiece) {
            return <div className= {`${blackPiece.type} black ${squareColor}`}></div>
        } else {return <div className= {`${squareColor}`}></div>}
    })}</div>})  
    }</div>

}

export default DisplayBoard