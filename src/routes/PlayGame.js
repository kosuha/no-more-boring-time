import React from 'react';
import "./PlayGame.css";
import Canvas from '../components/Canvas.js';

class PlayGame extends React.Component {
    componentDidMount() {
        const { location, history } = this.props;
        if (location.state === undefined) {
            history.push("/");
        }
    }

    render() {
        const { state } = this.props.location;
        if (state) {
            console.log(state);
            return (
                <div className="playGame">
                    <h3 className="playGame__title">{state.title}</h3>
                    <Canvas
                        key={state.id}
                        id={state.id}
                        title={state.title}
                    />
                </div>
            );
        } else {
            return null;
        }

    }
}

export default PlayGame;