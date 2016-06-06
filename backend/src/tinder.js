"use strict";

let request = require('request');
const async = require('async');
const _ = require('lodash');
const Mercator = require('./mercator').Mercator;
const haversine = require('./mercator').haversine;

class Tinder {

	static isSignedIn(self, callback)  {
		if ( !self.TINDER_TOKEN ) { return callback(new Error(`You need to sign in first!`)); }
		return;
	}

	constructor({ FACEBOOK_ID, FACEBOOK_TOKEN, TINDER_TOKEN }) {
		if ( !FACEBOOK_ID || !FACEBOOK_TOKEN ) {
			let errorMessage = `Invalid Usage! You need to call new Tinder(FACEBOOK_ID, FACEBOOK_TOKEN)`;
			return new Error(errorMessage);
		}
		this.FACEBOOK_ID = FACEBOOK_ID;
		this.FACEBOOK_TOKEN = FACEBOOK_TOKEN;
		//this.TINDER_TOKEN = TINDER_TOKEN;
		this.lastUpdate = null;
		this.position = null;
		this.minPrecision = 0.5;

		this.url = 'https://api.gotinder.com';

		this.options = {
			timeout: 15000, 
        	pool:false,
        	gzip: true,
        	headers: {
        		'User-Agent': 'Tinder/5.0.2 (iPhone; iOS 9.2.1; Scale/2.00)'
        	}
		};

		this.authHeaders = {
			headers: {
				'User-Agent': 'Tinder/5.0.2 (iPhone; iOS 9.2.1; Scale/2.00)',
				'X-Auth-Token' : this.TINDER_TOKEN,
				Authorization: `Token token="${this.TINDER_TOKEN}"`
			}
		};
	}

	signIn(callback) {
		if ( this.TINDER_TOKEN ) { return callback(); }

		let options = Object.assign({}, this.options, {
        	method: 'POST',
        	url: ( this.url + '/auth' ),
        	json: {
				"locale": "fr-FR",
				"force_refresh": false,
				"facebook_token": this.FACEBOOK_TOKEN,
				"facebook_id": this.FACEBOOK_ID
        	}
		});

		request(options, (err, response, body) => {
			console.log(`Token: ${body.token}`);
			handleRequestResponse(err, response, callback);
			if (err) { return; }

			this.TINDER_TOKEN = body.token;
			this.authHeaders = {
				headers: {
					'X-Auth-Token' : this.TINDER_TOKEN,
					Authorization: `Token token=${this.TINDER_TOKEN}`
				}
			};

			return callback(null, body);
		});
	}

	getUpdates(lastUpdate, callback) {
		this.constructor.isSignedIn(this, callback);
		let options = Object.assign({}, this.options, this.authHeaders, {
        	method: 'POST',
        	timeout: 200000,
        	url: ( this.url + '/updates' ),
        	json: {
				last_activity_date: ( lastUpdate ? lastUpdate.toJSON() : this.lastUpdate )
        	}
		});

		request(options, (err, response, body) => {
			handleRequestResponse(err, response, callback);
			if (err) { return; }
			this.lastUpdate = new Date();
			return callback(null, body);
		});
	}

	ping({lat, lon}, callback) {
		this.constructor.isSignedIn(this, callback);
		if ( !lat || !lon ) { return callback(new Error(`Please input valid {lat, lon} object`)) }

		let options = Object.assign({}, this.options, this.authHeaders, {
        	method: 'POST',
        	url: ( this.url + '/user/ping' ),
        	json: { lon, lat }
		});

		request(options, (err, response, body) => {
			if ( body.error ) { err = new Error(body.error); }
			handleRequestResponse(err, response, callback);
			if (err) { return; }
			this.position = { lat, lon };
			return callback();
		});
	}

	updateUserProfile(profile, callback) {
		this.constructor.isSignedIn(this, callback);
		if ( !profile ) { 
			return callback(new Error(
				`Profile Object was empty: Possible variables:
					- distance_filter: [2,160]
					- gender: [0,1] (male, female)
					- age_filter_min: 18
					- age_filter_max: 1000
					- gender_filter: [-1, 0, 1] (males & females, males, females)
					- bio: String`
			)); 
		}
		
		let options = Object.assign({}, this.options, this.authHeaders, {
        	method: 'POST',
        	url: ( this.url + '/profile' ),
        	json: profile
		});

		request(options, (err, response, body) => {
			handleRequestResponse(err, response, callback);
			if (err) { return; }
			return callback();
		});
	}

