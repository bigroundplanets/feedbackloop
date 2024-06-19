// A2Z F18
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F18

// how to make this better
// - add a start button
// - make text in the ji



// Speech Object
let speech;
let said = '';

function setup() {
  noCanvas();
  // Create a Speech Recognition object with callback
  speechRec = new p5.SpeechRec('en-UK', gotSpeech);
  // "Continuous recognition" (as opposed to one time only)
  let continuous = true;
  // If you want to try partial recognition (faster, less accurate)
  let interimResults = false;
  // This must come after setting the properties
  speechRec.start(continuous, interimResults);

  // DOM element to display results
  let output = select('#speech');

  // Speech recognized event
  function gotSpeech() {
    // Something is there
    // Get it as a string, you can also get JSON with more info
    console.log(speechRec);
    if (speechRec.resultValue) {
      let said = speechRec.resultString;
      // Show user
      output.html(said);
      speech.speak(speechRec.resultString); // say something
    }
  }
  //need something to show when it's recording in the ui 
  speech = new p5.Speech(voiceReady); //callback, speech synthesis object
  // speech.onLOad = voiceReady;
  speech.started(startSpeaking);
  //speech.ended(endSpeaking);
  // let wordran = random(word);
  
  function startSpeaking() {
    background(0,255,0);
  }
  
  
 
  
  function voiceReady() {
    console.log(speech.voices);
  }
  
}

function mousePressed() {
  speech.setVoice('SpeechSynthesisVoice');
  speech.speak(speechRec.resultString); // say something
}


