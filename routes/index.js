var express = require('express');
var router = express.Router();
var request = require('request');
var User = require('../models/User');
var havenondemand = require('havenondemand');
var hodClient = new havenondemand.HODClient('c643526f-4611-49da-a4bd-05a4d5690336', 'v1');

/*
* These are just URL for testing shit....
* */
router.get('/', function(req, res) {
  res.render('index', { title: 'rek-amend', content: 'none' });
});

router.get('/text',function(req,res) {
    var data = {text: 'As the prospect of graduation draws closer, I found myself at a crossroad between further studies and employment. I am strongly inclined to go for further studies as there are so much more things out there to learn, especially in computer science. In particular, I am interested in artificial intelligence (AI) as I believe that it could potentially solve the some of the biggest issue that we face today, such as food shortage and energy crisis. I am fascinated by the capabilities that AI that allows people to build intelligent technologies such as self-driving cars, machine translation and smart robots. Moreover, I am also excited about the prospect of machine learning that brings about innovative inventions such as big data analytics and topic modeling. All of those points have become my main source of motivation to apply for a postgraduate degree with a specialisation in this field. After almost 3 years studying at university, I felt that studying computer science has just begun. During my time in here, I was exposed to various fundamental concepts on both theoretical and practical aspects of computer science. However, I’m not satisfied enough with just knowing about computer science at a broad level. I would like to delve deeper into one topic and study it thoroughly until I am able to call myself an expert in it, which has been my goal since I was introduced to this field. AI piqued my interest when I read about Deepmind, an AI startup company that was based in UCL. A few months later, Google bought it for an eye-popping £400 million. After this discovery, I started following AI news online and soon enough I realised that this field will have a major impact in our lives in the future. Unbeknown to me, I had actually had a few encounters with AI myself. In a robotics programming class, my classmate and I had to program a robot to navigate through a maze as quickly as possible. We made a dumb but efficient program, in which the robot would follow a wall until it eventually reaches the end of the maze. We attained the seventh place on the leaderboard, which was within our expectations. However, The team that triumphed in the top three places developed something a bit more intelligent by using a more advanced algorithm to navigate more efficiently. Another encounter was during my second year of university, where I developed an image search application for British library digital collection with two other teammates (It can be accessed from blbigdata.herokuapp.com). I focused on its software engineering, rather than the machine learning aspect of it, which was essential in tagging tens of thousands of random images. In the end, we delegated most of the machine learning task to external API and I realised how crucial it was towards the success of our project. Despite our success, I wasn’t fully satisfied with my involvement and I wished that we implemented our own machine learning solution in our project. In addition, I had a taste of AI research through a research course that I did recently. I wrote a literature survey about topic model, a suite of statistical models to reveal the hidden topical structures within large corpus of data. This method is utilised in many search engines that we have today to allow better navigation of data. After I had finished the research course, I devoted myself to learn everything I can about AI and its subfields in my spare time, including learning the mathematical foundations such as linear algebra and statistics. In addition to AI, I am also passionate about programming languages and computer engineering. I am interested in learning various programming languages and the implementation of its compiler/interpreter. I have also developed a liking for computer engineering through computer architecture course, where I learned how to program a basic CPU and digital circuits.  In the last few years, I have also worked on various academic projects, such as building an image search application for the British Library digital collection, writing a simple linux shell and writing a book on introductory programming with python for secondary school students. I am currently working on my dissertation on using integer programming to solve a combinatorial optimisation problem. Outside of my academics, I have participated and won various hackathons. To gain some work experience, I have worked part time as a web developer for 2 startups, working on web applications for both front and backend. Overall, given my experiences and my good grades, I believe that I am ready to go to the next step of my academic journey to pursue an advanced degree.I decided to apply to study in TUM for a number of good reasons. Firstly, I believe that getting a degree from TUM will give me a better prospect in securing my ideal job, as TUM has good connection with the industry and good reputation worldwide. Secondly, I like the excellent selection of classes with relatively minimal restrictions in the MSc Informatics programme. Finally, Munich is one of the best student cities to live in and the top technology hub of Europe.At this point in my life, I see three different career paths ahead of me: a computer science researcher, a consultant/software engineer or an entrepreneur. All of which would be closely related to AI and computer science. Regardless of my choice, getting to that point requires knowledge and wisdom that can be acquired through rigorous study and thought-provoking discussions that I would go through in university.'};
    hodClient.call('extractconcepts', data, function(err, hodRes, hodBody){
        //var sentiment = res.body.aggregate.sentiment
        //var score = res.body.aggregate.score
        //console.log('------------------------------');
        //console.log(text + ' | ' + sentiment + ' | ' + score);
        res.json({ _shiz: hodBody});
    });
});

/* The Real Stuff.. */

/*
* Display homepage
* */
router.get('/home', function(req, res) {
    res.render('home',{ title: 'home'} );
});

/*
*
* */
router.post('/users', function(req, res) {
    res.render('users', { title: 'users'});
    console.log("this is :");
    console.log(req.body.query);
});

/*
 *
 * */
router.get('/users', function(req, res) {
    res.render('users', {title: 'users'});
});

/*
 *
 * */
router.get('/submit', function(req, res) {
    res.render('submit', {title: 'submit'});
});


/*
 * Grab description, send to API, once it receives back from API populate the database...
 * */
router.post('/submit', function(req, res) {

    var data = {text: req.body.about };
    hodClient.call('extractconcepts', data, function(err, hodRes, hodBody){

        var newUser = new User({
            username : req.body.username,
            name: req.body.name,
            about: req.body.about,
            profile: hodBody.concepts
        });

        newUser.save(function(err){
            if (err) console.log(err);
            res.redirect('/user/' + newUser.username);
        });
    });
});

/*
 *
 * */
router.get('/user/:username', function(req, res) {
  User.findOne({'username' : req.params.username}, function(err, data){
    if (err) console.log(err);
    var concepts = [];
    for (var i = 0; i < data.profile.length && i < 10; i++)
    {
      concepts.push(data.profile[i]['concept']);
    }
    res.render('profile', {title: concepts});
  });
});


/*
* Routes:
*   GET /home
*   POST /users?q=bob
*   POST /user
* */

module.exports = router;