	getRecommendations(callback) {
		this.constructor.isSignedIn(this, callback);

		let options = Object.assign({}, this.options, this.authHeaders, {
        	method: 'GET',
        	url: ( this.url + '/user/recs?locale=fr-FR' )
		});

		request(options, (err, response, body) => {
			handleRequestResponse(err, response, callback);
			if (err) { return; }
			return callback(null, JSON.parse(body));
		});
	}

	getInfoForUser(userId, callback) {
		this.constructor.isSignedIn(this, callback);

		let options = Object.assign({}, this.options, this.authHeaders, {
        	method: 'GET',
        	url: ( this.url + '/user/' + userId )
		});

		request(options, (err, response, body) => {
			handleRequestResponse(err, response, callback);
			if (err) { return; }
			return callback(null, body);
		});
	}

	like({ userId, firstPhotoId }, callback) {
		this.constructor.isSignedIn(this, callback);
		if ( !userId || !firstPhotoId ) { return callback(new Error('Wrong usage')); }

		let options = Object.assign({}, this.options, this.authHeaders, {
        	method: 'GET',
        	url: ( `${this.url}/like/${userId}?firstPhotoID=${firstPhotoId}` )
		});

		request(options, (err, response, body) => {
			handleRequestResponse(err, response, callback);
			if (err) { return callback(err); }
			return callback(null, JSON.parse(body));
		});
	}

	superLike({ userId, firstPhotoId }, callback) {
		this.constructor.isSignedIn(this, callback);
		if ( !userId || !firstPhotoId ) { return callback(new Error('Wrong usage')); }

		let options = Object.assign({}, this.options, this.authHeaders, {
        	method: 'POST',
        	url: ( `${this.url}/like/${userId}/super?firstPhotoID=${firstPhotoId}` ),
        	json: { firstPhotoId }
		});

		request(options, (err, response, body) => {
			handleRequestResponse(err, response, callback);
			if (err) { return callback(err); }
			return callback(null, body);
		});
	}

	pass({ userId, firstPhotoId }, callback) {
		this.constructor.isSignedIn(this, callback);
		if ( !userId || !firstPhotoId ) { return callback(new Error('Wrong usage')); }

		let options = Object.assign({}, this.options, this.authHeaders, {
        	method: 'GET',
        	url: ( `${this.url}/pass/${userId}?firstPhotoID=${firstPhotoId}` )
		});

		request(options, (err, response, body) => {
			handleRequestResponse(err, response, callback);
			if (err) { return; }
			return callback(null, JSON.parse(body));
		});
	}

	sendMessage({ matchId, message }, callback) {
		this.constructor.isSignedIn(this, callback);
		if (! _from_ || ! _to_ || ! message) {
			return callback(new Error(`Invalid parameters: ${ {matchId, message} }`));
		}

		let options = Object.assign({}, this.options, this.authHeaders, {
        	method: 'GET',
        	url: ( `${this.url}/user/matches/${matchId}` ),
        	json: { message }
		});

		request(options, (err, response, body) => {
			handleRequestResponse(err, response, callback);
			if (err) { return; }
			return callback(null, body);
		});
	}

	findPreciseLocalization(userId, fullPrecision, callback) {
		this.constructor.isSignedIn(this, callback);

		let self = this;
		let ini = [] ;

		async.waterfall([
			function(cb) {
				iterateOnLocation(self, userId, ini, fullPrecision, function(err, result) {
					return cb(err, result);
				});
			},

			function(result, cb) {
				reverseGeocode({lat: result.lat, lon: result.lon}, function(err, address) {
					result.address = address ;
					return cb(err, result);
				});
			}

		], function(err, result) {
			return callback(err, result);
		});
	}

	findPreciseUser({name, ageStartsAt, ageEndsAt, gender, location}, callback) {
		this.constructor.isSignedIn(this, callback);
		let self = this;

		async.waterfall([

			function(cb) {
				// modify profile
				let profile = {
					distance_filter: 2,
					age_filter_min: ( ageStartsAt - 2 ),
					age_filter_max: ageEndsAt,
					gender_filter: gender,
					gender: ( 1 - gender )
				};
				self.updateUserProfile(profile, function(err) {
					return cb(err);
				}) 
			},

			function(cb) {
				// proceed to geocoding
				geocode(location, function(err, result) {
					return cb(err, result)
				});
			},

			function(coords, cb) {
				// change location
				self.ping(coords, function(err) {
					if ( err && err.message === 'position change not significant') { 
						err = null;
						console.log('position change not significant');
					}
					return cb(err);
				});
			},

			function(cb) {
				// get valid recommendations
				let res = [];
				let iter = 0;
				iterateOnPersonName(self, name, res, iter, function(err, persons) {
					return cb(err, persons);
				});
			}

		], function(err, persons) {
			return callback(err, persons);
		});
	}

