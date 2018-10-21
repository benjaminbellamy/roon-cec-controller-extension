var RoonApi = require("node-roon-api");

var roon = new RoonApi({
    extension_id:        'ovh.bellamy.roon-cec-controller',
    display_name:        "Roon CEC Controller",
    display_version:     "0.0.1",
    publisher:           'Benjamin Bellamy',
    email:               'benjamin@bellamy.ovh',
    website:             'https://github.com/benjaminbellamy/roon-cec-controller-extension'
});

roon.init_services({});

roon.start_discovery();

var cecRemote = require('hdmi-cec').Remote;
 
// Create a new Remote helper (called without any arguments, it will create a cec-client process itself, with the default client name)
var remote = new cecRemote();

// When any button is pressed on the remote, we receive the event:
remote.on('keypress', function(evt) {
    console.log('user pressed the key "'+ evt.key + '" with code "' + evt.keyCode + '"');
});
 
// Alternatively, we only wait for the user to press the "select" key
remote.on('keypress.select', function() {
    console.log('user pressed the select key!');
});

