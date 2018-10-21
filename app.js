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


