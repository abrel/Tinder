"use strict";

const express = require('express');
const router = express.Router();
const request = require('request');
const app_id = "464891386855067";

router.route('/').get(
	getFBToken
);

function getFBToken(req, res, next) {

	const url = 'https://m.facebook.com/v2.0/dialog/oauth?' ;

	const qs = { 
		redirect_uri: 'https://www.facebook.com/connect/login_success.html', 
		client_id: app_id,
		response_type: 'token',
		scope: 'basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details'
	};

	const headers = {
		'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15',
		Cookie: 'c_user=524635482; csm=2; datr=QfZSV0xInY6vZDEy7Cm8xHx2; fr=0Zl33BUK5M7saenBg.AWVcnK3UDE9m8MbyrefLIaHsRKw.BXUvbK.G5.AAA.0.0.AWUvaINx; lu=Rk8e_M6PS8m_7SNcfNEkcc9g; m_user=0%3A0%3A0%3A0%3Av_1%2Cajax_0%2Cwidth_0%2Cpxr_0%2Cgps_0%3A1465054922%3A2; s=Aa545W7_4F-bn9OG.BXUvbK; sb=yvZSV7wE5A4V-frCXRvH5rth; xs=194%3Asb4CMeztN3ffpg%3A2%3A1465054922%3A11768'
	};

	
	request( {url, qs, headers, followRedirect:false }, function(err, response, body) {
  		if (err) { return next(err); }
  		console.log(response.statusCode);
    	console.dir(response.headers.location);
	});
}

module.exports = router;