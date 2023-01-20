import { Piece } from "../gameRules/pieceDefinition";

import { King,Queen, Rook,Bishop, Knight,Pawn } from "../gameRules/individualPieces";

import {default as Player} from "../gameRules/playerDefinition"
import { useEffect } from "react";





const TestPosition = (props) => {
    const FENSTRING = ["r1b2rk1/ppb2ppp/3q4/2N5/1BPnP3/P2Q1N1P/1P2BPP1/R4RK1 b - - 4 17", "8/5Q2/5p1k/6p1/1p1q2P1/5PKP/8/8 b - - 1 1"]
    const FENSTRINGBLACK = ["r3kr2/6p1/7p/1p1Q4/5P2/1qP3PP/8/q2R2K1 w - - 6 48"]
    const FENtoPieceArray = (FEN,white) => {
        let fenArray = FEN.split(" ");
        let pieceArray = []
        let currentSquare = [0,0];
        console.log(fenArray);
        for (let i of fenArray[0]) {
            if (i === "/") {
                currentSquare[0]++;
                currentSquare[1] = 0;
                continue
            }
            if (!isNaN(parseInt(i))) {
                currentSquare[1] += parseInt(i);
                continue
            }
            if (white) {
                let piece = createPieceFromFENWhite(i,JSON.parse(JSON.stringify(currentSquare)));
                if (piece) {
                    pieceArray.push(piece);
                }
                
            } else {
                let piece = createPieceFromFENBlack(i,JSON.parse(JSON.stringify(currentSquare)));
                if (piece) {pieceArray.push(piece);}
                
            }
            
            
            currentSquare[1]++;
        }
        return pieceArray;
    }
    
    const createPieceFromFENBlack = (FENChar, square) => {
        switch(FENChar) {
            case 'p':
                return new Pawn("Pawn", 1, 1, square);
            case 'n':
                return new Knight("Knight", 3, 3, square);
            case 'b':
                return new Bishop("Bishop", 3, 3, square);
            case 'r':
                return new Rook("Rook", 5, 5, square);
            case 'q':
                return new Queen("Queen", 9, 9, square);
            case 'k':
                return new King("King", 10000, 10000, square);
            
        }
    }






    const createPieceFromFENWhite = (FENChar, square) => {
        switch(FENChar) {
            
            case 'P':
                return new Pawn("Pawn", 1, 1, square);
            
            case 'N':
                return new Knight("Knight", 3, 3, square);
            
            case 'B':
                return new Bishop("Bishop", 3, 3, square);
            
            case 'R':
                return new Rook("Rook", 5, 5, square);
            
            case 'Q':
                return new Queen("Queen", 9, 9, square);
            
            case 'K':
                return new King("King", 10000, 10000, square);
        }
    }

    
  let player1 = new Player('compoopter', true, 10, [], [])
  let player2 = new Player('hooman', false, 10, [], [])
  
  useEffect(()=> {for (let i of FENSTRING) {
    let player1PieceArray = FENtoPieceArray(i, true);
    let player2PieceArray = FENtoPieceArray(i, false);
    console.log(player1PieceArray);
    console.log(player1.findBestMove(true, player2PieceArray, player1PieceArray, null, false));

} for (let i of FENSTRINGBLACK) {
    let whitePieceArray = FENtoPieceArray(i,true);
    let blackPieceArray = FENtoPieceArray(i,false);
    console.log(player1.findBestMove(true, whitePieceArray,blackPieceArray, null, true))
}}, [])

    
    return 

}

export default TestPosition;