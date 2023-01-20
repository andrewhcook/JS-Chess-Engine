import {useState, useEffect } from "react";

const AnalysisBoard = (props) => {
    const {whitePieceArray, setWhitePieceArray, blackPieceArray, setBlackPieceArray, player1, player2} = props;
 //   console.log(whitePieceArray.length)
    const [whiteTrigger, setWhiteTrigger] = useState(true);
    useEffect(()=> {
        const timer = setTimeout(()=> {
           // console.log(whiteTrigger);
        if (whiteTrigger) {
        let move =player1.findBestMove(true, whitePieceArray, blackPieceArray, null, true)
        let [newWhitePieceArray, newBlackPieceArray] = player1.makeMove(whitePieceArray, blackPieceArray, move);
        
        console.log("new white piece array: ", newWhitePieceArray);
        console.log("new black piece array: ", newBlackPieceArray);
        setBlackPieceArray(newBlackPieceArray);
        setWhitePieceArray(newWhitePieceArray);
        setWhiteTrigger(!whiteTrigger);} else {
            let [newBlackPieceArray, newWhitePieceArray] = player2.makeMove(blackPieceArray,whitePieceArray, player2.findBestMove(false,blackPieceArray, whitePieceArray, null,false));
            
        console.log("new white piece array: ", newWhitePieceArray);
        console.log("new black piece array: ", newBlackPieceArray);
                setWhitePieceArray(newWhitePieceArray);
                setBlackPieceArray(newBlackPieceArray);
                setWhiteTrigger(!whiteTrigger)}

        }, 3000)
        return () => clearTimeout(timer);
    }, [whiteTrigger])
    return <><div></div></>
}

export default AnalysisBoard