
import React from 'react';
import Profile from './Profile.jsx';
import _ from 'lodash';
import $ from 'jquery';

const url = 'http://localhost:8081/';

class Recommendations extends React.Component {
	constructor() {
		super()

		this.state = {
			recs: []
		}
 
		this._hideProfile = this._hideProfile.bind(this);
	}

	componentWillMount() {
		this._fetchRecs();
	}

	_fetchRecs() {
		$.ajax({
			method: 'GET',
			url: url + 'recs',
			success: recs => {
				recs = this.state.recs.concat(recs);
				recs = _.uniqBy(recs, '_id');
				this.setState({ recs });
			},
			error: err => {
				console.error(err);
			}
		});
	}

	_hideProfile(id) {
		let recs = this.state.recs.filter(function(x) { return x._id !== id });
  		this.setState({ recs }) ;
	}

	render() {
		let data = this.state.recs.length ? this.state.recs : fakeData
		let rows = data.map( profile => {
			let data = {
				id: profile._id,
				name: profile.name,
				distance: Math.floor(profile.distance_mi * 1.60934),
				age: getAge(profile.birth_date),
				lastConTime: getLastConnectionTime(profile.ping_time),
				connections: profile.connection_count,
				photos: {
					id: profile.photos[0].id,
					url: profile.photos[0].url
				}
			};
			return <Profile key={profile._id} data={data} hide={this._hideProfile}/>
		});

		return (
			<div>
				<h2> Your recos </h2>
				{rows}
			</div>
		);
	}

	componentDidMount() {
		this._timer = setInterval(() => {
			if ( this.state.recs.length < 20 ) { this._fetchRecs(); }
		}, 5000);
	}

	componentWilUnmount() {
		clearInterval(this._timer);
	}
}

export default Recommendations;




let getAge = x => {

	return Math.floor( ( +new Date() - Date.parse(x) )  / ( 3600 * 1000 * 24 * 365 ) ) ;
}

let getLastConnectionTime = x => {
	let res =  ( new Date() - Date.parse(x) ) / ( 3600 * 1000 ) ;  
	if ( res < 1 ) {
		res = Math.floor( res * 60 );
		res += ' min(s) ago' ;
	} else if ( res < 24 ) {
		res = Math.floor(res);
		res += ' hour(s) ago' ;
	} else {
		res /= 24 ;
		res = Math.floor(res);
		res += ' day(s) ago' ; 
	}
	return res ;
}

