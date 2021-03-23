import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import "./Game.css";

function Game({ year, title, summary, poster, genres }) {
    return (
        <Link to={{
            pathname:"/play-game",
            state: {
                year,
                title,
                summary,
                poster,
                genres
            }
        }}>
            <div>
                <img src={poster} alt={title} title={title} />
                <div className="game__data">
                    <h3 className="game__title">{title}</h3>
                    <h5 className="game__year">{year}</h5>
                    <ul className="game__genres">
                        {genres.map((genre, index) => (
                            <li key={index} className="game__genres__genre">{genre}</li>
                        ))}
                    </ul>
                    <p className="game__summary">{summary}</p>
                </div>
            </div>
        </Link>
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