var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res) {
  res.render('index', { title: 'rek-amend', content: 'none' });
});

router.get('/text',function(req,res) {
    request.get({
        url: "https://api.havenondemand.com/1/api/sync/analyzesentiment/v1",
        apikey: "c643526f-4611-49da-a4bd-05a4d5690336",
        text: "Hack cambridge never fails to dissapoint. I am the best ever! This is positive"
    }, function(err, httpResponse, body){
        if(err) console.log(err);
        console.log(httpResponse);
        console.log(body);
        res.json({ _httpResponse: httpResponse, _body: body });

    });
});

module.exports = router;
