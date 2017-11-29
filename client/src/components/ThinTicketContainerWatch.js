import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import moment from 'moment'
import LottoLogo from './LottoLogo'
import { Panel, Grid, Col, Row, Button } from 'react-bootstrap'

class ThinTicketContainer extends Component {
	state = { show: true }

	logoGen = (
		<div>
			<LottoLogo lottoname={this.props.ticket.lottoname} />
			{this.props.ticket.date}
		</div>
	)

	hide() {
		this.setState({ show: false })
	}

	render() {
		return (
			<div style={{ align: 'center' }}>
				{this.state.show && (
					<Grid>
						<Row className="show-grid">
							<Col xs={12} sm={7} md={5}>
								<Panel
									className="bootstrap-overrides"
									header={this.logoGen}
									bsStyle={
										this.props.ticket.lottoname === 'powerball'
											? 'info'
											: 'success'
									}>
									<div className="numberContainer">
										{this.props.ticket.vanillanums.map((number, index) => (
											<li
												name={this.props.ticket.lottoname}
												key={index}
												value={number}
												className="numberCircle vanillaNum">
												{number}
											</li>
										))}
										{/*only show if there is a special number*/}
										{this.props.ticket.specialnums !== 0 && (
											<li className="numberCircle specialNum">
												{this.props.ticket.specialnums}
											</li>
										)}
									</div>
								</Panel>
							</Col>

							<Col xs={1} md={1} xsHidden>
								<Button style={{ height: '173px' }} onClick={() => this.hide()}>
									X
								</Button>
							</Col>
						</Row>
					</Grid>
				)}
			</div>
		)
	}
}

export default ThinTicketContainer
