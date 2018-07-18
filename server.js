//initialize global variable with our path
global.ABSPATH = __dirname;
global.INCPATH = ABSPATH + '/libs';

const path = require('path'); //helps to establish the right ways
const express = require('express'); //the framework itself - the shell over the node JS
const app = express(); //create our application
const config = require( INCPATH + '/config' ); //our common config
const log = require( INCPATH + '/log')(module); //log is a function. which is called with the current model to which
// it is connected
const cors = require('cors');//https://github.com/expressjs/cors
// const apiConfig = require(ABSPATH + '/api');

let list = [];

// app.use ->  this is middleware
app.use(cors());
// app.use('/api', apiConfig);
app.use(express.static(__dirname)); //reading static files
app.use(express.json()); //initialize json parser
app.use(express.urlencoded({ extended: true })); //pars url

//getting static file
app.get('/', function(req, res) {
    res.sendFile(path.resolve( __dirname , 'index.html' ));
});
app.get('/api/list', function(req, res) {
    log.info('/api/list');
    res.end(list);
});

app.get('/api/list/:id', function(req, res) {
    log.info('/api/list/:id');
    console.log(res.params.id);
    res.end();
});

app.post('/api/create-article', function(req, res) {
    log.info('/api/create-article');
    console.log(req.body);
    res.end();
});

//listen our post, 3000
app.listen(config.get('port'), function () {
    log.info('Server start running on port ' + config.get('port'));
});