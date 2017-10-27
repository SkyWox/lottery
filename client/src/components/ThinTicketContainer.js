import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import moment from 'moment'

class TicketContainer extends Component {
	// Initialize state for powerball
	state = {
		vanilla: [],
		special: 0,
		num: 1,
		showWhat: false
	}

	componentWillMount() {
		this.setState({ lottoname: this.props.lottoname, num: this.props.num })
	}

	componentWillReceiveProps() {
		this.setState({ lottoname: this.props.lottoname, num: this.props.num })
	}

	handleWhatisMint() {
		if (this.state.showWhat) {
			this.setState({ showWhat: false })
		} else {
			this.setState({ showWhat: true })
		}
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
				<span className="ticketTitle">Ticket {this.props.ticketnum}</span>
				{this.props.mint === false && (
					<button className="shuffle" onClick={this.shuffle}>
						Shuffle
					</button>
				)}
				<Link
					to={{
						pathname: '/watch',
						state: {
							numbers: this.props.vanilla.concat(this.props.special),
							lottoname: this.props.lottoname
						}
					}}>
					{this.props.watchlist === false && (
						<button className="shuffle" onClick={this.saveNums}>
							Add to Watchlist
						</button>
					)}
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
					{this.props.vanilla.map((luckynum, index) => (
						<li
							name={this.props.lottoname}
							key={index}
							value={luckynum}
							className="numberCircle vanillaNum">
							{luckynum}
						</li>
					))}
					{/*only show if there is a special number*/}
					{this.props.special !== 0 && (
						<li className="numberCircle specialNum">{this.props.special}</li>
					)}
				</div>
			</div>
		)
	}
}

export default TicketContainer