	likeEveryOneUpTo(counter, limit, callback) {
		let self = this;

		self.getRecommendations(function(err, recs) {
			if (err) { return callback(err); }
			if ( recs.message ) { 
				let err = new Error(recs.message);
				return callback(err); 
			}
			recs = recs.results.map(function(x) {
				return {
					userId: x._id,
					firstPhotoId: x.photos[0].id
				};
			});
			counter += recs.length;
			async.eachSeries(recs, self.like.bind(self), function(err) {
				if (err) { return callback(err); }
				console.log(counter + ' profiles liked!');

				if ( counter > limit ) { return callback(); } 
				else { self.likeEveryOneUpTo(counter, limit, callback); }
			});
		});
	}

	likeEveryOne(limit, callback) {
		this.constructor.isSignedIn(this, callback);
		let self = this;
		let counter = 0;

		self.likeEveryOneUpTo(counter, limit, function(err) {
			return callback(err);
		});
	}

	useUpAllSuperLikes(minAge, callback) {
		this.constructor.isSignedIn(this, callback);
		let self = this;

		self.getRecommendations(function(err, recs) {
			if (err) { return callback(err); }
			if ( recs.message ) { 
				let err = new Error(recs.message);
				return callback(err); 
			}
			recs = recs.results.map(function(x) {
				return {
					userId: x._id,
					firstPhotoId: x.photos[0].id,
					age: getAge(x.birth_date),
					connections: x.connection_count
				};
			});
			
			recs = recs.filter(function(x) {
				return x.age > minAge && x.connections > 100 ;
			});

			if ( !recs.length ) { return self.useUpAllSuperLikes(minAge, callback); }

			async.mapSeries(recs, self.superLike.bind(self), function(err, results) {
				if (err) { return callback(err); }

				let remaining = results[results.length - 1];
				if ( remaining ) { self.useUpAllSuperLikes(minAge, callback); } 
				else { return callback(); }
			});
		});
	}
}


module.exports.Tinder = Tinder;


let handleRequestResponse = (err, response, callback) => {
	if ( err ) { return callback(err); }
	if ( response && response.statusCode !== 200 ) { return callback(new Error(`Wrong status code: ${response.statusCode}`)) ; }
	return;
}

function switchPos(self, res, callback) {
	// Default to Paris coordinates
	let lat = 48.85 ;
	let lon = 2.34 ;
	
	if ( res.length ) { 
		
		// orientation
		let theta = randomNumber(0.1, 0.9) * Math.PI ;

		// we move by 0.15 deg
		let jump = 0.15;

		lat = lat + jump * Math.cos(theta);
		lon = lon + jump * Math.sin(theta);
	} 

	self.ping({lat, lon}, function(err) {
		return callback(err);
	});
}

function tryAnotherPoint(self, userId, res, callback) {

	async.series([
		function(cb) {
			//1. switch position
			switchPos(self, res, function(err) {
				return cb(err);
			});
		},

		function(cb) {
			//2. get a first distance radius
			self.getInfoForUser(userId, function(err, user) {
				if (err) { return cb(err) ; }
				user = JSON.parse(user);

				let distance = miles2Km(user.results.distance_mi) ;
				let lat = self.position.lat;
				let lon = self.position.lon;
				let isValid = false;

				res.push({ lat, lon, distance, isValid });
				return cb();
			});
		}
	], function(err) {
		return callback(err, res);
	});
}

