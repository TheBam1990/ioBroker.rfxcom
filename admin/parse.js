var decoders = {
    ID: function(value) {
        return parseInt(value, 16);
    },
    SWITCH: function(value) {
        return value;
    },
    CMD: function(value) {
        if (value.indexOf('SET_LEVEL') !== -1) {
            return parseInt(value.split('=')[1], 10);
        } else {
            if (value[0] >= '0' && value[0] <= '9') return parseInt(value, 10);
            return value.indexOf('ON') !== -1;
        }
    },
    SET_LEVEL: function(value) {
        var result;
        result = parseInt(value, 10);
        result = Math.max(1, Math.min(15, result));
        return result;
    },
    TEMP: function(value) {
        var result;
        result = parseInt(value, 16);
        if (result >= 32768) result = 32768 - result;
        return result / 10;
    },
    HUM: function(value) {
        if (value === 'cc') return null;
        return parseInt(value, 10);
    },
    BARO: function(value) {
        return parseInt(value, 16);
    },
    HSTATUS: function(value) {
        return parseInt(value, 10);
    },
    BFORECAST: function(value) {
        return parseInt(value, 10);
    },
    UV: function(value) {
        return parseInt(value, 16);
    },
    LUX: function(value) {
        return parseInt(value, 16);
    },
    BAT: function(value) {
        return value !== 'OK';
    },
    RAIN: function(value) {
        return parseInt(value, 10) / 10;
    },
    RAINRATE: function(value) {
        return parseInt(value, 10) / 10;
    },
    WINSP: function(value) {
        return parseInt(value, 16) / 10;
    },
    AWINSP: function(value) {
        return parseInt(value, 16) / 10;
    },
    WINGS: function(value) {
        return parseInt(value, 16) / 10;
    },
    WINDIR: function(value) {
        return Math.round(parseInt(value) * 10000 / 15) / 100;
    },
    WINCHL: function(value) {
        return parseInt(value, 16);
    },
    WINTMP: function(value) {
        return parseInt(value, 16);
    },
    CHIME: function(value) {
        return parseInt(value);
    },
    SMOKEALERT: function(value) {
        return (value === 'ON');
    },
    PIR: function(value) {
        return (value === 'ON');
    },
    CO2: function(value) {
        return parseInt(value, 10);
    },
    SOUND: function(value) {
        return parseInt(value, 10);
    },
    KWATT: function(value) {
        return parseInt(value, 16) / 1000;
    },
    WATT: function(value) {
        return parseInt(value, 16);
    },
    DIST: function(value) {
        return parseInt(value, 10);
    },
    METER: function(value) {
        return parseInt(value, 10);
    },
    VOLT: function(value) {
        return parseInt(value, 10);
    },
    CURRENT: function(value) {
        return parseInt(value, 10);
    }
};

var encoders = {
    ID: function(value) {
        var stringVal;
        stringVal = value.toString(16);
        if (stringVal.length < 6) {
            return ('000000' + stringVal).slice(-6);
        } else {
            return stringVal;
        }
    },
    SWITCH: function(value) {
        return value;
    },
    CMD: function(value, isBlind) {
        if (value === true || value === 'true') {
            return isBlind ? 'UP' : 'ON';
        } else if (value === false || value === 'false') {
            return isBlind ? 'DOWN' : 'OFF';
        } else{
            return value.toString();
        }
    },
    SET_LEVEL: function(value) {
        return 'SET_LEVEL=' + (parseInt(value, 10) || 1);
    },
    TEMP: function(value) {
        var result;
        result = value.toString(16);
        if (result >= 32768) {
            result = 32768 - result;
        }
        return result / 10.0;
    },
    HUM: function(value) {
        return value.toString();
    },
    BARO: function(value) {
        return value.toString(16);
    },
    HSTATUS: function(value) {
        return value.toString();
    },
    BFORECAST: function(value) {
        return value.toString();
    },
    UV: function(value) {
        return value.toString(16);
    },
    LUX: function(value) {
        return value.toString(16);
    },
    BAT: function(value) {
        return value;
    },
    RAIN: function(value) {
        return parseInt(value * 10).toString();
    },
    RAINRATE: function(value) {
        return parseInt(value * 10).toString(16);
    },
    WINSP: function(value) {
        return parseInt(value * 10).toString(16);
    },
    AWINSP: function(value) {
        return parseInt(value * 10).toString(16);
    },
    WINGS: function(value) {
        return parseInt(value * 10).toString(16);
    },
    WINDIR: function(value) {
        return parseInt(value * 15 / 100).toString();
    },
    WINCHL: function(value) {
        return value.toString(16);
    },
    WINTMP: function(value) {
        return value.toString(16);
    },
    CHIME: function(value) {
        return value.toString();
    },
    SMOKEALERT: function(value) {
        return value;
    },
    PIR: function(value) {
        return value;
    },
    CO2: function(value) {
        return value.toString();
    },
    SOUND: function(value) {
        return value.toString();
    },
    KWATT: function(value) {
        return value.toString(16);
    },
    WATT: function(value) {
        return value.toString(16);
    },
    DIST: function(value) {
        return value.toString();
    },
    METER: function(value) {
        return value.toString();
    },
    VOLT: function(value) {
        return value.toString();
    },
    CURRENT: function(value) {
        return value.toString();
    }
};

