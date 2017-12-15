import React, { Component } from 'react'
import '../App.css'
import moment from 'moment'
import LottoLogo from './LottoLogo'
import { Panel, Col } from 'react-bootstrap'

class ThinTicketContainer extends Component {
  state = { show: true }

  logoGen = (
    <div>
      <LottoLogo lottoname={this.props.ticket.lottoname} />
      {this.props.ticket.date}
    </div>
  )

  render() {
    return (
      <div style={{ align: 'center' }}>
        {this.state.show && (
          <Col xs={12} sm={7} md={5}>
            <Panel
              className="bootstrap-overrides"
              header={this.logoGen}
              bsStyle={
                this.props.ticket.lottoname === 'powerball' ? 'info' : 'success'
              }
            >
              <div className="numberContainer">
                {this.props.ticket.vanillanums.map((number, index) => (
                  <li
                    name={this.props.ticket.lottoname}
                    key={index}
                    value={number}
                    className="numberCircle vanillaNum"
                  >
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
        )}
      </div>
    )
  }
}

export default ThinTicketContainer