function iterateOnPersonName(self, name, res, iter, callback) {
	console.log('iterateOnPersonName');
	self.getRecommendations(function(err, recs) {
		if (err) { return cb(err); }
		console.log(recs.message || recs.results.map(function(x) { 
			return ( x.name + ' - ' + x._id + ' - ' + getAge(x.birth_date) + ' - ' + ( x.distance_mi * 1.6 ) );
		}));
		
		if ( recs && /exhausted|timeout/.test(recs.message) ) { 
			iter++;
			if ( iter > 5 ) { return callback(null, res); }
			console.log('timeout - 2 secs');
			setTimeout(function() {
				iterateOnPersonName(self, name, res, iter, callback);
			}, 2000)
		} else {
			iter = 0;
			res = res.concat(recs.results.filter(function(rec) {
				return name.test(rec.name) /*&& rec.distance_mi < 4*/ ;
			}).map(function(x) {
				return {
					name: x.name,
					id: x._id,
					connection_count: x.connection_count,
					distance: x.distance_mi * 1.6,
					birth_date: x.birth_date,
					ping_time: x.ping_time,
					photos: x.photos[0],
					bio: x.bio
				}
			}));

			if ( res.length > 30 ) {
				return callback(null, res);
			} else {
				let scapegoat = recs.results.filter(function(x) {
					return !name.test(x.name) ;
				});

				async.eachSeries(scapegoat, function(x, cb) {
					let alea = randomNumber(0,10) ;
					if ( alea >= 0 ) {
						self.pass({ userId: x._id, firstPhotoId: x.photos[0].id }, function(err) {
							return cb(err); 
						});
					} else {
						self.like({ userId: x._id, firstPhotoId: x.photos[0].id }, function(err) {
							return cb(err); 
						});
					} 
				}, function(err) {
					if ( err && err.message === 'Wrong status code: 429' ) { 
						console.log('too many requests');
						err = null;
					}
					if (err) { return callback(err); }
					return iterateOnPersonName(self, name, res, iter, callback);
				});
			}
		}
	});
}

function getUserRoughLocation(self, userId, res, callback) {

	async.series([	

		function(cb) {
			tryAnotherPoint(self, userId, res, function(err) {
				return cb(err);
			});
		},

		function(cb) {
			let _res_ = res.filter(function(x) {
				return !x.isValid;
			});
			let l = _res_.length;
			if ( l < 3 ) { return cb() ; }

			// triangulation with the three most accurate points
			let p1 = _res_[l-3];
			let p2 = _res_[l-2];
			let p3 = _res_[l-1];

			let firstCandidates = intersection(p1, p2);
			let secondCandidates = intersection(p2, p3);
			let thirdCandidates = intersection(p3, p1);

			let candidates = [];
			if ( firstCandidates ) { candidates = candidates.concat(firstCandidates) ; }
			if ( secondCandidates ) { candidates = candidates.concat(secondCandidates) ; }
			if ( thirdCandidates ) { candidates = candidates.concat(thirdCandidates) ; }

			let cl = candidates.length;

			if ( cl < 6 ) { return cb(new Error("No intersection could be found!")); }

			let i,j,tmp;
			let distMap = {} ;
			for ( i = 0; i< cl; i++ ) { distMap[i] = []; }

			for ( i = 0; i < (cl-1) ; i++ ) {
				for ( j = (i+1); j < cl ; j++ ) {
					tmp = haversine({ p1:candidates[i], p2:candidates[j] }) ; // km
					distMap[i].push(tmp);
					distMap[j].push(tmp);
				}
			}

			let strongCandidates = [];
			let triangulatedDistance = 0;
			let s1, s2;
			for ( i = 0; i < cl; i+=2 ) { 
				s1 = _.sortBy(distMap[i]);
				s2 = _.sortBy(distMap[i+1]);
				tmp =  s1[0] < s2[0] ? i : (i+1) ;
				strongCandidates.push(candidates[tmp]);

				// distance
				if ( tmp === i ) {
					triangulatedDistance += ( s1[0] + s1[1] ) / 2 ;
				} else {
					triangulatedDistance += ( s2[0] + s2[1] ) / 2 ;
				}
			}	

			triangulatedDistance = 	triangulatedDistance / 3 * Math.sqrt(2) / 2 * ( 2 / 3 ) ;	

			res.push({ 
				lat: _.meanBy(strongCandidates, 'lat'),
  				lon: _.meanBy(strongCandidates, 'lon'),
  				distance: triangulatedDistance,
  				isValid: true
  			});

  			return cb();
		}
		
	], function(err) {
		// sort our array
		res = _.orderBy(res, ['isValid', 'distance'], ['desc', 'asc']);
		return callback(err, res);
	});
}

