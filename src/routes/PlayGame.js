import React from 'react';

class PlayGame extends React.Component {
    componentDidMount() {
        const { location, history } = this.props;
        if (location.state === undefined) {
            history.push("/");
        }
    }

    render() {
        const { state } = this.props.location;

        return (
            <span>{state.title}</span>
        );
    }
}

export default PlayGame;