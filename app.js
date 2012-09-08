var connect = require('connect'),
    request = require('request'),
    path    = require('path');

var urlRewrite = function (req, res, next) {
    if (req.headers.referer) {
        req.url = '/' + path.relative('/' + path.dirname(path.relative('http://' + req.headers.host, req.headers.referer)), req.url);          
        req.url = req.url.replace(/\/\.\./g, '');
    } else {
        req.url = '';         
    }
    next();        
};

var xhr = function (req, res, next) {
    if (req.headers['X-Requested-With'.toLowerCase()])
        request('http://itswindtw.info:9001' + req.url).pipe(res);
    else
        next();
}

var api = function (req, res, next) {
    var apiReq = /\/api\//.test(req.url)
    if (apiReq) {
        request('http://itswindtw.info:9001' + req.url).pipe(res);
    } else {
        next()
    }
}

var server0 = connect()
    .use(urlRewrite)
    .use(api)
    .use(connect.static(__dirname + '/public'))
    .listen(4000);
    
    
var server1 = connect()
    .use(urlRewrite)
    .use(api)
    .use(connect.static(__dirname + '/../cedar'))
    .listen(3000);