function decodeValue(attr, raw) {
    if (decoders[attr]) {
        return decoders[attr](raw)
    } else {
        var f = parseFloat(raw);
        if (f == raw) return f;
        if (raw === 'LOW' || raw === 'ON'  || raw === 'ALLON')  return true;
        if (raw === 'OK'  || raw === 'OFF' || raw === 'ALLOFF') return false;
        return raw;
    }
}

function encodeValue(attr, value, type) {
    if (type === 'blind') {
        if (value === true || value === 'true') {
            return 'UP';
        } else {
            return 'DOWN';
        }
    } else
    if (encoders[attr]) {
        return encoders[attr](value)
    } else {
        return value.toString();
    }
}

function parseString(rawData) {
    // UPM/Esic;ID=0001;TEMP=00cf;HUM=16;BAT=OK;
    if (rawData.indexOf('DEBUG') !== -1) return null;

    var parts = rawData.split(';');
    if (parts[0] === '20') parts.splice(0, 2);

    if (!parts[parts.length - 1]) parts.splice(parts.length - 1, 1);

    if (parts.length < 3) return null;

    if (parts[0] === 'Debug') return null;

    var frame = {
        brand: parts[0],
        dataRaw: rawData
    };

    for (var i = 1; i < parts.length; i++) {
        if (!parts[i].trim()) continue;
        var pp = parts[i].split('=');
        if (pp.length < 2) continue;
        frame[pp[0]] = decodeValue(pp[0], pp[pp.length - 1]);
        if (pp[0] === 'CMD') {
            if (pp[1] === 'UP'    || pp[1] === 'DOWN')   frame.blind = true;
            if (pp[1] === 'ALLON' || pp[1] === 'ALLOFF') frame.all   = true;
            if (pp[1] === 'SET_LEVEL')                   frame.set_level = true;

            if (pp[1] === 'STOP') {
                frame.blind = true;
                frame.stop  = true;
            }
        }
    }
    if (!frame.ID) {
        console.warn('Cannot find ID in ' + rawData);
        return null;
    }
    if (frame.brand) {
        frame.brandRaw = frame.brand;
        frame.brand = frame.brand.replace(/[.\s]/g, '_');
    }

    return frame;
}

var types = {
    'TEMP':      {name: 'Temperature',        role: 'value.temperature',        unit: 'C°',    type: 'number'},
    'WINCHL':    {name: 'Chill temperature',  role: 'value.temperature.chill',  unit: 'C°',    type: 'number'},
    'WINTMP':    {name: 'Wind temperature',   role: 'value.temperature.wind',   unit: 'C°',    type: 'number'},
    'HUM':       {name: 'Humidity',           role: 'value.humidity',           unit: '%',     type: 'number', min: 0, max: 100},
    'WINSP':     {name: 'Wind speed',         role: 'value.wind.speed',         unit: 'km/h',  type: 'number'},
    'AWINSP':    {name: 'Average wind speed', role: 'value.wind.speed.average', unit: 'km/h',  type: 'number'},
    'WINDIR':    {name: 'Wind direction',     role: 'value.wind.direction',     unit: '°',     type: 'number'},
    'WINGS':     {name: 'Wind gust',          role: 'value.gind.gust',          unit: 'km/h',  type: 'number'},
    'RAIN':      {name: 'Total rain level',   role: 'value.rain.total',         unit: 'mm',    type: 'number'},
    'RAINRATE':  {name: 'Rain rate',          role: 'value.rain.rate',          unit: 'mm',    type: 'number'},
    'BARO':      {name: 'Pressure',           role: 'value.pressure',           unit: 'bar',   type: 'number'},
    'HSTATUS':   {name: 'Status humidity',    role: 'value.humidity.status',                   type: 'number', states: {0: 'Normal', 1: 'Comfortable', 2: 'Dry', 3: 'Wet'}},
    'BFORECAST': {name: 'Forecast',           role: 'forecast',                                type: 'number', states: {0: 'No Info', 1: 'Sunny', 2: 'Partly Cloudy', 3: 'Cloudy', 4: 'Rain'}},
    'LUX':       {name: 'LUX',                role: 'value.lux',                unit: 'lux',   type: 'number'},
    'CO2':       {name: 'CO2',                role: 'value.co2',                               type: 'number'},
    'KWATT':     {name: 'KWatt',              role: 'value.energy.kwatt',       unit: 'KWatt', type: 'number'},
    'WATT':      {name: 'Watt',               role: 'value.energy.watt',        unit: 'Watt',  type: 'number'},
    'CURRENT':   {name: 'Current',            role: 'value.current',            unit: 'A',     type: 'number'},
    'CURRENT2':  {name: 'Current phase 2',    role: 'value.current',            unit: 'A',     type: 'number'},
    'CURRENT3':  {name: 'Current phase 3',    role: 'value.current',            unit: 'A',     type: 'number'},
    'DIST':      {name: 'Distance',           role: 'value.distance',           unit: 'm',     type: 'number'},
    'VOLT':      {name: 'Voltage',            role: 'value.voltage',            unit: 'V',     type: 'number'},
    'BAT':       {name: 'Low battery',        role: 'indicator.battery',                       type: 'boolean'}
};

