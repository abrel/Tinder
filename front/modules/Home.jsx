import React from 'react';

import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router'
import $ from 'jquery'
import request from 'request'
//import FacebookLogin from 'react-facebook-login'

const url = 'http://localhost:8081/';

const responseFacebook = (response) => {
  console.log(response);
}

const redirect_uri = 'https://www.facebook.com/connect/login_success.html';
const app_id = "464891386855067";

class Home extends React.Component {
	constructor() {
		super();
		this.connect.bind(this);
	}

	connect(event) {
		event.preventDefault();

		/*

		const url = 'https://m.facebook.com/v2.0/dialog/oauth?' ;

		const qs = { 
			redirect_uri: 'https://www.facebook.com/connect/login_success.html', 
			client_id: app_id,
			response_type: 'token',
			scope: 'basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details'
		};

		const headers = {
			'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
  			'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type'
		};

		request( {url, qs, headers, followRedirect:false }, function(err, response, body) {
	  		if (err) { console.error(err); }
	  		console.dir(response);
		});

		*/



		/*
		let ff = $.ajax({
			method: 'GET',
			url: url + 'facebook_connect',
			success: (response, status, request) => {
				console.log(response);
			},
			error: err => {
				console.error(err);
			}
		});
		*/

		/*
		ReactDOM.render(
  			<iframe id="fbFrame" src="about:blank;" border="0"></iframe>,
  			document.getElementById('a')
		);

		$("#fbFrame").attr("src", 'https://www.facebook.com/dialog/oauth?client_id=$464891386855067&response_type=token&redirect_uri=https://www.facebook.com/connect/login_success.html');

		let loc;
	    let _timer = setInterval(() => {
			loc = document.getElementById("fbFrame").contentWindow.location.href;
	    	console.log(loc);
			if ( /token/.test(window.location.href) ) {
				window.location.href = 'localhost:8080/Home';
				clearInterval(_timer);
			}
		}, 500);
	   */

		
		let fbWindow = window.open(
			`https://www.facebook.com/dialog/oauth?client_id=${app_id}&response_type=token&redirect_uri=${redirect_uri}`
			, ""
			, "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=200,width=500,height=500"
			, true
		);

		window.addEventListener("message", function(event){
    		console.log(event.data);
		});

		console.log(fbWindow.document.cookie);

		fbWindow.postMessage("Hi! I'm w2", "*");

		/*
		fbWindow.onload = function(newWindow) {
    		newWindow.console.log("...something...");
		}
	
		setTimeout(function() {
			console.log(window.location.href);
			//fbWindow.close();
		}, 5000);
		*/

		/*
		window.location.href = `https://www.facebook.com/dialog/oauth?client_id=${app_id}&response_type=token&redirect_uri=${redirect_uri}`;
		

		let _timer = setInterval(() => {
			console.log(window.location.href)
			if ( /token/.test(window.location.href) ) {
				window.location.href = 'localhost:8080/Home';
				clearInterval(_timer);
			}
		}, 500);
		*/
	}

	render() {
		return (
			<div>
				<p> Home </p>
				<button onClick={this.connect}> Facebook Connect </button>
				<div id="a"></div>
    		</div>
		)
	}
}

export default Home;

