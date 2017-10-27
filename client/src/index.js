import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import MainPage from './components/MainPage'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
	<Router>
		<MainPage />
	</Router>,
	document.getElementById('root')
)
registerServiceWorker()
