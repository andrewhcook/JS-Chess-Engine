import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { DisplayBoard, AnalysisBoard, TestPosition } from './components';
import {Player} from "./gameRules";

import {King, Queen, Rook, Bishop, Knight, Pawn} from "./gameRules/individualPieces"

const App = () => {

  let player1 = new Player('compoopter', true, 10, [], [])
  let player2 = new Player('hooman', false, 10, [], [])
  
  
  
  let king1 = new King('King', 10000, 10000, [7,4]);
  let king2 = new King('King', 10000, 10000, [0,4]);
  
  let queen1 = new Queen('Queen', 9, 9, [7,3]);
  let queen2 = new Queen('Queen', 9, 9, [0,3]);
  
  let rook1 = new Rook('Rook', 5, 5, [7,0]);
  let otherRook1 = new Rook('Rook', 5, 5, [7,7]);
  
  
  let rook2 = new Rook('Rook', 5, 5, [0,0]);
  let otherRook2 = new Rook('Rook', 5, 5, [0,7]);
  
  let bishop1 = new Bishop('Bishop', 3, 3, [7,2]);
  let otherBishop1 = new Bishop('Bishop', 3,3, [7,5]);
  
  
  let bishop2 = new Bishop('Bishop', 3, 3, [0,2]);
  let otherBishop2 = new Bishop('Bishop', 3,3, [0,5]);
  
  let knight1 = new Knight('Knight', 3,3, [7,1])
  let otherKnight1 = new Knight('Knight', 3,3, [7,6])
  
  let knight2 = new Knight('Knight', 3,3, [0,1])
  let otherKnight2 = new Knight('Knight', 3,3, [0,6])
  
  for (let i = 0; i <= 7; i++) {
      let whitePiece = new Pawn("Pawn", 1,1, [6,i]);
      let blackPiece = new Pawn("Pawn", 1,1, [1,i]);
      player1.pieceArray.push(whitePiece)
      player2.pieceArray.push(blackPiece);
  }
  
  let backRankPieceArray1 = [king1, queen1, rook1, otherRook1, bishop1, otherBishop1, knight1, otherKnight1];
  
  let backRankPieceArray2 = [king2, queen2, rook2, otherRook2, bishop2, otherBishop2, knight2, otherKnight2];
  
  
  
  for (let i of backRankPieceArray1) {
      player1.pieceArray.push(i);
  }
  for (let i of backRankPieceArray2) {
      player2.pieceArray.push(i)
  }
  player1.oppPieceArray = player2.pieceArray;
  player1.tempOppPieceArray = player1.oppPieceArray;
  player2.oppPieceArray = player1.pieceArray;
  let intermediateBoard = [];
  
  for (let i = 0; i < 8; i++) {
      let row = [];
      for (let j = 0; j < 8; j++) {
          row.push([]);
      }
      intermediateBoard.push(row);
  }

  const [board,setBoard]  = useState(intermediateBoard);
  
 
  
  const [whitePieceArray,setWhitePieceArray] = useState(player1.pieceArray);
  const [blackPieceArray,setBlackPieceArray] = useState(player2.pieceArray);

  return <div>
    <DisplayBoard physicalBoard = {board} whitePieceArray = {whitePieceArray} setWhitePieceArray = {setWhitePieceArray} blackPieceArray = {blackPieceArray} setBlackPieceArray = {setBlackPieceArray} player1 = {player1} player2 = {player2}> </DisplayBoard>
    {/* <AnalysisBoard whitePieceArray = {whitePieceArray} setWhitePieceArray = {setWhitePieceArray} blackPieceArray = {blackPieceArray} setBlackPieceArray = {setBlackPieceArray} player1 = {player1} player2 = {player2}></AnalysisBoard> */}
   {/*  {<TestPosition></TestPosition>} */}
  </div>
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);