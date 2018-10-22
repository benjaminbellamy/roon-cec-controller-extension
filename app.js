/*
 * Roon CEC Controller Extension should allow you to control Roon Core
 * from your audio amplifier remote control, having your amplifier connected to a Roon Bridge via HDMI using CEC protocol.
 */

// Javascript is messy enough, let's use strict mode:
"use strict";

// We need a bunch of APIs:
var cecMonitor           = require('hdmi-cec').CecMonitor,
    cecRemote            = require('hdmi-cec').Remote, 
    RoonApi              = require("node-roon-api"),
    RoonApiSettings      = require('node-roon-api-settings'),
    RoonApiStatus        = require('node-roon-api-status'),
    RoonApiTransport     = require('node-roon-api-transport'),
    RoonApiSourceControl = require('node-roon-api-source-control');

// The Roon Core:
var core = undefined;

// We create a new Remote helper, but first we create a monitor in order to be able to rename the CEC device name:
var monitor = new cecMonitor('roon', 4, false);
var remote = new cecRemote(monitor);

// We create the RoonApi and try to connect to Roon Core
var roon = new RoonApi({
    extension_id:        'ovh.bellamy.roon-cec-controller',
    display_name:        "Roon CEC Controller",
    display_version:     "0.0.1",
    publisher:           'Benjamin Bellamy',
    email:               'benjamin@bellamy.ovh',
    website:             'http://roon-cec-controller.bellamy.ovh/',

    core_paired: function(core_) {
        core = core_;
        monitor.send('tx 45:47:72:6f:6f:6e:20:72:65:61:64:79');
    },
    core_unpaired: function(core_) {
	core = undefined;
	monitor.send('tx 45:47:72:6f:6f:6e:20:65:72:72:6f:72');
    }
});

// The Extension Settings:
var mysettings = roon.load_config("settings") || {
    // We need to know the roon zone where we will  be playing:
    zone:             null,
    // this is just to know how many seconds fast forward button will fast forward:
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

// This was copied/pasted from an example, I have no idea why it's here:
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
var svc_source_control = new RoonApiSourceControl(roon);

// We need Transport and we provide settings, status and source control:
roon.init_services({
    required_services:   [ RoonApiTransport ],
    provided_services:   [ svc_settings, svc_status, svc_source_control ],
});


// these are the CEC codes for the remote control buttons:
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


// When any button is pressed on the remote, we receive the event and send it to roon core:
remote.on('keypress', function(evt) {
    //console.log('{"'+ evt.key + '", ' + evt.keyCode + '}');
    if (!core) return;
    if     (evt.keyCode==0) core.services.RoonApiTransport.control(mysettings.zone, 'playpause');
    else if(evt.keyCode==68) core.services.RoonApiTransport.control(mysettings.zone, 'play');
    else if(evt.keyCode==70) core.services.RoonApiTransport.control(mysettings.zone, 'pause');
    else if(evt.keyCode==69) core.services.RoonApiTransport.control(mysettings.zone, 'stop');
    else if(evt.keyCode==76 || evt.keyCode==3) core.services.RoonApiTransport.control(mysettings.zone, 'previous');
    else if(evt.keyCode==75 || evt.keyCode==4) core.services.RoonApiTransport.control(mysettings.zone, 'next');
    else if(evt.keyCode==72 || evt.keyCode==1) core.services.RoonApiTransport.seek(mysettings.zone, 'relative', -mysettings.seekamount);
    else if(evt.keyCode==71 || evt.keyCode==2) core.services.RoonApiTransport.seek(mysettings.zone, 'relative', mysettings.seekamount);
});
 
roon.start_discovery();
