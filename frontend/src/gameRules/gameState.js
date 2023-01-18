import {King, Queen, Rook, Bishop, Knight, Pawn}  from "./individualPieces/index.js";
import {default as Player} from "./playerDefinition.js";


let player1 = new Player('compoopter', true, 10, [], [])
let player2 = new Player('hooman', false, 10, [], [])


let pieceArray = [King, Queen, Rook, Bishop, Knight, Pawn];


let king1 = new King('King', player1, 10000, 10000, [7,4]);
let king2 = new King('King', player2, 10000, 10000, [0,4]);

let queen1 = new Queen('Queen', player1, 9, 9, [7,3]);
let queen2 = new Queen('Queen', player2, 9, 9, [0,3]);

let rook1 = new Rook('Rook', player1, 5, 5, [7,0]);
let otherRook1 = new Rook('Rook', player1, 5, 5, [7,7]);


let rook2 = new Rook('Rook', player2, 5, 5, [0,0]);
let otherRook2 = new Rook('Rook', player2, 5, 5, [0,7]);

let bishop1 = new Bishop('Bishop', player1, 3, 3, [7,2]);
let otherBishop1 = new Bishop('Bishop', player1, 3,3, [7,5]);


let bishop2 = new Bishop('Bishop', player2, 3, 3, [0,2]);
let otherBishop2 = new Bishop('Bishop', player2, 3,3, [0,5]);

let knight1 = new Knight('Knight', player1, 3,3, [7,1])
let otherKnight1 = new Knight('Knight', player1, 3,3, [7,6])

let knight2 = new Knight('Knight', player2, 3,3, [0,1])
let otherKnight2 = new Knight('Knight', player2, 3,3, [0,6])

for (let i = 0; i <= 7; i++) {
    let whitePiece = new Pawn("Pawn", player1, 1,1, [6,i]);
    let blackPiece = new Pawn("Pawn", player2, 1,1, [1,i]);
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


console.log('player1 moveList', player1.generateMoveList(true,player1.pieceArray, player2.pieceArray).length);
console.log(player2.generateMoveList(false, player2.pieceArray, player1.pieceArray))
//console.log(player1.minimax(true, 2, player1.pieceArray, player1.oppPieceArray))
console.log(player1.findBestMove(true,player1.pieceArray, player1.oppPieceArray))

