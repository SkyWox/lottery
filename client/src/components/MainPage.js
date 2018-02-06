import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import NumberApp from './NumberApp'
import InputWatch from './InputWatch'
import { Button, ButtonGroup } from 'react-bootstrap'

const MainPage = () => (
  <Router>
    <div>
      <ButtonGroup justified={true}>
        <Link to="/">
          <Button>Number Generator</Button>
        </Link>
        <Link to="/watch">
          <Button>My Tickets</Button>
        </Link>
      </ButtonGroup>

      <Route exact path="/" component={NumberApp} />
      <Route path="/watch" component={InputWatch} />
    </div>
  </Router>
)

export default MainPage
