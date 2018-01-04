import React, { Component } from 'react'
import '../App.css'
import moment from 'moment'
import TicketContainer from './TicketContainer'
import LottoLogo from './LottoLogo'
import LogIn from './LogIn'
import {
  Button,
  ToggleButtonGroup,
  ToggleButton,
  ControlLabel,
  FormControl,
  FormGroup,
  DropdownButton,
  MenuItem,
  Well,
  Grid,
  Row,
  Col
} from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import axios from 'axios'

class InputWatch extends Component {
  // Initialize state for powerball
  state = {
    userID: 1,
    isLoggedIn: true,
    tickets: [],
    input: '',
    needhelp: false,
    showLogOut: false,
    format: '## ## ## ## ## ##'
  }

  componentWillMount() {
    this.initialLogin()
  }

  onChange = emailPref => {
    var win = false
    var lose = false
    if (emailPref.indexOf(1) !== -1) win = true
    if (emailPref.indexOf(2) !== -1) lose = true
    axios({
      method: 'patch',
      url: '/db/users/' + this.state.userID,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('jwtToken')
      },
      data: {
        contactwin: win,
        contactlose: lose
      }
    }).then(res => {
      if (res.status !== 200) {
        console.log('user update error')
      } else {
        this.setState({ emailPref })
      }
    })
  }

  initialLogin() {
    let token = sessionStorage.getItem('jwtToken')
    if (token) {
      axios({
        method: 'get',
        url: '/db/users/me/from/token',
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(res => {
        if (res.status !== 200) {
          console.log('token field error')
          this.setState({ isLoggedIn: false })
        } else {
          this.fetchUserData(res.data)
        }
      })
    } else {
      this.setState({ isLoggedIn: false })
    }
  }

  fetchUserData(data) {
    sessionStorage.setItem('jwtToken', data.token)

    var emailPref = []
    if (data.user.contactwin === true) emailPref.push(1)
    if (data.user.contactlose === true) emailPref.push(2)

    this.setState(
      {
        userID: data.user.userid,
        emailPref: emailPref
      },
      () => this.setState({ isLoggedIn: true })
    )
    axios({
      method: 'get',
      url: '/db/users/' + data.user.userid,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('jwtToken')
      }
    }).then(res => {
      if (res.data.tickets) {
        const tickets = res.data.tickets
        //Best way to iterate over object & avoid scope issues
        for (var i = 0; i < tickets.length; i++) {
          this.addTicketToState(tickets[i], { saved: true })
        }
      }
    })
  }

  addTicketToState(ticket, obj) {
    var ticketArray = this.state.tickets
    ticketArray.unshift({
      key: ticketArray.length,
      lottoname: ticket.lottoname,
      numbers: ticket.numbers,
      vanillanums: ticket.vanillanums,
      specialnums: ticket.specialnums,
      lottodate: moment(ticket.lottodate).format('ddd, MMM Do YYYY'),
      ticketID: ticket.id,
      saved: ticket.saved || obj.saved
    })
    this.setState({ tickets: ticketArray })
  }

  getInputFields(e) {
    //rewrite to use server specs
    var numvanilla = 0
    var numspecial = 0

    if (e === 'powerball') {
      numvanilla = 5
      numspecial = 1
    } else if (e === 'megamil') {
      numvanilla = 6
      numspecial = 1
    }
    var format = '##'
    for (var i = 0; i < numvanilla + numspecial - 1; i++) {
      format = format + ' ##'
    }
    this.setState({
      lottoname: e,
      specialflag: numspecial,
      format: format,
      minlength: numvanilla + numspecial
    })
  }

  handleChange(e) {
    this.setState({ input: e.target.value })
  }

  shouldFormSubmit() {
    if (this.getValidationState() === 'success') {
      this.handleSubmit()
      this.setState({
        needhelp: false
      })
    } else {
      this.setState({
        needhelp: true
      })
    }
  }

  getValidationState() {
    const parsedInput = this.parseInput(this.state.input)
    if (parsedInput.length === this.state.minlength) return 'success'
    else if (parsedInput.length > 0) return 'error'
    return null
  }

  handleSubmit() {
    var drawDate = this.findNextDrawing()

    const nums = this.parseInput(this.state.input)
    var vanillanums = nums.slice(0)
    var specialnums = 0

    if (this.state.specialflag === 1) {
      specialnums = vanillanums.pop()
    }
    vanillanums.sort(function(a, b) {
      return a - b
    })

    //submit to DB
    axios({
      method: 'post',
      url: '/db/users/' + this.state.userID + '/tickets',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('jwtToken')
      },
      data: {
        numbers: nums,
        vanillanums: vanillanums,
        specialnums: specialnums,
        lottodate: drawDate,
        lottoname: this.state.lottoname
      }
    })
      .then(res => {
        var saved = false
        if (res.status === 201) {
          saved = true
        }
        this.addTicketToState(res.data, { saved: saved })
      })
      .catch(function(err) {
        console.log(err)
      })

    this.setState({
      input: ''
    })
  }

  findNextDrawing() {
    const dayOfWeek = moment().format('dddd')
    var drawDate = moment().format('YYYY-MM-DD')
    switch (dayOfWeek) {
      case 'Sunday':
        drawDate = moment().add(3, 'days')
        break
      case 'Monday':
      case 'Thursday':
        drawDate = moment().add(2, 'days')
        break
      case 'Tuesday':
      case 'Friday':
        drawDate = moment().add(1, 'days')
        break
      default:
        drawDate = moment().format('YYYY-MM-DD')
    }
    return drawDate
  }

  parseInput(input) {
    return input
      .split(' ')
      .map(Number)
      .filter(i => i)
  }

  removeTicket(ticket, index) {
    //need to move all calls to auth headers
    axios({
      method: 'delete',
      url: '/db/users/' + this.state.userID + '/tickets/' + ticket.ticketID,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('jwtToken')
      }
    })
      .then(res => {
        if (res.status === 204) {
          var ticketArray = this.state.tickets
          ticketArray.splice(index, 1)
          this.setState({ tickets: ticketArray })
        } else console.log('ticket could not be deleted')
      })
      .catch(err => console.log(err))
  }

  reLogIn() {
    this.setState({ hideLoginModal: false })
  }

  handleLogOut() {
    this.setState({
      showLogOut: true,
      isLoggedIn: false,
      tickets: [],
      hideLoginModal: true
    })
  }

  render() {
    return (
      <div>
        {this.state.isLoggedIn && (
          <div>
            <Button onClick={() => this.handleLogOut()}>Log Out</Button>
            <ToggleButtonGroup
              type="checkbox"
              value={this.state.emailPref}
              onChange={this.onChange}
            >
              <ToggleButton value={1}>Email me if I win</ToggleButton>
              <ToggleButton value={2}>Email me if I lose</ToggleButton>
            </ToggleButtonGroup>
          </div>
        )}
        {!this.state.hideLoginModal && (
          <LogIn
            isLoggedIn={this.state.isLoggedIn}
            fetchUserData={data => this.fetchUserData(data)}
          />
        )}
        {this.state.hideLoginModal && (
          <Button onClick={() => this.reLogIn()}>Log In</Button>
        )}
        <Well bsSize="large">
          <form>
            <FormGroup
              controlId="formBasicText"
              validationState={this.getValidationState()}
            >
              <ControlLabel>Add a ticket to watch</ControlLabel>
              <DropdownButton
                value={this.state.lottoname}
                title="Select Lottery"
                id="bg-justified-dropdown"
                onSelect={e => this.getInputFields(e)}
              >
                <MenuItem eventKey="powerball">Powerball</MenuItem>
                <MenuItem eventKey="megamil">Mega Millions</MenuItem>
              </DropdownButton>
              {this.state.lottoname && (
                <div>
                  <LottoLogo lottoname={this.state.lottoname} />
                  <NumberFormat
                    value={this.state.input}
                    format={this.state.format}
                    customInput={FormControl}
                    onChange={e => {
                      this.handleChange(e)
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        this.shouldFormSubmit()
                      }
                    }}
                  />
                  <br />
                  {this.state.needhelp && (
                    <span>
                      Please enter numbers in the format {this.state.format}
                      <br />
                    </span>
                  )}
                  <Button
                    onClick={e => {
                      this.shouldFormSubmit()
                    }}
                  >
                    Add to Watch List
                  </Button>
                </div>
              )}
            </FormGroup>
          </form>
        </Well>
        <div>
          <Grid>
            {this.state.tickets.map((ticket, index) => (
              <div key={index}>
                <Row className="show-grid">
                  <TicketContainer ticket={ticket} />

                  <Col xs={1} md={1} xsHidden>
                    <Button
                      style={{ height: '173px' }}
                      onClick={() => this.removeTicket(ticket, index)}
                    >
                      X
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </Grid>
        </div>
      </div>
    )
  }
}

export default InputWatch
