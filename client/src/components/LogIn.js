import React, { Component } from 'react'
import {
	Button,
	ControlLabel,
	FormControl,
	FormGroup,
	Well,
	Modal
} from 'react-bootstrap'
import axios from 'axios'

class LogIn extends Component {
	componentWillMount() {
		this.setState({
			email: '',
			password: '',
			firstname: '',
			lastname: '',
			type: 'login',
			loading: false,
			needhelp: '',
			noSubmit: true
		})
	}

	getValidationState() {
		if (this.state.email.length > 4) {
			if (this.state.type === 'forgot') {
				return 'success'
			} else if (this.state.password.length > 4) {
				if (this.state.type === 'login') {
					return 'success'
				} else {
					if (this.state.firstname.length > 4 && this.state.lastname.length) {
						return 'success'
					}
				}
			}
		} else {
			return null
		}
	}

	handleEmailChange(e) {
		this.setState({ email: e.target.value })
	}
	handlePassChange(e) {
		this.setState({ password: e.target.value })
	}
	handleFirstChange(e) {
		this.setState({ firstname: e.target.value })
	}
	handleLastChange(e) {
		this.setState({ lastname: e.target.value })
	}

	switchToCreate() {
		this.setState({ type: 'create' })
	}
	switchToForgot() {
		this.setState({ type: 'forgot' })
	}

	shouldFormSubmit() {
		if (this.getValidationState() === 'success') {
			this.handleSubmit()
			this.setState({
				needhelp: ''
			})
		} else {
			this.setState({
				needhelp: 'Please Check Your Entries'
			})
		}
	}

	handleSubmit() {
		this.setState({ loading: true })

		switch (this.state.type) {
			case 'login':
				axios
					.post('/db/users/signin', {
						email: this.state.email,
						password: this.state.password
					})
					.then(res => {
						if (res.status === 404) {
							this.setState({
								needhelp: res.data.message
							})
						} else {
							sessionStorage.setItem('jwtToken', res.data.token)
							this.setState({ noSubmit: false })
							this.props.loginSuccess()
						}
					})
					.catch(err => {
						console.log(err)
					})
				break
			case 'create':
				axios
					.post('/db/users/signup', {
						email: this.state.email,
						password: this.state.password,
						firstname: this.state.firstname,
						lastname: this.state.lastname
					})
					.then(res => {
						sessionStorage.setItem('jwtToken', res.data.token)
						this.setState({ noSubmit: false })
						this.props.loginSuccess()
					})
				break
			default:
				this.setState({
					needhelp: 'Sorry, that feature does not exist yet'
				})
				break
		}
	}

	render() {
		return (
			<div>
				<Modal show={!this.props.isLoggedIn && this.state.noSubmit}>
					<Modal.Header>
						<Modal.Title>
							{this.state.type === 'login' && <div>Please Log In</div>}
							{this.state.type === 'forgot' && (
								<div>Please Enter Your Email</div>
							)}
							{this.state.type === 'create' && (
								<div>Please Enter Your Info</div>
							)}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div>
							<Well bsSize="large">
								<form>
									<FormGroup
										controlId="formBasicText"
										validationState={this.getValidationState()}>
										<ControlLabel>Email</ControlLabel>
										<FormControl
											label="Email"
											value={this.state.input}
											onChange={e => {
												this.handleEmailChange(e)
											}}
											onKeyDown={e => {
												if (e.key === 'Enter') {
													e.preventDefault()
													this.shouldFormSubmit()
												}
											}}
										/>
										{(this.state.type === 'login' ||
											this.state.type === 'create') && (
											<div>
												<ControlLabel>Password</ControlLabel>

												<FormControl
													label="Password"
													type="password"
													value={this.state.input}
													onChange={e => {
														this.handlePassChange(e)
													}}
													onKeyDown={e => {
														if (e.key === 'Enter') {
															e.preventDefault()
															this.shouldFormSubmit()
														}
													}}
												/>
											</div>
										)}
										{this.state.type === 'create' && (
											<div>
												<ControlLabel>First Name</ControlLabel>
												<FormControl
													label="Firstname"
													value={this.state.input}
													onChange={e => {
														this.handleFirstChange(e)
													}}
													onKeyDown={e => {
														if (e.key === 'Enter') {
															e.preventDefault()
															this.shouldFormSubmit()
														}
													}}
												/>
												<ControlLabel>Last Name</ControlLabel>
												<FormControl
													label="Lastname"
													value={this.state.input}
													onChange={e => {
														this.handleLastChange(e)
													}}
													onKeyDown={e => {
														if (e.key === 'Enter') {
															e.preventDefault()
															this.shouldFormSubmit()
														}
													}}
												/>
											</div>
										)}
										{this.state.needhelp}
										<br />
										<Button
											disabled={this.state.loading}
											onClick={
												!this.state.loading
													? e => {
															this.shouldFormSubmit()
														}
													: null
											}>
											{this.state.loading ? (
												'Loading...'
											) : (
												<div>
													{this.state.type === 'login' && <div>Log In</div>}
													{this.state.type === 'forgot' && (
														<div>Reset Password</div>
													)}
													{this.state.type === 'create' && (
														<div>Create Account</div>
													)}
												</div>
											)}
										</Button>
									</FormGroup>
								</form>
							</Well>
						</div>
						<div>
							<Button bsStyle="link" onClick={() => this.switchToCreate()}>
								Create an account
							</Button>
						</div>
						<div>
							<Button bsStyle="link" onClick={() => this.switchToForgot()}>
								Forgot my email or password
							</Button>
						</div>
					</Modal.Body>
				</Modal>
			</div>
		)
	}
}
export default LogIn
