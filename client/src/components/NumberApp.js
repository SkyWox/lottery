import React, { Component } from 'react'
import '../App.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ThinTicketContainerWatch from './ThinTicketContainerWatch'
import InputWatch from './InputWatch'
import Intro from './Intro'
import { Button, ButtonGroup, Grid, Row, Col } from 'react-bootstrap'
import moment from 'moment'

class NumberApp extends Component {
  componentWillMount() {
    this.setState({
      //default list to speed loading
      nameDrop: ['powerball', 'superlplus', 'megamil'],
      propDrop: ['Powerball', 'Super Lotto Plus', 'Mega Millions'],
      currNameDrop: ['superlplus', 'megamil'],
      currPropDrop: ['Super Lotto Plus', 'Mega Millions'],
      tickets: [],
      lottoname: 'powerball',
      proper: 'Powerball',
      hideDropdown: true
    })
    if (!sessionStorage.getItem('hideIntro')) {
      this.setState({ hideIntro: false })
    } else {
      this.setState({ hideIntro: true })
    }
  }

  componentDidMount() {
    this.addTicket()
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

  addTicket() {
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
          specialnums: res.special
        })
        this.setState({ tickets: ticketArray })
      })
      .catch()
  }

  removeTicket(index) {
    var ticketArray = this.state.tickets
    ticketArray.splice(index, 1)
    this.setState({
      tickets: ticketArray
    })
  }

  remove(array, element) {
    return array.filter(e => e !== element)
  }

  hideIntro() {
    this.setState({ hideIntro: true })
    sessionStorage.setItem('hideIntro', true)
  }

  handleDropDownClick(propDrop, nameDrop) {
    this.setState(
      {
        lottoname: nameDrop,
        proper: propDrop,
        hideDropdown: true,
        tickets: []
      },
      () => this.addTicket()
    )
  }

  showDropDown() {
    this.setState({ hideDropdown: false })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Intro />
          <h1 style={{ textAlign: 'center' }}>
            <div className="dropdown">
              <button className="dropbtn" onClick={() => this.showDropDown()}>
                {this.state.proper}
              </button>
              {!this.state.hideDropdown && (
                <div className="dropdown-content">
                  {this.state.currPropDrop.map((propDrop, index) => (
                    <a
                      key={index}
                      onClick={() =>
                        this.handleDropDownClick(
                          propDrop,
                          this.state.currNameDrop[index]
                        )
                      }
                      value={propDrop}
                    >
                      {propDrop}
                    </a>
                  ))}
                </div>
              )}
            </div>
            Number Generator
          </h1>
          {this.state.tickets.map((ticket, index) => (
            <div key={index}>
              <Grid>
                <Row className="show-grid">
                  <ThinTicketContainerWatch ticket={ticket} />

                  <Col xs={1} md={1} xsHidden>
                    <Button
                      style={{ height: '173px' }}
                      onClick={() => this.removeTicket(index)}
                    >
                      X
                    </Button>
                  </Col>
                </Row>
              </Grid>
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
