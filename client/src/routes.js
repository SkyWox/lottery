import React from 'react'
import { Route, IndexRoute } from 'react-router'
// https://stackoverflow.com/questions/41956465/how-to-create-multiple-page-app-using-react

/**
 * Import all page components here
 */
import App from './components/App'
//import MainPage from './components/MainPage'
//import SomePage from './components/SomePage'

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 Removed:
 <IndexRoute component={MainPage} />
 <Route path="/some/where" component={SomePage} />
 <Route path="/some/otherpage" component={SomeOtherPage} />
 */

export default <Route path="/" component={App} />
