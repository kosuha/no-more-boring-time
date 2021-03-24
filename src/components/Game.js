import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import "./Game.css";

function Game({ id, year, title, summary, poster, genres }) {
    return (
        <div className="game">
            <Link to={{
                pathname: `/play/${id}`,
                state: {
                    year,
                    title,
                    summary,
                    poster,
                    genres
                }
            }}>
                <img src={poster} alt={title} title={title} />
                <div className="game__data">
                    <h3 className="game__title">{title}</h3>
                    <h5 className="game__year">{year}</h5>
                    <ul className="game__genres">
                        {genres.map((genre, index) => (
                            <li key={index} className="genres__genre">{genre}</li>
                        ))}
                    </ul>
                    <p className="game__summary">{summary.slice(0, 180)}...</p>
                </div>
            </Link>
        </div>
    );
}

Game.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    poster: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default Game;