var connect = require('connect'),
    request = require('request'),
    path    = require('path');


var staticAssets = [
    'images',
    'scripts',
    'stylesheets',
    'fonts'
]



var urlRewrite = function (req, res, next) {
    if (req.headers.referer || /\/scripts\//.test(req.url)) {
        req.url = '/' + path.relative('/' + path.dirname(path.relative('http://' + req.headers.host, req.headers.referer)), req.url);          
        req.url = req.url.replace(/\/\.\./g, '');
    } else {
        req.url = '';         
    }

    // is not static asset request
    notStatic = staticAssets.indexOf(req.url.split(path.sep)[1]) == -1;
    if (notStatic)
        req.url = '/'

    next();        
};

// deprecated
var xhr = function (req, res, next) {
    if (req.headers['X-Requested-With'.toLowerCase()])
        request('http://itswindtw.info:9001' + req.url).pipe(res);
    else
        next();
}

var api = function (req, res, next) {

    var apiReq = /\/api\//.test(req.url);
    
    if (apiReq) {
        request('http://itswindtw.info:9001' + req.url).pipe(res);
    } else {
        next()
    }
}

var serverPro = connect()
    .use(urlRewrite)
    .use(api)
    .use(connect.static(__dirname + '/public'))
    .listen(4000);
    
    
var serverDev = connect()
    .use(urlRewrite)
    .use(api)
    .use(connect.static(__dirname + '/../cedar'))
    .listen(3000);
