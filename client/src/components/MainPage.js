import React from 'react'
import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect
} from 'react-router-dom'
import NumberApp from './NumberApp'
import InputWatch from './InputWatch'
import LogIn from './LogIn'
import { Button, ButtonGroup } from 'react-bootstrap'

function isLoggedIn() {
	return true
}

const MainPage = () => (
	<Router>
		<div>
			<ButtonGroup justified={true}>
				<Link to="/">
					<Button>Number Generator</Button>
				</Link>
				<Link to="/watch">
					<Button>My Tickets</Button>
				</Link>
			</ButtonGroup>

			<Route exact path="/" component={NumberApp} />
			<Route
				path="/watch"
				render={() => (isLoggedIn() ? <InputWatch /> : <LogIn />)}
			/>
		</div>
	</Router>
)

export default MainPage
