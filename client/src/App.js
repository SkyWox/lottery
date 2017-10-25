import React, { Component } from 'react'
import './App.css'
import TicketContainer from './TicketContainer.js'

class App extends Component {
	componentWillMount() {
		this.setState({
			//default list to speed loading
			nameDrop: ['powerball', 'superlplus', 'megamil'],
			propDrop: ['Powerball', 'Super Lotto Plus', 'Mega Millions'],
			tickets: [],
			//can't use an async here or first render will be undefined
			lottoname: 'powerball',
			proper: 'Powerball'
		})
	}

	componentDidMount() {
		this.addTicket(false)
		this.updateLottoSpecs()
	}

	updateLottoSpecs() {
		var name = []
		var proper = []
		var updateState = 0
		var requestURL = new Request('/lottolist')
		fetch(requestURL)
			.then(res => res.json())
			.then(res => {
				for (var a in res) {
					name.push(res[a].name)
					if (res[a].name !== this.state.nameDrop[a]) {
						updateState = true
					}
					proper.push(res[a].proper)
					if (res[a].proper !== this.state.propDrop[a]) {
						updateState = true
					}
				}

				if (updateState) {
					this.setState({
						nameDrop: name,
						propDrop: proper
					})
				}
			})
			.catch()
	}

	update(obj) {
		this.setState(obj, () => {
			this.addTicket(false)
		})
	}

	addTicket(mintBool) {
		var ticketArray = this.state.tickets
		ticketArray.push({
			key: new Date().getTime(),
			lottoname: this.state.lottoname,
			mint: mintBool
		})

		this.setState({ tickets: ticketArray })
	}

	remove(array, element) {
		return array.filter(e => e !== element)
	}

	render() {
		//remove the current one so it's just the other lottos
		var currNameDrop = this.remove(this.state.nameDrop, this.state.lottoname)
		var currPropDrop = this.remove(this.state.propDrop, this.state.proper)
		return (
			<div className="App">
				<div>
					<h1>
						<div className="dropdown">
							<button className="dropbtn">{this.state.proper}</button>
							<div className="dropdown-content">
								{currNameDrop.map((name, index) => (
									<a
										key={index}
										onClick={() =>
											this.update({
												lottoname: currNameDrop[index],
												proper: currPropDrop[index],
												tickets: []
											})}
										value={name}>
										{currPropDrop[index]}
									</a>
								))}
							</div>
						</div>
						Lucky Numbers
					</h1>
					{this.state.tickets.map((timestamp, index) => (
						<TicketContainer
							key={index}
							num={index}
							lottoname={this.state.lottoname}
							mint={timestamp.mint}
						/>
					))}
					<button className="addTicket" onClick={() => this.addTicket(false)}>
						+ Add Ticket
					</button>
					<button className="addTicket" onClick={() => this.addTicket(true)}>
						+ Add Fresh Ticket
					</button>
				</div>
			</div>
		)
	}
}

export default App
