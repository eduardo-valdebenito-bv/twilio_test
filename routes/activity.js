'use strict';
var util = require('util');
// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var http = require('https');
const fetch = require("node-fetch");
const MessagingResponse = require('twilio').twiml.MessagingResponse;

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + JSON.stringify(req.headers));
    console.log("trailers: " + JSON.stringify(req.trailers));
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function(req, res) {

    console.log("5 -- For Edit");
    console.log("4");
    console.log("3");
    console.log("2");
    console.log("1");
    //console.log("Edited: "+req.body.inArguments[0]);    

    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function(req, res) {

    console.log("5 -- For Save");
    console.log("4");
    console.log("3");
    console.log("2");
    console.log("1");
    //console.log("Saved: "+req.body.inArguments[0]);

    // Data from the req and put it in an array accessible to the main app.
    console.log(req.body);
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function(req, res) {

    console.log("5 -- For Execute");
    console.log("4");
    console.log("3");
    console.log("2");
    console.log("1");
    console.log("Executed: " + JSON.stringify(req.body.inArguments[0]));

    var requestBody = req.body.inArguments[0];

    const accountSid = requestBody.accountSid;
    const authToken = requestBody.authToken;
    const to = !requestBody.to.includes("+") ? "+" + requestBody.to : requestBody.to;
    console.log("TO: ", to);
    const from = requestBody.messagingService;
    const body = requestBody.body;
    // {
    //     "accountSid":"AC4453bbddc51ce92605bbf59fa87a0fc1",
    //     "authToken":"d8efd066396bc83bd22e34afdf651172",
    //     "messagingService":"MGd7d0460058d7dd5c23c9d078278ec270",
    //     "body":"Hola desde SFMC JB con Twilio",
    //     "to":"56962065418"
    // }
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: body,
            //messagingService: from,
            from: "+56964590156",
            to: to
        })
        .then(message => {
            var raw = JSON.stringify({
                "evento": "TWILIO_PRUEBAS_EDU",
                "rut": requestBody.rut,
                "atributos": {
                    "RUT": requestBody.rut,
                    "MONTO": requestBody.monto,
                    "TASA": requestBody.tasa,
                    "CAE": requestBody.cae,
                    "PLAZO": requestBody.plazo,
                    "CUOTA": requestBody.cuota,
                    "ID_SIMULACION": "",
                    "TELEFONO": !to.includes("+") ? "+" + to : to,
                    "ID_SMS": message.sid
                }
            });
            var requestOptions = {
                method: 'POST',
                headers: {
                    "x-api-key": "YZvvSeqD9W9eCHwYDKQK1aJtto0j2KO9ady99qYv",
                    "Content-Type": "application/json"
                },
                body: raw,
                redirect: 'follow'
            };
            fetch("https://apidev.bicevida.cl/desfmc/journey", requestOptions).then((r) => { return console.log(r.json()) }).catch((e) => { console.log(e); return null });


        })
        .done();


    // FOR TESTING
    logData(req);
    res.send(200, 'Publish');

    // Used to decode JWT
    // JWT(req.body, process.env.jwtSecret, (err, decoded) => {

    //     // verification error -> unauthorized request
    //     if (err) {
    //         console.error(err);
    //         return res.status(401).end();
    //     }

    //     if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {

    //         // decoded in arguments
    //         var decodedArgs = decoded.inArguments[0];

    //         logData(req);
    //         res.send(200, 'Execute');
    //     } else {
    //         console.error('inArguments invalid.');
    //         return res.status(400).end();
    //     }
    // });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function(req, res) {

    console.log("5 -- For Publish");
    console.log("4");
    console.log("3");
    console.log("2");
    console.log("1");
    //console.log("Published: "+req.body.inArguments[0]);        

    // Data from the req and put it in an array accessible to the main app.
    console.log(req.body);
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function(req, res) {

    console.log("5 -- For Validate");
    console.log("4");
    console.log("3");
    console.log("2");
    console.log("1");
    //console.log("Validated: "+req.body.inArguments[0]);       

    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};

exports.webhook = function(req, res) {

    console.log("5 -- For Webhook");
    console.log("4");
    console.log("3");
    console.log("2");
    console.log("1");
    //console.log("Validated: "+req.body.inArguments[0]);       

    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);

    const twiml = new MessagingResponse();

    // Access the message body and the number it was sent from.
    console.log(`1 BODY: ${req.body}`);
    console.log(`2 BODY: ${JSON.stringify(req.body)}`);
    console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);

    var raw = JSON.stringify({
        "evento": "TWILIO_PRUEBAS_EDU",
        "rut": "18448049",
        "atributos": {
            "RUT": "18448049",
            "DATA": req.body,
            "ID_SIMULACION": "123",
            "TELEFONO": !req.body.From.includes("+") ? "+" + req.body.From : req.body.From
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: {
            "x-api-key": "YZvvSeqD9W9eCHwYDKQK1aJtto0j2KO9ady99qYv",
            "Content-Type": "application/json"
        },
        body: raw,
        redirect: 'follow'
    };

    fetch("https://apidev.bicevida.cl/desfmc/journey", requestOptions).then((r) => { return console.log(r.json()); }).catch((e) => { console.log(e); return null });
    // const response = await fetch(url, requestOptions).then((r) => { return r.json() }).catch((e) => { console.log(e); return null });
    // console.log(`call_service response: ${JSON.stringify(response)}`)

    twiml.message('The Robots are coming! Head for the hills!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

};