var doNotProcess = [
    'brand', 'ID', 'SWITCH', 'brandRaw', 'blind', 'stop', 'all', 'set_level', 'dataRaw', 'chime', 'offset', 'factor', 'autoRepair', 'autoRepairProblem'
];

function analyseFrame(frame, newId, index) {
    var objs = [];
    var native = {
        ID:    frame.ID,
        brand: frame.brandRaw
    };
    var obj;
    for (var attr in frame) {
        if (!frame.hasOwnProperty(attr) || doNotProcess.indexOf(attr) !== -1) continue;

        if (attr === 'CMD' && (typeof frame[attr] === 'boolean') && !frame.blind && !frame.all && frame.SWITCH !== undefined) {
            //switch
            obj = {
                _id:       newId + '.SWITCH_' + frame.SWITCH.toString(),
                common: {
                    name:  frame.brandRaw + ' ' + index + ' Switch ' + frame.SWITCH.toString(),
                    type:  'boolean',
                    role:  'switch',
                    read:  true,
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr   = attr;
            obj.native.switch = frame.SWITCH;
            objs.push(obj);
        } else if (attr === 'CMD' && frame.all && frame.SWITCH !== undefined) {
            //switch
            obj = {
                _id:       newId + '.ALL_' + frame.SWITCH.toString(),
                common: {
                    name:  frame.brandRaw + ' ' + index + ' Switch ALL ' + frame.SWITCH.toString(),
                    type:  'boolean',
                    role:  'switch',
                    read:  true,
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr   = attr;
            obj.native.all    = true;
            obj.native.switch = frame.SWITCH;
            objs.push(obj);
        } else if (attr === 'CMD' && frame.set_level) {
            //switch
            obj = {
                _id:       newId + '.SET_LEVEL_' + frame.SWITCH.toString(),
                common: {
                    name:  frame.brandRaw + ' ' + index + ' Set level ' + frame.SWITCH.toString(),
                    type:  'number',
                    role:  'level.dimmer',
                    min:   1,
                    max:   15,
                    read:  true,
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr      = attr;
            obj.native.set_level = true;
            obj.native.switch    = frame.SWITCH;
            objs.push(obj);
        } else if (attr === 'CMD' && frame.blind && frame.SWITCH !== undefined) {
            //switch
            obj = {
                _id:       newId + '.BLIND_' + frame.SWITCH.toString(),
                common: {
                    name:  frame.brandRaw + ' ' + index + ' Blind ' + frame.SWITCH.toString(),
                    type:  'boolean',
                    role:  'blind',
                    read:  true,
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.switch = frame.SWITCH;
            obj.native.attr   = attr;
            obj.native.blind  = true;
            objs.push(obj);
            
            // Blind stop
            obj = {
                _id:       newId + '.BLIND_STOP_' + frame.SWITCH.toString(),
                common: {
                    name:  frame.brandRaw + ' ' + index + ' Blind STOP ' + frame.SWITCH.toString(),
                    type:  'boolean',
                    role:  'button',
                    read:  true,
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.switch = frame.SWITCH;
            obj.native.attr   = attr;
            obj.native.blind  = true;
            obj.native.stop   = true;
            objs.push(obj);
        } else if (attr === 'RGBW' && frame.SWITCH !== undefined) {
            obj = {
                _id:      newId + '.RGBW_' + frame.SWITCH.toString(),
                common: {
                    name:  frame.brandRaw + ' ' + index + ' RGBW ' + frame.SWITCH.toString(),
                    type:  'string',
                    role:  'level.rgbw',
                    read:  true,
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.switch = frame.SWITCH;
            obj.native.attr   = attr;
            objs.push(obj);
        } else if (attr === 'CHIME' && frame.SWITCH !== undefined) {
            obj = {
                _id:      newId + '.CHIME_' + frame.SWITCH.toString(),
                common: {
                    name:  frame.brandRaw + ' ' + index + ' Chime ' + frame.SWITCH.toString(),
                    type:  'number',
                    role:  'state',
                    read:  true,
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.switch = frame.SWITCH;
            obj.native.attr   = attr;
            objs.push(obj);
        } else if (types[attr]) {
            obj = {
                _id:    newId + '.' + attr,
                common: JSON.parse(JSON.stringify(types[attr])),
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr   = attr;
            obj.native.offset = 0;
            obj.common.read   = true;
            obj.common.write  = false;
            obj.common.name   = frame.brandRaw + '_ ' + index + ' ' + (obj.common.name || attr);
            objs.push(obj);
        } else {
            // Common state
            obj = {
                _id:      newId + '.' + attr,
                common: {
                    type:  typeof frame[attr],
                    read:  true,
                    write: false
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr   = attr;
            obj.native.offset = 0;
            obj.native.factor = 1;
            obj.common.name   = frame.brandRaw + ' ' + index + ' ' + attr;
            obj.common.role   = obj.common.type === 'boolean' ? 'indicator' : 'state';
            objs.push(obj);
        }

        // add special commands:
        if (attr === 'CMD' && frame.brandRaw === 'MiLightv1') {
            // Disco plus
            obj = {
                _id:      newId + '.DISCO_PLUS',
                common: {
                    type:  'boolean',
                    name:   frame.brandRaw + ' ' + index + ' DISCO_PLUS',
                    role:  'button',
                    read:  false,
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr   = 'DISCO';
            obj.native.value  = 'DISCO+';
            objs.push(obj);

            obj = {
                _id:      newId + '.DISCO_MINUS',
                common: {
                    type:  'boolean',
                    read:  false,
                    role:  'button',
                    name:  frame.brandRaw + ' ' + index + ' DISCO_MINUS',
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr   = 'DISCO';
            obj.native.value  = 'DISCO-';
            objs.push(obj);

            obj = {
                _id:      newId + '.MODE',
                common: {
                    type:  'number',
                    read:  false,
                    min:   0,
                    max:   8,
                    role:  'level.mode',
                    name:  frame.brandRaw + ' ' + index + ' MODE',
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr   = 'MODE';
            objs.push(obj);

            obj = {
                _id:      newId + '.BRIGHTNESS',
                common: {
                    type:  'number',
                    read:  false,
                    min:   0,
                    max:   255,
                    role:  'level.dimmer',
                    name:  frame.brandRaw + ' ' + index + ' BRIGHTNESS',
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr   = 'BRIGHT';
            objs.push(obj);

            obj = {
                _id:      newId + '.COLOR',
                common: {
                    type:  'number',
                    read:  false,
                    min:   0,
                    max:   255,
                    role:  'level.color',
                    name:  frame.brandRaw + ' ' + index + ' COLOR',
                    write: true
                },
                native: JSON.parse(JSON.stringify(native)),
                type:   'state'
            };
            obj.native.attr   = 'COLOR';
            objs.push(obj);
        }
    }

    return objs;
}

function stringifyFrame(frame, max) {
    var text = '';
    var count = 0;
    for (var attr in frame) {
        if (doNotProcess.indexOf(attr) !== -1) continue;
        if (attr === 'CMD') {
            if (frame.stop) {
                text += (text ? ', ': '') + '<b>BLIND STOP ' + frame.SWITCH + '</b>: ' + frame[attr];
            } else if (frame.blind) {
                text += (text ? ', ': '') + '<b>BLIND ' + frame.SWITCH + '</b>: ' + frame[attr];
            } else if (frame.set_level) {
                text += (text ? ', ': '') + '<b>SET_LEVEL ' + frame.SWITCH + '</b>: ' + frame[attr];
            } else if (frame.all) {
                text += (text ? ', ': '') + '<b>ALL ' + frame.SWITCH + '</b>: ' + frame[attr];
            } else  {
                text += (text ? ', ': '') + '<b>SWITCH ' + frame.SWITCH + '</b>: ' + frame[attr];
            }
        }
        text += (text ? ', ': '') + '<b>' + attr + '</b>: ' + frame[attr];
        count++;
        if (max && count >= max) break;
    }

    return text;
}



if (typeof module !== 'undefined' && module.parent) {
    module.exports = {
        parseString:    parseString,
        analyseFrame:   analyseFrame,
        encodeValue:    encodeValue,
        doNotProcess:   doNotProcess,
        stringifyFrame: stringifyFrame
    };
}