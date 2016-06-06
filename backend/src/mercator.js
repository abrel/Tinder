"use strict";

const assert = require('assert');

var Mercator = {

	r_major: 6378137.0, // Equatorial Radius, WGS84
	r_minor: 6356752.314245179, 
	f: 298.257223563, // 1/f=(a-b)/a , a=r_major, b=r_minor
	DEG2RAD: Math.PI / 180,

	findMidPoint: function( {p1, p2} ) {

		//convert to radians
    	let lat1 = p1.lat * DEG2RAD;
    	let lat2 = p2.lat * DEG2RAD;
    	let lon1 = p1.lon * DEG2RAD;
    	let lon2 = p2.lon * DEG2RAD;

    	let dLon = lon2 - lon1;
    	let Bx = Math.cos(lat2) * Math.cos(dLon);
    	let By = Math.cos(lat2) * Math.sin(dLon);

    	let lat = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
    	let lon = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

    	return { lat, lon } ;
	},

	toMercator: function( { lat, lon } ) {

		// boundings
		if (lat > 89.5) { lat = 89.5 };
		if (lat < -89.5) { lat = -89.5 };

		//lat, lon in rad
		lat = lat * this.DEG2RAD;
		lon = lon * this.DEG2RAD;

		let x = this.r_major * lon;
		let temp = this.r_minor / this.r_major;
		let eccent = Math.sqrt(  1.0 - (temp * temp) );

		let con = eccent * Math.sin(lat);
		con = Math.pow((1.0-con)/(1.0+con), .5 * eccent);
		let ts = Math.tan(.5 * (Math.PI*0.5 - lat)) / con;
		let y = 0 - this.r_major * Math.log(ts);

		return { x, y };
	},

	mercatorDistance: function( { xy1, xy2, latlon1, latlon2 } ) {
		let mid = this.findMidPoint( { p1:latlon1, p2:latlon2 } );
		return ( distance({p1: xy1, p2:xy2}) * Math.cos( mid.lat * this.DEG2RAD ) ) ;
	},

	mercatorRhumbDistance: function( { d, latlon1, latlon2 } ) {
		let mid = this.findMidPoint( { p1:latlon1, p2:latlon2 } );
		return d * Math.cos( mid.lat * this.DEG2RAD ) ;
	},

	toLatLon: function( { x,y } ) {
		let lon = x / this.r_major / this.DEG2RAD; // in degrees
							
		let temp = this.r_minor / this.r_major;
		let e = Math.sqrt(1.0 - (temp * temp));
		let lat = pj_phi2( Math.exp( 0 - ( y / this.r_major ) ), e ) / this.DEG2RAD; // in degrees
		
		return { lat, lon };
	},

	test: function( { lat, lon } = { } ) {
		lat = lat || 9.770602 ;
		lon = lon ||  47.6035525 ;

		let xy = this.toMercator( {lat, lon} );
		let latlon = this.toLatLon(xy);
		console.log(
			`
			lat:${lat} , lon:${lon}
			x:${xy.x}, y:${xy.y}
			newLat:${latlon.lat} , newLon:${latlon.lon}
			` 
		);
		assert(Math.abs(latlon.lat - lat) < 0.001 && Math.abs(latlon.lon - lon) < 0.001, 'Mercator is reversible');
	}
};

var haversine = function( { p1, p2 } ) {
	let R = 6371 ;
	let DEG2RAD = Math.PI / 180 ;

	let lat1 = p1.lat * DEG2RAD ; 
	let lon1 = p1.lon * DEG2RAD ;
	let lat2 = p2.lat * DEG2RAD ; 
	let lon2 = p2.lon * DEG2RAD ; 

	let dlat = lat2 - lat1 ;
	let dlon = lon2 - lon1 ;
  	let a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2) * Math.sin(dlon/2) ;
  	
  	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) ;
};


module.exports.Mercator = Mercator;
module.exports.haversine = haversine;


function pj_phi2(ts, e) {
	const N_ITER = 15;
	const HALFPI = Math.PI / 2;
	const TOL=0.0000000001;

	let con, dphi;

	let eccnth = .5 * e;
	let Phi = HALFPI - 2. * Math.atan (ts);
	let i = N_ITER;
	
	do {
		con = e * Math.sin (Phi);
		dphi = HALFPI - 2. * Math.atan (ts * Math.pow((1. - con) / (1. + con), eccnth)) - Phi;
		Phi += dphi;

	} while ( Math.abs(dphi)>TOL && --i);

	return Phi;
}

function distance( {p1, p2} ) {
	let dx = p1.x-p2.x;
	let dy = p1.y-p2.y;
	return sqrt(dx*dx+dy*dy);
}

