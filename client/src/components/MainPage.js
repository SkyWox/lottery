import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import App from './App'
import InputWatch from './InputWatch'
import { Button, ButtonGroup } from 'react-bootstrap'

const MainPage = () => (
	<Router>
		<div>
			<ButtonGroup justified={true}>
				<Link to="/">
					<Button>Number Generator</Button>
				</Link>
				<Link to="/watch">
					<Button>My Watch List</Button>
				</Link>
			</ButtonGroup>

			<Route exact path="/" component={App} />
			<Route path="/watch" component={InputWatch} />
		</div>
	</Router>
)

export default MainPage
