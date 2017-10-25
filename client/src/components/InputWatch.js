import React, { Component } from 'react'
import './App.css'
import moment from 'moment'

class InputWatch extends Component {
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

	render() {
		return (
			<div className="ticketContainer">
				<input
					type="text"
					class="form-control input-lg"
					id="myInput"
					placeholder="Click here"
				/>
			</div>
		)
	}
}

export default InputWatch
