import React, { Component } from 'react'
import '../App.css'
import TicketContainer from './TicketContainer'
import Intro from './Intro'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import moment from 'moment'

var removeByIndex = (array, index) => array.filter((_, i) => i !== index)

var defaultInfo = {
  powerball: 'Powerball',
  superlplus: 'Super Lotto Plus',
  megamil: 'Mega Millions'
}

//now I need to make the import map similiarly
//and map the array to the drop downs

class NumberGeneratorPage extends Component {
  defaultNameDrop = ['powerball', 'superlplus', 'megamil']
  defaultPropDrop = ['Powerball', 'Super Lotto Plus', 'Mega Millions']

  componentWillMount() {
    this.setState({
      nameDrop: this.defaultNameDrop,
      propDrop: this.defaultPropDrop,
      currNameDrop: removeByIndex(
        this.defaultNameDrop,
        this.defaultNameDrop.indexOf(this.defaultName)
      ),
      currPropDrop: removeByIndex(
        this.defaultPropDrop,
        this.defaultPropDrop.indexOf(this.defaultProper)
      ),
      tickets: [],
      lottoname: Object.entries(defaultInfo)[0][0],
      proper: Object.entries(defaultInfo)[0][1],
      hideDropdown: true
    })
    if (!localStorage.getItem('hideIntro')) {
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
    localStorage.setItem('hideIntro', true)
  }

  handleDropDownClick(pickedLottoName) {
    this.setState(
      {
        lottoname: pickedLottoName,
        proper: this.defaultProper,
        currPropDrop: this.state.currPropDrop,
        currNameDrop: this.state.currNameDrop,
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
                      this.handleDropDownClick(this.state.currNameDrop[index])
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
        <Grid>
          {this.state.tickets.map((ticket, index) => (
            <div key={index}>
              <Row className="show-grid">
                <TicketContainer ticket={ticket} />

                <Col xs={1} md={1}>
                  <Button
                    style={{ height: '173px' }}
                    onClick={() => this.removeTicket(index)}
                  >
                    X
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
        </Grid>
        <div style={{ textAlign: 'center' }}>
          <button className="addTicket" onClick={() => this.addTicket(false)}>
            + Add Ticket
          </button>
        </div>
      </div>
    )
  }
}

export default NumberGeneratorPage
