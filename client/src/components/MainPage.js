import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import NumberApp from './NumberApp'
import InputWatch from './InputWatch'
import { Button } from 'react-bootstrap'

const MainPage = () => (
  <Router>
    <div className="navbar">
      <Link to="/">
        <Button className="navbutton" bsSize="large">
          Number Generator
        </Button>
      </Link>

      <Link to="/watch">
        <Button className="navbutton" bsSize="large">
          My Tickets
        </Button>
      </Link>

      <Route exact path="/" component={NumberApp} />
      <Route path="/watch" component={InputWatch} />
    </div>
  </Router>
)

export default MainPage
