import React from 'react';
import PropTypes from 'prop-types';

function Game(props) {
    return (
        <div>{props.title}</div>
    );
}

Game.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    poster: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired
}

export default Game;