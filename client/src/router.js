import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import App from './App'

const MainPage = () => (
	<Router>
		<div>
			<Route exact path="/" component={App} />
		</div>
	</Router>
)

export default MainPage
