import React, { Component } from 'react'
import { Jumbotron, Modal } from 'react-bootstrap'

class LogOut extends Component {
	state = { show: false }
	logOut() {
		if (sessionStorage.getItem('jwtToken')) {
			sessionStorage.removeItem('jwtToken')
			return true
		} else return false
	}

	render() {
		return (
			<div>
				<Modal show={this.logOut()} onHide={this.logOut}>
					<h1>Logout successful</h1>
				</Modal>
			</div>
		)
	}
}
export default LogOut
