import React, { Component } from 'react'
import { Jumbotron, Button } from 'react-bootstrap'
class LottoLogo extends Component {
  state = { hide: false }
  hideIntro() {
    sessionStorage.setItem('hideIntro', true)
    this.setState({ hide: true })
  }

  render() {
    return (
      <div>
        {!sessionStorage.getItem('hideIntro', true) &&
          !sessionStorage.getItem('jwtToken') &&
          !this.state.hide && (
            <div style={{ textAlign: 'center' }}>
              <Jumbotron>
                <h1>Welcome!</h1>
                <p>
                  This app saves your lottery tickets and emails you to let you
                  know if you won!
                </p>
                <p>It also generates random lottery numbers</p>
                <Button onClick={() => this.hideIntro()}>Ok, got it</Button>
              </Jumbotron>
            </div>
          )}
      </div>
    )
  }
}
export default LottoLogo
