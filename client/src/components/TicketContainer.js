import React, { Component } from 'react'
import '../App.css'
import LottoLogo from './LottoLogo'
import { Panel, Col } from 'react-bootstrap'

class TicketContainer extends Component {
  render() {
    return (
      <div style={{ align: 'center' }}>
        <Col xs={12} sm={7} md={5}>
          <Panel
            className="bootstrap-overrides"
            header={
              <div>
                <LottoLogo lottoname={this.props.ticket.lottoname} />
                {this.props.ticket.lottodate}
              </div>
            }
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
      </div>
    )
  }
}

export default TicketContainer
