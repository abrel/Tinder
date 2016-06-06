"use strict";

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser").json();
const FACEBOOK_TOKEN = 'EAAGm0PX4ZCpsBAAGaXKWYLt1DKJ3ciY8QhE17RY4rRZAFuNENM1IGZAgzHEq1V7DPvWOB9kB1HgTut2yi19ghw1TOigPZCGYfcVJEzSHZAVXidHimo0rEMdC2dgzu7Kl95JcmqzqVeQnsz9aMhddrNG3DdgpkJnyWdp9cwka6ZCfWxl9sAsvcKYC4r1nyCYJreZAkTl8ZBUU02H01VfiofOV';
const FACEBOOK_ID = '524635482';
const TINDER_TOKEN = '20280d4d-9e85-448e-ba01-fdc464d25df8';
const Tinder = require('../src/tinder').Tinder;


router.route('/').post(
	bodyParser,
	signIn,
	superLike
);

function signIn(req, res, next) {
	req.mw = {};
	req.mw.tinder = new Tinder({ FACEBOOK_ID, FACEBOOK_TOKEN, TINDER_TOKEN });
	req.mw.tinder.signIn((err, body) => {
		return next(err);
	});
}

function superLike(req, res, next) {
	let userId = req.body.userId;
	let firstPhotoId = req.body.photoId;

	req.mw.tinder.superLike({ 
		userId, 
		firstPhotoId 
	}, function(err, results) {
		if (err) { return next(err); }
		res.status(200).send(results);
	}) ;
}


module.exports = router;

