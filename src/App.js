import React from 'react';
import Nav from './components/Nav';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from "./routes/Home";
import MyPage from "./routes/MyPage";
import PlayGame from "./routes/PlayGame";

function App(params) {
	return (
		<BrowserRouter>
			<Nav />
			<Route path="/" exact={true} component={Home} />
			<Route path="/user" component={MyPage} />
			<Route path="/play-game" component={PlayGame} />
		</BrowserRouter>
	);
}

export default App;
