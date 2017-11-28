import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import moment from 'moment'
import LottoLogo from './LottoLogo'

class ThinTicketContainer extends Component {
	// Initialize state for powerball

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
				<span className="ticketTitle">
					<LottoLogo lottoname={this.props.lottoname} />- {this.props.date}
				</span>
				{this.props.saved && <div>Ticket successfully saved</div>}
				{this.props.watchlist === false && (
					<div>
						{this.props.mint === false && (
							<button className="shuffle" onClick={this.shuffle}>
								Shuffle
							</button>
						)}

						<Link
							to={{
								pathname: '/watch',
								state: {
									numbers: this.props.numbers,
									lottoname: this.props.lottoname
								}
							}}>
							<button className="shuffle" onClick={this.saveNums}>
								Add to Watchlist
							</button>
						</Link>
					</div>
				)}
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
					{this.props.numbers.map((number, index) => (
						<li
							name={this.props.lottoname}
							key={index}
							value={number}
							className="numberCircle vanillaNum">
							{number}
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

export default ThinTicketContainer
