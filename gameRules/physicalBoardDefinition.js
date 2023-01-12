let physicalBoard = [];

for (let i = 0; i <8; i++) {
    let row = [];
    for (let j = 0; j < 8; j++) {
        row.push([]);
    }
    physicalBoard.push(row);
}

export default physicalBoard