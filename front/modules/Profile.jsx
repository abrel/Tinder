import React from 'react';
import classNames from 'classnames';
import { ButtonToolbar, Button } from 'react-bootstrap';
import styles from '../css/profile.scss';
import $ from 'jquery';

const url = 'http://localhost:8081/';

class BrowsedProfile extends React.Component {
	constructor() {
		super();
		this.rewind = this.rewind.bind(this);
		this.pass = this.pass.bind(this);
		this.like = this.like.bind(this);
		this.superLike = this.superLike.bind(this);
		this.getPreciseLocation = this.getPreciseLocation.bind(this);
	}

	rewind(e) {
		console.log('rewind');
	}

	pass(e) {
		this.props.hide(this.props.data.id);

		$.ajax({
			method: 'POST',
			url: url + 'pass',
    		contentType: "application/json",
			data: JSON.stringify({
				userId: this.props.data.id,
				photoId: this.props.data.photos.id
			}),
			success: result => {
				console.log('passed');
			},
			error: err => {
				console.error(err);
			}
		});
	}

	like(e) {
		this.props.hide(this.props.data.id);
		$.ajax({
			method: 'POST',
			url: url + 'like',
    		contentType: "application/json",
			data: JSON.stringify({
				userId: this.props.data.id,
				photoId: this.props.data.photos.id
			}),
			success: result => {
				if ( result.match ) { alert("matched"); }
				console.log('liked');
			},
			error: err => {
				console.error(err);
			}
		});
	}

	superLike(e) {
		this.props.hide(this.props.data.id);
		$.ajax({
			method: 'POST',
			url: url + 'superLike',
    		contentType: "application/json",
			data: JSON.stringify({
				userId: this.props.data.id,
				photoId: this.props.data.photos.id
			}),
			success: result => {
				console.log('remaining', result.super_likes.remaining);
				if ( result.match ) { alert("matched"); }
			},
			error: err => {
				console.error(err);
			}
		});
	}

	getPreciseLocation(e) {
		console.log('get precise location');
	}

	render() {

		return(
			<div className={profile}>
				<p className={infoLight}> {this.props.data.connections} connections </p>
				<p className={infoLight}> was active {this.props.data.lastConTime} </p>
				<img src={this.props.data.photos.url} alt={this.props.name} className={picture} /> 
				<p className={info}> 
					{this.props.data.name}, {this.props.data.age} years old -
					<span> {this.props.data.distance} km away </span>
				</p>
		
				<div className={actions}>
					<ul>
						{/*<Button onClick={this.rewind} bsStyle="default" bsSize="small"> Rewind </Button>*/}
						<li><Button onClick={this.pass} bsStyle="danger" bsSize="small"> Pass </Button></li>
					 	<li><Button onClick={this.like} bsStyle="success" bsSize="small">Like</Button></li>
						<li><Button onClick={this.superLike} bsStyle="primary" bsSize="small"> Super Like </Button></li>
						<li><Button onClick={this.getPreciseLocation} bsStyle="info" bsSize="small"> Location </Button></li> 
					</ul>
				</div>
			</div>

		);
	}
}

export default BrowsedProfile ;

//css classes

let profile = classNames({
    'profile': true
});

let info = classNames({
    'info': true,
    'group': true
});

let infoLight = classNames({
    'info-light': true,
    'group': true
});

let picture = classNames({
    'picture': true,
    'group': true
});

let actions = classNames({
    'actions': true
});



