import React, { Component } from 'react'
import '../App.css'
import moment from 'moment'
import ThinTicketContainer from './ThinTicketContainer'
import ThinTicketContainerWatch from './ThinTicketContainerWatch'
import {
	Button,
	ButtonGroup,
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

		//submit to DB
		axios
			.post('/db/users/' + this.state.userID + '/tickets', {
				numbers: nums2,
				lottodate: drawDate.format('YYYY-MM-DD'),
				lottoname: this.state.lottoname
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

		var vanillanums = this.state.vanillanums
		var specialnums = this.state.specialnums
		if (this.state.specialflag === 1) {
			specialnums.unshift(nums.pop())
		} else {
			specialnums.unshift(0)
		}
		vanillanums.unshift(nums)
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

	lottoLogo() {
		var source = ''
		var alternate = ''

		switch (this.state.lottoname) {
			case 'powerball':
				source =
					'http://www.arizonalottery.com/~/media/assets/branding/game-logos/powerball_gamelogo.ashx?mh=200'
				alternate = 'Powerball'
				break
			case 'megamil':
				source =
					'http://www.megamillions.com/Themes/MegaMillions/Content/Images/animation_logolarge.png'
				alternate = 'Mega Millions'
		}
		return <img src={source} style={{ maxHeight: '60px' }} alt={alternate} />
	}

	saveState() {
		//Save tickets to memory
	}

	render() {
		return (
			<div>
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
									{this.lottoLogo()}
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
					{this.state.vanillanums.map((numbers, index) => (
						<ThinTicketContainerWatch
							key={index}
							ticketnum={index}
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
