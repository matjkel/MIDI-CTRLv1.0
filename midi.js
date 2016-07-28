
var AudioContext = AudioContext;
var context      = new AudioContext();
var analyser     = context.createAnalyser();
var btnBox       = document.getElementById('content');
var btn          = document.getElementsByClassName('button');


var data,
    cmd,
    chnl,
    type,
    note,
    vel,
    midi;

var sampleMap = {
    note1: 1,
    note2: 2,
    note3: 3,
    note4: 4,
    note5: 5,
    note6: 6,
    note7: 7,
    note8: 8,
    note9: 9,
    note10: 15,
    note11: 11,
    note12: 12,
    note13: 13,
    note14: 14,
    note15: 15,
    note16: 16,
};

// request MIDI access to get this party started !!
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI fun for you");
}

// loop through all media to prepare audio files
for (var i = 0; i < btn.length; i++) {
    addAudio(btn[i]);
    console.log("preparing files:")
}

function onMIDISuccess(midiAccess) {
    midi = midiAccess;
    var inputs = midi.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = onMIDIMessage;
        listInputs(input);
    }
    midi.onstatechange = onStateChange;
}

function onMIDIMessage(event) {

    data = event.data,
    cmd = data[0] >> 4,
    chnl = data[0] & 0xf,
    type = data[0] & 0xf0,
    note = data[1],
    vel = data[2];

    switch (type) {
      // MIDI noteOn message
        case 144:
             noteOn(note, vel);
             console.log("HE HIT ME!!")
             break;
      // MIDI noteOff message
        case 128:
            noteOff(note, vel);
            break;
    }
    console.log('MIDI data ', data);
}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") console.log("name", name, "port", port, "state", state);
}

// logs controller info to console
function listInputs(inputs) {
    var input = inputs.value;
    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
        "' Yo, BOI!!, You be playin' wit a(n) " + input.name +
        "', version: '" + input.version + "']");
}
// PLAY YOUR SOUNDS; helper functions
function noteOn(midiNote, vel) {
    player(midiNote, vel);
}

function noteOff(midiNote, vel) {
    player(midiNote, vel);
}

function player(note, vel) {
    var sample = sampleMap['note' + note];
    if (sample) {
        // debugger;
        if (type == (0x80 & 0xf0) || vel == 0) {
            btn[sample - 1].classList.remove('active');
            return;
        }
        btn[sample - 1].classList.add('active');
        btn[sample - 1].play(vel);
        // debugger;
    }
}

function onMIDIFailure(e) {
    console.log("No access to MIDI devices or you're on the wrong browser" + e);
}
// decode your sounds, using xml
function loadAudio(object, url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    console.log("url: ", url)
    request.responseType = 'arraybuffer';

    request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
            object.buffer = buffer;
        });
    }
    request.send();
}
function addAudio(object) {
    object.name = object.id;
    object.source = object.dataset.sound;
    loadAudio(object, object.source);

    object.play = function (volume) {
        var source = context.createBufferSource();
        var gain = context.createGain();
        var v;
        source.buffer = object.buffer;
        if (volume) {
            source.connect(gain);
            // every source needs a destination
            gain.connect(context.destination);
        } else {
            source.connect(context.destination);
        }
        source.start();
        object.source = source;
    }
}
// more helper functions
function rangeMap(x, a1, a2, b1, b2) {
    return ((x - a1) / (a2 - a1)) * (b2 - b1) + b1;
}

function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}
