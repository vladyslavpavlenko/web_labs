import React from "react";
import "./style.css";

class Board extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <canvas id="board" className="board"></canvas>
        )
    }
}

export default Board;