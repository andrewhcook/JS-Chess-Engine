import {useState, useEffect } from "react";

const AnalysisBoard = (props) => {
    const {whitePieceArray, setWhitePieceArray, blackPieceArray, setBlackPieceArray, player1, player2} = props;
 //   console.log(whitePieceArray.length)
    const [whiteTrigger, setWhiteTrigger] = useState(true);
    useEffect(()=> {
        const timer = setTimeout(()=> {
           // console.log(whiteTrigger);
        if (whiteTrigger) {
        console.log(whiteTrigger);
        let move =player1.findBestMove(true, whitePieceArray, blackPieceArray)
        console.log(move);
        console.log(blackPieceArray);
        console.log(player1.generateMoveList(true, whitePieceArray, blackPieceArray, null).length)
        let [newWhitePieceArray, newBlackPieceArray] = player1.makeMove(whitePieceArray, blackPieceArray, move);
        
        console.log("new white piece array:", newWhitePieceArray);
        setWhitePieceArray(newWhitePieceArray);
        setBlackPieceArray(newBlackPieceArray);
        setWhiteTrigger(!whiteTrigger);} else {
            let [newBlackPieceArray, newWhitePieceArray] = player2.makeMove(blackPieceArray,whitePieceArray, player2.findBestMove(false,blackPieceArray, whitePieceArray))
                setWhitePieceArray(newWhitePieceArray);
                setBlackPieceArray(newBlackPieceArray);
                setWhiteTrigger(!whiteTrigger)}

        }, 3000)
        return () => clearTimeout(timer);
    }, [whiteTrigger])
    return <><div></div></>
}

export default AnalysisBoard