function iterateOnLocation(self, userId, ini, fullPrecision, callback) {
	getUserRoughLocation(self, userId, ini, function(err, result) {
		if ( err && err.message !== "No intersection could be found!" ) { 
			console.error(err);
			return callback(err); 
		}

		console.log('------- new iteration -------');
		console.dir(result);
		console.log('------- end iteration -------');

		let validResults;
		let l;
		let newDistance;

		if ( fullPrecision ) { 
			validResults = result.filter(function(x) { return x.isValid;}) 
			l = validResults.length ;
			if ( l ) { newDistance = _.meanBy(validResults, 'distance') * 2 / Math.sqrt(l) ; }
		}

		if ( !fullPrecision && result.length && result[0].isValid ) {
			return callback(null, result[0]);

		} else if ( fullPrecision && result.length && result[0].distance < self.minPrecision ) {
			return callback(null, result[0]);

		} else if ( fullPrecision && newDistance && newDistance < self.minPrecision ) {
			return callback(null, {
				lat: _.meanBy(validResults, 'lat'),
  				lon: _.meanBy(validResults, 'lon'),
  				distance: newDistance,
  				isValid: true
			});

		} else {
			iterateOnLocation(self, userId, result, fullPrecision, callback) ;
		}
	});
}

function intersection(sp1, sp2) {

	// sp1
	let xy1 = Mercator.toMercator(sp1);
	let x1 = xy1.x ;
	let y1 = xy1.y ;
	let r1 = sp1.distance / Math.cos( sp1.lat * Mercator.DEG2RAD ) * 1000; // in meters


	// sp2
	let xy2 = Mercator.toMercator(sp2);
	let x2 = xy2.x ;
	let y2 = xy2.y ;
	let r2 = sp2.distance / Math.cos( sp2.lat * Mercator.DEG2RAD ) * 1000; // in meters

	
	// ini
	let d, dx, dy, a, x, y, h, rx, ry;

    dx = x2 - x1;
    dy = y2 - y1;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt( (dx*dx) + (dy*dy) );

    /* Check for solvability. */
    if ( d > (r1 + r2) ) { 
    	console.log(`circles do not intersect:     		
    		r1 = ${r1}
    		r2 = ${r2}
    		d = ${d}`
    	);
    	console.log(`circle 1: lat = ${sp1.lat}  lon = ${sp1.lon}  dist = ${sp1.distance*1000}`);
    	console.log(`circle 2: lat = ${sp2.lat}  lon = ${sp2.lon}  dist = ${sp2.distance*1000}`);
    	return false; 
    }


    if ( d < Math.abs(r1 - r2)  ) { 
    	console.log(`no solution. one circle is contained in the other:
    		r1 = ${r1}
    		r2 = ${r2}
    		d = ${d}`
    	);
    	console.log(`circle 1: lat = ${sp1.lat}  lon = ${sp1.lon}  dist = ${sp1.distance*1000}`);
    	console.log(`circle 2: lat = ${sp2.lat}  lon = ${sp2.lon}  dist = ${sp2.distance*1000}`);
    	return false;
    } 
    
    /* Calculations */
    a = ((r1*r1) - (r2*r2) + (d*d)) / (2.0 * d) ;
    x = x1 + (dx * a/d);
    y = y1 + (dy * a/d);
    h = Math.sqrt((r1*r1) - (a*a));
    rx = -dy * (h/d);
    ry = dx * (h/d);

    let x_i = x + rx;
    let x_i_prime = x - rx;
    let y_i = y + ry;
    let y_i_prime = y - ry;

    let result = [ Mercator.toLatLon( { x:x_i, y:y_i } ), Mercator.toLatLon( { x:x_i_prime, y:y_i_prime } )];

    return result;
}

function miles2Km(d) {
	// 1 miles = 1.60934 km
	return ( d * 1.60934 ) ;
}

function randomNumber(min, max) {

    return Math.random() * (max - min) + min;
}

function reverseGeocode( {lat, lon}, callback ) {

  	let options = {
        method: 'GET',
        url: "http://maps.googleapis.com/maps/api/geocode/json",
        qs: {
        	latlng: lat + ',' + lon,
        	sensor: true
        }
	};

  	request(options, (err, response, body) => {
  		handleRequestResponse(err, response, callback);

    	try { var result = JSON.parse(body); } 
    	catch (err) { return callback(err); }

    	result = result.results[0].formatted_address ;
    	return callback(null, result);
 	 });
}

function geocode(address, callback) {
  	let options = {
        method: 'GET',
        url: "http://maps.googleapis.com/maps/api/geocode/json",
        qs: {
        	address: address,
        	sensor: true
        }
	};

  	request(options, (err, response, body) => {
  		handleRequestResponse(err, response, callback);

    	try { var result = JSON.parse(body); } 
    	catch (err) { return callback(err); }

    	result = result.results[0].geometry.location ;

    	return callback(null, {
    		lat: result.lat,
    		lon: result.lng
    	});
 	});
}

function getAge(x) {

	return Math.floor( ( +new Date() - Date.parse(x) )  / ( 3600 * 1000 * 24 * 365 ) ) ;
}




  