const fakeData = [ 
	{ 
		distance_mi: 2,
	    connection_count: 162,
	    common_like_count: 0,
	    common_friend_count: 0,
	    common_likes: [],
	    common_interests: [],
	    uncommon_interests: [],
	    common_friends: [],
	    _id: '56e471f64d404da826cd77b0',
	    badges: [],
	    bio: '',
	    birth_date: '1981-05-26T15:12:26.808Z',
	    gender: 1,
	    name: 'Auré',
	    ping_time: '2016-05-23T12:17:30.668Z',
	    photos: 
	     [ { id: '759ae15b-cd3c-4833-a81b-6b7e03b3c709',
	         url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/759ae15b-cd3c-4833-a81b-6b7e03b3c709.jpg',
	         processedFiles: 
	          [ { width: 640,
	              height: 640,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/640x640_759ae15b-cd3c-4833-a81b-6b7e03b3c709.jpg' },
	            { width: 320,
	              height: 320,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/320x320_759ae15b-cd3c-4833-a81b-6b7e03b3c709.jpg' },
	            { width: 172,
	              height: 172,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/172x172_759ae15b-cd3c-4833-a81b-6b7e03b3c709.jpg' },
	            { width: 84,
	              height: 84,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/84x84_759ae15b-cd3c-4833-a81b-6b7e03b3c709.jpg' } ] },
	       { id: 'f2fe071d-b586-47d4-8d7d-6fb42fd5dc9b',
	         url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/f2fe071d-b586-47d4-8d7d-6fb42fd5dc9b.jpg',
	         processedFiles: 
	          [ { width: 640,
	              height: 640,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/640x640_f2fe071d-b586-47d4-8d7d-6fb42fd5dc9b.jpg' },
	            { width: 320,
	              height: 320,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/320x320_f2fe071d-b586-47d4-8d7d-6fb42fd5dc9b.jpg' },
	            { width: 172,
	              height: 172,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/172x172_f2fe071d-b586-47d4-8d7d-6fb42fd5dc9b.jpg' },
	            { width: 84,
	              height: 84,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/84x84_f2fe071d-b586-47d4-8d7d-6fb42fd5dc9b.jpg' } ] },
	       { id: '4e4d6085-89e9-4bac-872b-13302146b803',
	         url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/4e4d6085-89e9-4bac-872b-13302146b803.jpg',
	         processedFiles: 
	          [ { width: 640,
	              height: 640,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/640x640_4e4d6085-89e9-4bac-872b-13302146b803.jpg' },
	            { width: 320,
	              height: 320,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/320x320_4e4d6085-89e9-4bac-872b-13302146b803.jpg' },
	            { width: 172,
	              height: 172,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/172x172_4e4d6085-89e9-4bac-872b-13302146b803.jpg' },
	            { width: 84,
	              height: 84,
	              url: 'http://images.gotinder.com/56e471f64d404da826cd77b0/84x84_4e4d6085-89e9-4bac-872b-13302146b803.jpg' } ] } ],
	    jobs: [ { company: { name: 'éducation nationale' } } ],
	    schools: [],
	    teaser: { string: 'éducation nationale', type: 'position' },
	    birth_date_info: 'fuzzy birthdate active, not displaying real birth_date' 
	},
  	{ 
  		distance_mi: 4,
	    connection_count: 677,
	    common_like_count: 0,
	    common_friend_count: 0,
	    common_likes: [],
	    common_interests: [],
	    uncommon_interests: [],
	    common_friends: [],
	    _id: '563f4eda48081efe2583dff2',
	    badges: [],
	    bio: '',
	    birth_date: '1981-05-26T15:12:26.810Z',
	    gender: 1,
	    name: 'Elza',
	    ping_time: '2016-05-23T15:04:54.677Z',
	    photos: 
	     [ { id: '2447aef9-a0ca-4008-82c0-8b2595e432de',
	         url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/2447aef9-a0ca-4008-82c0-8b2595e432de.jpg',
	         processedFiles: 
	          [ { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/640x640_2447aef9-a0ca-4008-82c0-8b2595e432de.jpg',
	              height: 640,
	              width: 640 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/320x320_2447aef9-a0ca-4008-82c0-8b2595e432de.jpg',
	              height: 320,
	              width: 320 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/172x172_2447aef9-a0ca-4008-82c0-8b2595e432de.jpg',
	              height: 172,
	              width: 172 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/84x84_2447aef9-a0ca-4008-82c0-8b2595e432de.jpg',
	              height: 84,
	              width: 84 } ] },
	       { id: 'ddaa9bc0-14ab-4e19-9801-535c4659d982',
	         url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/ddaa9bc0-14ab-4e19-9801-535c4659d982.jpg',
	         processedFiles: 
	          [ { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/640x640_ddaa9bc0-14ab-4e19-9801-535c4659d982.jpg',
	              height: 640,
	              width: 640 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/320x320_ddaa9bc0-14ab-4e19-9801-535c4659d982.jpg',
	              height: 320,
	              width: 320 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/172x172_ddaa9bc0-14ab-4e19-9801-535c4659d982.jpg',
	              height: 172,
	              width: 172 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/84x84_ddaa9bc0-14ab-4e19-9801-535c4659d982.jpg',
	              height: 84,
	              width: 84 } ] },
	       { id: '17a05080-2c72-4aa8-81d5-937aba7e2748',
	         url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/17a05080-2c72-4aa8-81d5-937aba7e2748.jpg',
	         processedFiles: 
	          [ { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/640x640_17a05080-2c72-4aa8-81d5-937aba7e2748.jpg',
	              height: 640,
	              width: 640 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/320x320_17a05080-2c72-4aa8-81d5-937aba7e2748.jpg',
	              height: 320,
	              width: 320 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/172x172_17a05080-2c72-4aa8-81d5-937aba7e2748.jpg',
	              height: 172,
	              width: 172 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/84x84_17a05080-2c72-4aa8-81d5-937aba7e2748.jpg',
	              height: 84,
	              width: 84 } ] },
	       { id: '281724d5-23f5-4424-8db7-3b47bf522430',
	         url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/281724d5-23f5-4424-8db7-3b47bf522430.jpg',
	         processedFiles: 
	          [ { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/640x640_281724d5-23f5-4424-8db7-3b47bf522430.jpg',
	              height: 640,
	              width: 640 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/320x320_281724d5-23f5-4424-8db7-3b47bf522430.jpg',
	              height: 320,
	              width: 320 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/172x172_281724d5-23f5-4424-8db7-3b47bf522430.jpg',
	              height: 172,
	              width: 172 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/84x84_281724d5-23f5-4424-8db7-3b47bf522430.jpg',
	              height: 84,
	              width: 84 } ] },
	       { id: '146591ad-a889-4ca5-9c26-1ec0ea49ff66',
	         url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/146591ad-a889-4ca5-9c26-1ec0ea49ff66.jpg',
	         processedFiles: 
	          [ { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/640x640_146591ad-a889-4ca5-9c26-1ec0ea49ff66.jpg',
	              height: 640,
	              width: 640 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/320x320_146591ad-a889-4ca5-9c26-1ec0ea49ff66.jpg',
	              height: 320,
	              width: 320 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/172x172_146591ad-a889-4ca5-9c26-1ec0ea49ff66.jpg',
	              height: 172,
	              width: 172 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/84x84_146591ad-a889-4ca5-9c26-1ec0ea49ff66.jpg',
	              height: 84,
	              width: 84 } ] },
	       { id: '53fd1fcd-dc6d-4737-811a-2da6c763a945',
	         url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/53fd1fcd-dc6d-4737-811a-2da6c763a945.jpg',
	         processedFiles: 
	          [ { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/640x640_53fd1fcd-dc6d-4737-811a-2da6c763a945.jpg',
	              height: 640,
	              width: 640 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/320x320_53fd1fcd-dc6d-4737-811a-2da6c763a945.jpg',
	              height: 320,
	              width: 320 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/172x172_53fd1fcd-dc6d-4737-811a-2da6c763a945.jpg',
	              height: 172,
	              width: 172 },
	            { url: 'http://images.gotinder.com/563f4eda48081efe2583dff2/84x84_53fd1fcd-dc6d-4737-811a-2da6c763a945.jpg',
	              height: 84,
	              width: 84 } 
	        ] 
	   	} 
	],
    jobs: [ 
    	{ company: 
    		{ 
    			name: 'Signature Flight Support LBG - Paris Le Bourget Airport' 
    	},
         title: { name: 'Lead Customer Service Representative' } } ],
    schools: [],
    teaser: 
     { string: 'Lead Customer Service Representative at Signature Flight Support LBG - Paris Le Bourget Airport',
       type: 'jobPosition' },
    birth_date_info: 'fuzzy birthdate active, not displaying real birth_date' }
] ;

