import React from 'react';
import "./Canvas.css";

import * as random_block_puzzle from "../games/1/random-block-puzzle.js";

class Canvas extends React.Component {
    componentDidMount() {
        random_block_puzzle.init();
    }

    render() {
        const { id, title } = this.props;
        return (
            <canvas id={id} className="canvas" width="1000" height="1000">{title}</canvas>
        );
    }
}

export default Canvas;