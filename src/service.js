const url = require('url');

exports.sampleRequest = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    let name = 'World';
    if (reqUrl.query.name) {
        name = reqUrl.query.name
    }

    let response = {
        "text": "Hello " + name
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
};
