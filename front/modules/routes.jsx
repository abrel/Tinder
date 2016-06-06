
import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './App.jsx'
import Home from './Home.jsx'
import Recommendations from './Recommendations.jsx'


module.exports = (
  	<Route path="/" component={App}>
    	<IndexRoute component={Home}/>
    	<Route path="/Recos" component={Recommendations}/>
  	</Route>

)

