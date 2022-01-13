define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Create SMS Message", "key": "step1" }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);
    connection.trigger('requestSchema');
    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedSchema', (data) => { console.log("SCHEMA: ", data['schema']); });
    connection.on('clickedNext', save);
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        // if (window.location.host.includes('localhost')) {
        //     initialize({ "name": "", "id": null, "key": "REST-7", "type": "REST", "arguments": { "execute": { "inArguments": [{ "email": "{{Contact.Default.EmailAddress}}", "to": "{{Contact.Attribute.TwilioV1.TwilioNumber}}" }], "outArguments": [], "url": "https://twilio-sfmc.herokuapp.com/journeybuilder/execute", "verb": "POST", "body": "", "format": "json", "useJwt": false, "timeout": 2000 } }, "configurationArguments": { "applicationExtensionKey": "679f3911-47e7-4a22-b40c-0dd619316c13", "save": { "url": "https://twilio-sfmc.herokuapp.com/save", "verb": "POST", "body": "", "format": "json", "useJwt": false, "timeout": 2000 }, "publish": { "url": "https://twilio-sfmc.herokuapp.com/publish", "verb": "POST", "body": "", "format": "json", "useJwt": false, "timeout": 2000 }, "validate": { "url": "https://twilio-sfmc.herokuapp.com/validate", "verb": "POST", "body": "", "format": "json", "useJwt": false, "timeout": 2000 }, "stop": { "url": "https://twilio-sfmc.herokuapp.com/stop", "verb": "POST", "body": "", "format": "json", "useJwt": false, "timeout": 2000 } }, "metaData": { "icon": "https://rocky-woodland-79006.herokuapp.com/images/iconSmall.png", "category": "message", "iconSmall": null, "statsContactIcon": null, "original_icon": "images/iconSmall.png" }, "schema": { "arguments": { "execute": { "inArguments": [{ "accountSid": { "dataType": "String", "isNullable": false, "direction": "out" } }, { "authToken": { "dataType": "String", "isNullable": false, "direction": "out" } }, { "from": { "dataType": "Phone", "isNullable": true, "direction": "out" } }, { "to": { "dataType": "Phone", "isNullable": false, "direction": "out" } }, { "body": { "dataType": "String", "isNullable": false, "direction": "out" } }, { "email": { "dataType": "Email", "isNullable": true, "direction": "out" } }], "outArguments": [] } } }, "editable": true, "outcomes": [{ "next": "WAITBYDURATION-2", "metaData": { "invalid": false } }], "errors": null });
        // }
    }

    function initialize(data) {
        console.log("Initializing data: " + JSON.stringify(data));
        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('Has In arguments: ' + JSON.stringify(inArguments));

        $.each(inArguments, function(index, inArgument) {
            $.each(inArgument, function(key, val) {

                if (key === 'accountSid') {
                    $('#accountSID').val(val);
                }

                if (key === 'authToken') {
                    $('#authToken').val(val);
                }

                if (key === 'messagingService') {
                    $('#messagingService').val(val);
                }

                if (key === 'body') {
                    $('#messageBody').val(val);
                }

            })
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }

    function onGetTokens(tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: " + JSON.stringify(tokens));
        //authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: " + JSON.stringify(endpoints));
    }

    $('#guardar').on('click', () => {
        save();
    })

    function save() {

        var accountSid = $('#accountSID').val();
        var authToken = $('#authToken').val();
        var messagingService = $('#messagingService').val();
        var body = $('#messageBody').val();

        payload['arguments'].execute.inArguments = [{
            "accountSid": accountSid,
            "authToken": authToken,
            "messagingService": messagingService,
            "body": body,
            "to": "{{Event.DEAudience-b5a4b514-4a2e-9801-26b1-1ceda1eace0c.celular}}", //<----This should map to your data extension name and phone number column
            "rut": "Event.DEAudience-b5a4b514-4a2e-9801-26b1-1ceda1eace0c.RUT"
        }];
        payload["arguments"]["execute"]["url"] = "https://rocky-woodland-79006.herokuapp.com/execute";

        payload["configurationArguments"]["applicationExtensionKey"] = "2b4f15dd-b7db-48bd-b827-a5d1a78aba09";
        payload["configurationArguments"]["save"]["url"] = "https://rocky-woodland-79006.herokuapp.com/save";
        payload["configurationArguments"]["publish"]["url"] = "https://rocky-woodland-79006.herokuapp.com/publish";
        payload["configurationArguments"]["validate"]["url"] = "https://rocky-woodland-79006.herokuapp.com/validate";
        payload["configurationArguments"]["stop"]["url"] = "https://rocky-woodland-79006.herokuapp.com/stop";

        payload['metaData'].isConfigured = true;

        console.log("Payload on SAVE function: " + JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }

});