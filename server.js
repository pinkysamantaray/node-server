var restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
var flatCache =  require('flat-cache');

var cache = flatCache.load('cacheId');

const server = restify.createServer({
    name: 'myApp',
    version: '1.0.0'
});

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['API-Token'],
    exposeHeaders: ['API-Token-Expiry']
});

server.pre(cors.preflight);
server.pre(cors.actual);
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/api/v1/health', function(req, res, next){
    res.send('Alive');
    return next();
});

server.post('/api/v1/message', function(req, res, next){
    let msgArray = [];
    if(!cache.getKey("messages")){
        msgArray.push(req.body);
    } else {
        msgArray = cache.getKey("messages");
        msgArray.push(req.body);
    }
    cache.setKey("messages", msgArray);
    res.send("OK");
    return next();
});

server.get('/api/v1/message', function(req, res, next){
    res.send(cache.all());
    return next();
});

server.listen(8080, function(){
    console.log('%s listening at %s', server.name, server.url);
});