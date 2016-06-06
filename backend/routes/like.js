"use strict";

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser").json();
const FACEBOOK_TOKEN = process.env.FACEBOOK_TOKEN;
const FACEBOOK_ID = process.env.FACEBOOK_ID;
const TINDER_TOKEN = '20280d4d-9e85-448e-ba01-fdc464d25df8';
const Tinder = require('../src/tinder').Tinder;


router.route('/').post(
	bodyParser,
	signIn,
	like
);

function signIn(req, res, next) {
	req.mw = {};
	req.mw.tinder = new Tinder({ FACEBOOK_ID, FACEBOOK_TOKEN, TINDER_TOKEN });
	req.mw.tinder.signIn((err, body) => {
		return next(err);
	});
}

function like(req, res, next) {
	let userId = req.body.userId;
	let firstPhotoId = req.body.photoId;

	req.mw.tinder.like({ 
		userId, 
		firstPhotoId 
	}, function(err, results) {
		if (err) { return next(err); }
		res.status(200).send(results);
	}) ;
}


module.exports = router;


