import React, { Component } from 'react'
import '../App.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ThinTicketContainerWatch from './ThinTicketContainerWatch'
import InputWatch from './InputWatch'
import { Button, ButtonGroup, Jumbotron } from 'react-bootstrap'
import moment from 'moment'

class NumberApp extends Component {
	componentWillMount() {
		this.setState({
			//default list to speed loading
			nameDrop: ['powerball', 'superlplus', 'megamil'],
			propDrop: ['Powerball', 'Super Lotto Plus', 'Mega Millions'],
			tickets: [],
			lottoname: 'powerball',
			proper: 'Powerball',
			showIntro: true
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
		const name = this.state.lottoname
		var requestURL = new Request(
			'/getnumbers?name=' + name + '&date=' + moment()
		)
		fetch(requestURL)
			.then(res => res.json())
			.then(res => {
				ticketArray.push({
					key: new Date().getTime(),
					lottoname: this.state.lottoname,
					vanillanums: res.vanilla,
					specialnums: res.special,
					alive: true,
					mint: mintBool
				})
				this.setState({ tickets: ticketArray })
			})
			.catch()
	}

	hideTicket(index) {
		var ticketArray = this.state.tickets
		ticketArray[index].alive = false
		this.setState({ ticket: ticketArray })
	}

	remove(array, element) {
		return array.filter(e => e !== element)
	}

	hideIntro() {
		this.setState({ showIntro: false })
	}

	render() {
		//remove the current one so it's just the other lottos
		var currNameDrop = this.remove(this.state.nameDrop, this.state.lottoname)
		var currPropDrop = this.remove(this.state.propDrop, this.state.proper)
		return (
			<Router>
				<div className="App">
					{this.state.showIntro &&
						!sessionStorage.getItem('jwtToken') && (
							<Jumbotron>
								<h1 style={{ textAlign: 'center' }}>Welcome!</h1>
								<p>
									This app saves your lottery tickets and emails you to let you
									know if you won!
								</p>
								<p>It also generates random lottery numbers</p>
								<Button onClick={() => this.hideIntro()}>Ok, got it</Button>
							</Jumbotron>
						)}
					<h1 style={{ textAlign: 'center' }}>
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
											})
										}
										value={name}>
										{currPropDrop[index]}
									</a>
								))}
							</div>
						</div>
						Lucky Numbers
					</h1>
					{this.state.tickets.map((ticket, index) => (
						<div key={index}>
							{ticket.alive && (
								<div>
									<ThinTicketContainerWatch
										ticketnum={index}
										numbers={ticket.vanillanums}
										special={ticket.specialnums}
										lottoname={ticket.lottoname}
										mint={ticket.mint}
									/>
									<div style={{ textAlign: 'center' }}>
										<Button
											color={'red'}
											onClick={() => this.hideTicket(index)}>
											<span color="red">^ Delete ticket ^</span>
										</Button>
									</div>
								</div>
							)}
						</div>
					))}
					<div style={{ textAlign: 'center' }}>
						<button className="addTicket" onClick={() => this.addTicket(false)}>
							+ Add Ticket
						</button>
					</div>
				</div>
			</Router>
		)
	}
}

export default NumberApp
