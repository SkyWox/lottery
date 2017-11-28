import React, { Component } from 'react'
const powerball = require('../images/powerball.png')
const megamillions = require('../images/megamillions.png')
class LottoLogo extends Component {
	render() {
		var source = ''
		var alternate = ''

		switch (this.props.lottoname) {
			case 'powerball':
				source = powerball
				alternate = 'Powerball'
				break
			case 'megamil':
				source = megamillions
				alternate = 'Mega Millions'
		}
		return <img src={source} style={{ maxHeight: '60px' }} alt={alternate} />
	}
}

export default LottoLogo
