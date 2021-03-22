import React from 'react';
import axios from 'axios';
import Game from './Game.js';

class App extends React.Component {
	state = {
		isLoading: true,
		games: []
	};

	async getGames() {
		const data = await axios.get('https://yts-proxy.nomadcoders1.now.sh/list_movies.json');
		const games = data.data.data.movies;
		console.log(games);
		this.setState({ games: games, isLoading: false });
	}

	componentDidMount() {
		this.getGames();
	}

	render() {
		const { isLoading, games } = this.state;

		return (
			<div>
				{isLoading ? "Loading..." : games.map(game => (
					<Game
						key={game.id}
						id={game.id}
						year={game.year}
						title={game.title}
						summary={game.summary}
						poster={game.medium_cover_image}
					/>
				))}
			</div>
		);
	}
}

export default App;
