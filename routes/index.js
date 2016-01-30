var express = require('express');
var router = express.Router();
var request = require('request');
var havenondemand = require('havenondemand')
var hodClient = new havenondemand.HODClient('https://api.havenondemand.com/1/api/sync/analyzesentiment/v1', 'c643526f-4611-49da-a4bd-05a4d5690336');

router.get('/', function(req, res) {
  res.render('index', { title: 'rek-amend', content: 'none' });
});

router.get('/text',function(req,res) {
    var text = 'Hack cambridge never fails to dissapoint. I am the best ever! This is positive'
    hodClient.call('analyzesentiment', text, function(err, hodRes){
        //var sentiment = res.body.aggregate.sentiment
        //var score = res.body.aggregate.score
        //console.log('------------------------------');
        //console.log(text + ' | ' + sentiment + ' | ' + score);
        res.json({ _shiz: hodRes.body});
    });
});

module.exports = router;
