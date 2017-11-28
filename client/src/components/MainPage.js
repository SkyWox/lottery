import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import NumberApp from './NumberApp'
import InputWatch from './InputWatch'
import LogIn from './LogIn'
import LogOut from './LogOut'
import { Button, ButtonGroup } from 'react-bootstrap'

const MainPage = () => (
	<Router>
		<div>
			<ButtonGroup justified={true}>
				{sessionStorage.getItem('jwtToken') ? (
					<div>
						<Link to="/">
							<Button>Number Generator</Button>
						</Link>
						<Link to="/watch">
							<Button>My Tickets</Button>
						</Link>
						<Link to="/logout">
							<Button>Log Out</Button>
						</Link>
					</div>
				) : (
					<div>
						<Link to="/">
							<Button>Number Generator</Button>
						</Link>
						<Link to="/login">
							<Button>Log In</Button>
						</Link>
					</div>
				)}
			</ButtonGroup>

			<Route exact path="/" component={NumberApp} />
			<Route path="/watch" component={InputWatch} />
			<Route path="/login" render={() => <LogIn isLoggedIn={false} />} />
			<Route path="/logout" component={LogOut} />
		</div>
	</Router>
)

export default MainPage
