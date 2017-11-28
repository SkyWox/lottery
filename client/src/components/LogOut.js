import React, { Component } from 'react'
import { Jumbotron } from 'react-bootstrap'

class LogOut extends Component {
	logout() {
		sessionStorage.removeItem('jwtToken')
		return true
	}
	render() {
		return (
			<div>
				{this.logout() && (
					<Jumbotron>
						<h1>Logout successful</h1>
					</Jumbotron>
				)}
			</div>
		)
	}
}
export default LogOut
