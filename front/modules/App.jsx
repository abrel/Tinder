import React from 'react'
import NavLink from './NavLink.jsx'
import classNames from 'classnames';
import styles from '../css/main.scss'

class App extends React.Component {
  render() {
    return (
      <div className={ app }>
        <h1>Tinder, the unofficial website</h1>
        <ul role="nav">
        	<li><NavLink to="/" onlyActiveOnIndex={true}>Home</NavLink></li>
          	<li><NavLink to="/Recos">Recos</NavLink></li>
        </ul>
         {this.props.children}
      </div>
    )
  }
}

export default App;

//css classes

let app = classNames({
    'app': true
});