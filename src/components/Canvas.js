import React from 'react';
import "./Canvas.css";

import * as poker from "../games/2/poker.js";

class Canvas extends React.Component {
    componentDidMount() {
        poker.init();
    }

    render() {
        const { id, title } = this.props;
        return (
            <canvas id={id} className="canvas" width="1000" height="1000">{title}</canvas>
        );
    }
}

export default Canvas;