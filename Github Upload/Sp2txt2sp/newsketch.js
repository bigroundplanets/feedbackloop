// Speech Object
let speech;
let said = '';
let recorder, soundFile;
let recording = false;
let output;

function setup() {
  noCanvas();
  
  // DOM element to display results
  output = createP('Waiting for input...');
  output.id('speech');
  
  // Create an audio input
  let mic = new p5.AudioIn();
  mic.start();

  // Create a sound recorder
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  // Create an empty sound file to record into
  soundFile = new p5.SoundFile();

  // Create a start button
  let startButton = createButton('Start Recording');
  startButton.mousePressed(startRecording);

  // Create a stop button
  let stopButton = createButton('Stop Recording');
  stopButton.mousePressed(stopRecording);
}

function startRecording() {
  if (!recording) {
    output.html('Recording...');
    recorder.record(soundFile);
    recording = true;
  }
}

function stopRecording() {
  if (recording) {
    recorder.stop();
    output.html('Processing...');
    recording = false;
    
    // Convert soundFile to a Blob and then to base64
    let audioBlob = soundFile.getBlob();
    let reader = new FileReader();
    reader.readAsArrayBuffer(audioBlob);
    reader.onloadend = function() {
      let audioArray = new Uint8Array(reader.result);
      let audioBase64 = btoa(String.fromCharCode.apply(null, audioArray));
      
      // Send audio to the server
      fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_data: audioBase64,
          temperature: 0.7  // You can adjust this value
        })
      })
      .then(response => response.json())
      .then(data => {
        output.html(data.transcription || data.error);
      })
      .catch(error => {
        output.html('Error: ' + error);
      });
    };
  }
}