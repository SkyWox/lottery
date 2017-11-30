import React, { Component } from 'react'
import '../App.css'
import moment from 'moment'
import ThinTicketContainerWatch from './ThinTicketContainerWatch'
import LottoLogo from './LottoLogo'
import LogIn from './LogIn'
import LogOut from './LogOut'
import {
	Button,
	ControlLabel,
	FormControl,
	FormGroup,
	DropdownButton,
	MenuItem,
	Well
} from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import axios from 'axios'

class InputWatch extends Component {
	// Initialize state for powerball
	state = {
		userID: 1,
		isLoggedIn: true,
		tickets: [],
		input: '',
		needhelp: false,
		showLogOut: false,
		format: '## ## ## ## ## ##'
	}

	componentWillMount() {
		this.initialLogin()
	}

	initialLogin() {
		let token = sessionStorage.getItem('jwtToken')
		if (token) {
			axios
				.post('/db/users/me/from/token', {
					token: sessionStorage.getItem('jwtToken')
				})
				.then(res => {
					if (res.status !== 200) {
						console.log('token field error')
						this.setState({ isLoggedIn: false })
					} else {
						sessionStorage.setItem('jwtToken', res.data.token)
						this.setState({
							isLoggedIn: true,
							userID: res.data.user.userid
						})
						this.fetchUserTickets(res.data.user)
					}
				})
		} else {
			this.setState({ isLoggedIn: false })
		}
	}

	fetchUserTickets(user) {
		axios
			.post('/db/users/' + user.userid, {
				token: sessionStorage.getItem('jwtToken')
			})
			.then(res => {
				if (res.data.tickets) {
					const tickets = res.data.tickets
					//Best way to iterate over object & avoid scope issues
					for (var i = 0; i < tickets.length; i++) {
						this.addTicketToState(tickets[i], { saved: true })
					}
				}
			})
	}

	addTicketToState(ticket, obj) {
		var ticketArray = this.state.tickets
		ticketArray.unshift({
			key: ticketArray.length,
			numbers: ticket.numbers,
			vanillanums: ticket.vanillanums,
			specialnums: ticket.specialnums,
			lottodate: moment(ticket.lottodate).format('dddd, MMM Do YYYY'),
			lottoname: ticket.lottoname,
			saved: ticket.saved || obj.saved
		})
		this.setState({ tickets: ticketArray })
	}

	getInputFields(e) {
		//rewrite to use server specs
		var numvanilla = 0
		var numspecial = 0

		if (e === 'powerball') {
			numvanilla = 5
			numspecial = 1
		} else if (e === 'megamil') {
			numvanilla = 6
			numspecial = 1
		}
		var format = '##'
		for (var i = 0; i < numvanilla + numspecial - 1; i++) {
			format = format + ' ##'
		}
		this.setState({
			lottoname: e,
			specialflag: numspecial,
			format: format,
			minlength: numvanilla + numspecial
		})
	}

	handleChange(e) {
		this.setState({ input: e.target.value })
	}

	shouldFormSubmit() {
		if (this.getValidationState() === 'success') {
			this.handleSubmit()
			this.setState({
				needhelp: false
			})
		} else {
			this.setState({
				needhelp: true
			})
		}
	}

	getValidationState() {
		const parsedInput = this.parseInput(this.state.input)
		if (parsedInput.length === this.state.minlength) return 'success'
		else if (parsedInput.length > 0) return 'error'
		return null
	}

	handleSubmit() {
		var drawDate = this.findNextDrawing()

		const nums = this.parseInput(this.state.input)
		var vanillanums = nums.slice(0)
		var specialnums = 0

		if (this.state.specialflag === 1) {
			specialnums = vanillanums.pop()
		}
		vanillanums.sort(function(a, b) {
			return a - b
		})

		//submit to DB
		axios
			.post('/db/users/' + this.state.userID + '/tickets', {
				numbers: nums,
				vanillanums: vanillanums,
				specialnums: specialnums,
				lottodate: drawDate,
				lottoname: this.state.lottoname,
				token: sessionStorage.getItem('jwtToken')
			})
			.then(res => {
				var saved = false
				if (res.status === 201) {
					saved = true
				}
				this.addTicketToState(res.data, { saved: saved })
			})
			.catch(function(err) {
				console.log(err)
			})

		this.setState({
			input: ''
		})
	}

	findNextDrawing() {
		const dayOfWeek = moment().format('dddd')
		var drawDate = moment().format('YYYY-MM-DD')
		switch (dayOfWeek) {
			case 'Sunday':
				drawDate = moment().add(3, 'days')
				break
			case 'Monday':
			case 'Thursday':
				drawDate = moment().add(2, 'days')
				break
			case 'Tuesday':
			case 'Friday':
				drawDate = moment().add(1, 'days')
				break
			default:
				drawDate = moment().format('YYYY-MM-DD')
		}
		return drawDate
	}

	parseInput(input) {
		return input
			.split(' ')
			.map(Number)
			.filter(i => i)
	}

	handleLogOut() {
		this.setState({ showLogOut: true })
		this.initialLogin()
	}

	render() {
		return (
			<div>
				{this.state.isLoggedIn && (
					<div>
						<Button onClick={() => this.handleLogOut()}>LogOut</Button>
					</div>
				)}
				{this.state.showLogOut && <LogOut />}
				<LogIn isLoggedIn={this.state.isLoggedIn} />
				<Well bsSize="large">
					<form>
						<FormGroup
							controlId="formBasicText"
							validationState={this.getValidationState()}>
							<ControlLabel>Add a ticket to watch</ControlLabel>
							<DropdownButton
								value={this.state.lottoname}
								title="Select Lottery"
								id="bg-justified-dropdown"
								onSelect={e => this.getInputFields(e)}>
								<MenuItem eventKey="powerball">Powerball</MenuItem>
								<MenuItem eventKey="megamil">Mega Millions</MenuItem>
							</DropdownButton>
							{this.state.lottoname && (
								<div>
									<LottoLogo lottoname={this.state.lottoname} />
									<NumberFormat
										value={this.state.input}
										format={this.state.format}
										customInput={FormControl}
										onChange={e => {
											this.handleChange(e)
										}}
										onKeyDown={e => {
											if (e.key === 'Enter') {
												e.preventDefault()
												this.shouldFormSubmit()
											}
										}}
									/>
									{this.state.needhelp && (
										<span>
											Please enter numbers in the format {this.state.format}
											<br />
										</span>
									)}
									<Button
										onClick={e => {
											this.shouldFormSubmit()
										}}>
										Add to Watch List
									</Button>
								</div>
							)}
						</FormGroup>
					</form>
				</Well>
				<div>
					{this.state.tickets.map((ticket, index) => (
						<div key={index}>
							<ThinTicketContainerWatch ticket={ticket} />
						</div>
					))}
				</div>
			</div>
		)
	}
}

export default InputWatch
