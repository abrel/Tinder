import React from 'react'
import { Link } from 'react-router'
import styles from '../css/nav.css';


class NavLink extends React.Component {
	render() {
		return <Link {...this.props} activeClassName={ styles.active }></Link>
	}
}

export default NavLink;

