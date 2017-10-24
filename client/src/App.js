import React, { Component } from 'react';
import './App.css';
import TicketContainer from './TicketContainer.js'

class App extends Component {

    componentWillMount(){
      this.setState({
        //default list to speed loading
        nameDrop : ['powerball', 'superlplus', 'megamill'],
        propDrop : ['Powerball', 'Super Lotto Plus', 'Mega Millions'],
        tickets : [],
      //can't use an async here or first render will be undefined
      lottoname: 'powerball',
      proper : 'Powerball'
      })
    }

  componentDidMount() {
    this.addTicket(false)
    /*
    var requestURL = new Request('/api/lottolist')
    fetch(requestURL)
    .then(res => res.json())
    .then(res => {
      this.setState({
      nameDrop : xx, propDrop})
    })
    .catch()
    */

  }

  async update(obj){
    await this.setState(obj)
    this.addTicket(false)
  }

  //arrow functions preserve this binding for calling w/in components
  //https://daveceddia.com/avoid-bind-when-passing-props/
    addTicket (mintBool) {
    var ticketArray = this.state.tickets
    ticketArray.push({
      key : (new Date()).getTime(),
      lottoname : this.state.lottoname,
      mint : mintBool
    })

    this.setState({ tickets: ticketArray })
    }

    async getSpecs (name) {
      var specs = {}
      await fetch('/specs?name=' + name)
      .then(res => res.json())
      .then(function(res){ specs = res })
      .catch()
      return specs
    }

    remove(array, element) {
      return array.filter(e => e !== element);
    }

  render() {
    //remove the current one so it's just the other lottos
    var currNameDrop = this.remove(this.state.nameDrop, this.state.lottoname)
    var currPropDrop = this.remove(this.state.propDrop, this.state.proper)
    return (
      <div className="App">
        <div>
          <h1>
              <div className="dropdown">
                  <button className="dropbtn">{this.state.proper}</button>
                    <div className="dropdown-content">
                      {currNameDrop.map((name, index) =>
                        <a key = {index} onClick={() => this.update({
                            lottoname : currNameDrop[index],
                            proper : currPropDrop[index],
                            tickets : []})}
                            value = {name}>
                            {currPropDrop[index]}
                        </a>
                    )}
                    </div>
              </div>
              Lucky Numbers</h1>
            {this.state.tickets.map((timestamp, index) =>
                <TicketContainer key = {index} num = {index}
                  lottoname = {this.state.lottoname} mint = {timestamp.mint}/>
            )}
                <button
                  className="addTicket"
                  onClick={() => this.addTicket(false)}>
                  + Add Ticket
                </button>
                <button
                  className="addTicket"
                  onClick={() => this.addTicket(true)}>
                  + Add Fresh Ticket
                </button>
          </div>
      </div>
    );
  }

}

export default App;
