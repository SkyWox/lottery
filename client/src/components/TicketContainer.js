import React, { Component } from 'react'
import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect
} from 'react-router-dom'
import '../App.css'
import moment from 'moment'

class TicketContainer extends Component {
	// Initialize state for powerball
	state = {
		vanilla: [],
		special: 0,
		ticketnum: 1,
		showWhat: false
	}

	componentWillMount() {
		this.setState({
			lottoname: this.props.lottoname,
			ticketnum: this.props.ticketnum
		})
	}

	componentWillReceiveProps() {
		this.setState({
			lottoname: this.props.lottoname,
			ticketnum: this.props.ticketnum
		})
	}

	componentDidMount() {
		this.getNumbers()
	}

	handleWhatisMint() {
		if (this.state.showWhat) {
			this.setState({ showWhat: false })
		} else {
			this.setState({ showWhat: true })
		}
	}

	getNumbers = () => {
		const name = this.state.lottoname
		var requestURL = new Request(
			'/getnumbers?mint=' +
				this.props.mint +
				'&name=' +
				name +
				'&date=' +
				moment()
		)
		fetch(requestURL)
			.then(res => res.json())
			.then(res =>
				this.setState({
					special: res.special,
					vanilla: res.vanilla
				})
			)
			.catch()
	}

	shuffle = () => {
		this.getNumbers()
	}

	saveNums = () => {
		//handle saving numbers
	}

	render() {
		return (
			<div className="ticketContainer">
				<span className="ticketTitle">Ticket {this.props.ticketnum + 1}</span>
				{this.props.mint === false && (
					<button className="shuffle" onClick={this.shuffle}>
						Shuffle
					</button>
				)}
				<Link
					to={{
						pathname: '/watch',
						state: {
							numbers: this.state.vanilla.concat(this.state.special),
							lottoname: this.state.lottoname
						}
					}}>
					<button className="shuffle" onClick={this.saveNums}>
						Add to Watch List
					</button>
				</Link>
				{this.props.mint && (
					<button
						className="addTicket"
						style={{ float: 'left' }}
						onClick={() => {
							this.handleWhatisMint()
						}}>
						<span role="img" aria-label="mint icon">
							🌿
						</span>
						{this.state.showWhat
							? 'We guarantee nobody else has seen these fresh numbers!'
							: 'Minty Fresh Numbers!'}
					</button>
				)}
				<br />
				<br />
				<div className="numberContainer">
					{this.state.vanilla.map((luckynum, index) => (
						<li
							name={this.props.lottoname}
							key={index}
							value={luckynum}
							className="numberCircle vanillaNum">
							{luckynum}
						</li>
					))}
					{/*only show if there is a special number*/}
					{this.state.special !== 0 && (
						<li className="numberCircle specialNum">{this.state.special}</li>
					)}
				</div>
			</div>
		)
	}
}

export default TicketContainer