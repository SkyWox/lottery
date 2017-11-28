import React, { Component } from 'react'
import { Jumbotron, Modal } from 'react-bootstrap'

class LogOut extends Component {
	logout() {
		sessionStorage.removeItem('jwtToken')
		return true
	}
	render() {
		return (
			<div>
				{this.logout() && (
					<Modal>
						<h1>Logout successful</h1>
					</Modal>
				)}
			</div>
		)
	}
}
export default LogOut
