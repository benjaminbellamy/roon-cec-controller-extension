"use strict";

var cecRemote        = require('hdmi-cec').Remote, 
    RoonApi          = require("node-roon-api"),
    RoonApiSettings  = require('node-roon-api-settings'),
    RoonApiStatus    = require('node-roon-api-status'),
    RoonApiTransport = require('node-roon-api-transport');

var core;

var roon = new RoonApi({
    extension_id:        'ovh.bellamy.roon-cec-controller',
    display_name:        "Roon CEC Controller",
    display_version:     "0.0.1",
    publisher:           'Benjamin Bellamy',
    email:               'benjamin@bellamy.ovh',
    website:             'http://roon-cec-controller.bellamy.ovh/',

    core_paired: function(core_) {
        core = core_;
    },
    core_unpaired: function(core_) {
	core = undefined;
    }
});


var mysettings = roon.load_config("settings") || {
    zone:             null,
    seekamount:       5
};

function makelayout(settings) {
    var l = {
        values:    settings,
	layout:    [],
	has_error: false
    };

    l.layout.push({
	type:    "zone",
	title:   "Zone",
	setting: "zone",
    });

	let v = {
	    type:    "integer",
	    min:     1,
	    max:     60,
	    title:   "Seek Amount (seconds)",
	    setting: "seekamount",
	};
	if (settings.seekamount < 1 || settings.seekamount > 60) {
	    v.error = "Seek Amount must be between 1 and 60 seconds.";
	    l.has_error = true; 
	}
        l.layout.push(v);

    return l;
}

var svc_settings = new RoonApiSettings(roon, {
    get_settings: function(cb) {
        cb(makelayout(mysettings));
    },
    save_settings: function(req, isdryrun, settings) {
	let l = makelayout(settings.values);
        req.send_complete(l.has_error ? "NotValid" : "Success", { settings: l });

        if (!isdryrun && !l.has_error) {
            mysettings = l.values;
            svc_settings.update_settings(l);
            roon.save_config("settings", mysettings);
        }
    }
});

var svc_status = new RoonApiStatus(roon);

roon.init_services({
    required_services:   [ RoonApiTransport ],
    provided_services:   [ svc_settings, svc_status ],
});


// Create a new Remote helper (called without any arguments, it will create a cec-client process itself, with the default client name)
var remote = new cecRemote();

//F5:47:72:6f:6f:6e
//{"select", 0},
//{"stop", 69},
//{"pause", 70},
//{"play", 68},
//{"backward", 76},
//{"forward", 75},
//{"left", 3},
//{"right", 4},
//{"down", 2},
//{"up", 1},
//{"rewind", 72},
//{"exit", 13},

// When any button is pressed on the remote, we receive the event:
remote.on('keypress', function(evt) {
    console.log('{"'+ evt.key + '", ' + evt.keyCode + '}');
    if (!core) return;
    if     (evt.keyCode==0) core.services.RoonApiTransport.control(mysettings.zone, 'playpause');
    else if(evt.keyCode==68) core.services.RoonApiTransport.control(mysettings.zone, 'play');
    else if(evt.keyCode==70) core.services.RoonApiTransport.control(mysettings.zone, 'pause');
    else if(evt.keyCode==69) core.services.RoonApiTransport.control(mysettings.zone, 'stop');
    else if(evt.keyCode==76 || evt.keyCode==3) core.services.RoonApiTransport.control(mysettings.zone, 'previous');
    else if(evt.keyCode==75 || evt.keyCode==4) core.services.RoonApiTransport.control(mysettings.zone, 'next');
    else if(evt.keyCode==72) core.services.RoonApiTransport.seek(mysettings.zone, 'relative', -mysettings.seekamount);
    else if(evt.keyCode==71) core.services.RoonApiTransport.seek(mysettings.zone, 'relative', mysettings.seekamount);
});
 
roon.start_discovery();
