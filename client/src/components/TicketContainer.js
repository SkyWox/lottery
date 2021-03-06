import React, { Component } from 'react'
import '../App.css'
import LottoLogo from './LottoLogo'
import { Panel, Col } from 'react-bootstrap'

class TicketContainer extends Component {
  render() {
    return (
      <div>
        <Col xs={10} sm={7} smOffset={2} md={5} mdOffset={3}>
          <Panel
            bsStyle={
              this.props.ticket.lottoname === 'powerball' ? 'info' : 'success'
            }
          >
            <Panel.Heading>
              <LottoLogo lottoname={this.props.ticket.lottoname} />
              {this.props.ticket.lottodate}
            </Panel.Heading>
            <Panel.Body>
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
            </Panel.Body>
          </Panel>
        </Col>
      </div>
    )
  }
}

export default TicketContainer
