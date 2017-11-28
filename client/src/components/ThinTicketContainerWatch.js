import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import moment from 'moment'
import LottoLogo from './LottoLogo'
import { Panel } from 'react-bootstrap'

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

	logoGen = (
		<div>
			<LottoLogo lottoname={this.props.lottoname} />
			{this.props.date}
		</div>
	)

	render() {
		return (
			<div>
				<Panel
					header={this.logoGen}
					bsStyle={this.props.lottoname === 'powerball' ? 'info' : 'success'}>
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
				</Panel>
			</div>
		)
	}
}

export default ThinTicketContainer
