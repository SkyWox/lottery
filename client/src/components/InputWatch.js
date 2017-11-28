import React, { Component } from 'react'
import '../App.css'
import moment from 'moment'
import ThinTicketContainerWatch from './ThinTicketContainerWatch'
import LottoLogo from './LottoLogo'
import LogIn from './LogIn'
import {
	Button,
	ButtonGroup,
	ControlLabel,
	FormControl,
	FormGroup,
	DropdownButton,
	MenuItem,
	Well,
	Panel
} from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import axios from 'axios'

class InputWatch extends Component {
	// Initialize state for powerball
	state = {
		userID: 1,
		isLoggedIn: true,
		vanillanums: [],
		specialnums: [],
		lottonames: [],
		dates: [],
		saved: [],
		input: '',
		needhelp: false,
		format: '## ## ## ## ## ##'
	}

	componentWillMount() {
		this.setState({
			lottoname: this.props.lottoname,
			numbers: this.props.numbers
		})
		sessionStorage.getItem('jwtToken')
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
					this.userlogin(res.data.user)
				}
			})
	}

	componentWillReceiveProps() {
		this.setState({
			lottoname: this.props.lottoname,
			numbers: this.props.numbers
		})
	}

	handleChange(e) {
		this.setState({ input: e.target.value })
	}

	userlogin(user) {
		axios
			.post('/db/users/' + user.userid, {
				token: sessionStorage.getItem('jwtToken')
			})
			.then(res => {
				var lottonames = []
				var dates = []
				var vanillas = []
				var specials = []
				var saved = []
				res.data.tickets.forEach(function(ticket, i) {
					lottonames.unshift(ticket.lottoname)
					vanillas.unshift(ticket.numbers)
					specials.unshift(8)
					saved.unshift(true)
					dates.unshift(moment(ticket.lottodate).format('dddd MMM Do YYYY'))
				})
				this.setState({
					isLoggedIn: true,
					userID: user.userid,
					vanillanums: vanillas,
					specialnums: specials,
					lottonames: lottonames,
					saved: saved,
					dates: dates
				})
			})
	}

	findNextDrawing() {
		const dayOfWeek = moment().format('dddd')
		var drawDate = dayOfWeek
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
		}
		return drawDate
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

	handleSubmit() {
		var names = this.state.lottonames
		var saved = this.state.saved
		names.unshift(this.state.lottoname)

		var dates = this.state.dates
		var drawDate = this.findNextDrawing()
		dates.unshift(drawDate.format('dddd MMM Do YYYY'))

		var nums = this.parseInput(this.state.input)
		//clone nums because it is sync pop'd
		const nums2 = nums.slice(0)
		var vanillanums = this.state.vanillanums
		var specialnums = this.state.specialnums
		if (this.state.specialflag === 1) {
			specialnums.unshift(nums.pop())
		} else {
			specialnums.unshift(0)
		}
		vanillanums.unshift(nums)

		//submit to DB
		axios
			.post('/db/users/' + this.state.userID + '/tickets', {
				numbers: nums2,
				vanillanums: nums,
				specialnums: specialnums[0],
				lottodate: drawDate.format('YYYY-MM-DD'),
				lottoname: this.state.lottoname,
				token: sessionStorage.getItem('jwtToken')
			})
			.then(function(res) {
				if (res.status === 201) {
					saved.unshift(true)
				} else {
					saved.unshift(false)
				}
			})
			.then(() => {
				this.setState({
					saved: saved
				})
			})
			.catch(function(err) {
				console.log(err)
			})

		this.setState({
			lottonames: names,
			dates: dates,
			vanillanums: vanillanums,
			specialnums: specialnums,
			input: ''
		})
	}

	removeTicket() {}

	parseInput(input) {
		return input
			.split(' ')
			.map(Number)
			.filter(i => i)
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

	getValidationState() {
		const length = this.parseInput(this.state.input).length
		if (length === this.state.minlength) return 'success'
		else if (length > 0) return 'error'
		return null
	}

	render() {
		return (
			<div>
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
				<Panel header={this.logoGen} bsStyle="primary" />
				<div>
					{this.state.vanillanums.map((numbers, index) => (
						<ThinTicketContainerWatch
							key={index}
							lottoname={this.state.lottonames[index]}
							numbers={this.state.vanillanums[index]}
							special={this.state.specialnums[index]}
							date={this.state.dates[index]}
							saved={this.state.saved[index]}
							watchlist={true}
						/>
					))}
				</div>
			</div>
		)
	}
}

export default InputWatch
