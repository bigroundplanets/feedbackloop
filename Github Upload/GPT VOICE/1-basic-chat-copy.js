// const url = "https://api.openai.com/v1/chat/completions";


const API_KEY = "YOUR_API_KEY";

const url = "https://api.openai.com/v1/chat/completions";


// Structure of how to communicate with chatGPT API
let options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + API_KEY,
  },
};

// Speech recognition and output variables
let speechRec;
let said = '';
let spoutput;

// GUI elements
let myButton, myInput, myOutput;

function setup() {
  noCanvas(); 
  background(200); 

  // Setup the input field
  myInput = createInput(); // Initialize the input field
  myInput.position(20, 20);
  myInput.size(500); // Set the size of the input field
  myInput.style('color', 'black'); // Ensure the text color is visible

  // SPEECH RECOGNITION 
  // Create a Speech Recognition object with callback
  speechRec = new p5.SpeechRec('en-UK', gotSpeech);
  // "Continuous recognition" (as opposed to one time only)
  let continuous = true;
  // If you want to try partial recognition (faster, less accurate)
  let interimResults = false;
  // This must come after setting the properties
  speechRec.start(continuous, interimResults);

  // Speech recognized event
  function gotSpeech() {
    // Something is there
    // Get it as a string, you can also get JSON with more info
    console.log(speechRec);
    if (speechRec.resultValue) {
      said = speechRec.resultString; // Store the recognized speech in the global 'said' variable
      // Show user
      myInput.value(said); // Set the recognized speech into the input box

      // Check word count
      let wordCount = said.split(/\s+/).length;
      if (wordCount >= 1) {
        getText(); // Submit the input automatically after 8 words
      }
    }
  }

  // Set up speech callback for talking aloud
  speech = new p5.Speech(voiceReady); //callback, speech synthesis object
  // speech.onLOad = voiceReady;
  speech.started(startSpeaking);

  function startSpeaking() {
    background(0,255,0);
  }
  
  function voiceReady() {
    console.log(speech.voices);
  }


  // Setup the button
  myButton = createButton("Submit");
  myButton.position(540, 20);
  myButton.mousePressed(getText); // Attach the getText function to the button

  // Setup the output paragraph
  myOutput = createElement("p", "Results:");
  myOutput.position(20, 80); 
}

function getText() {
  var inputValue = myInput.value(); // Get the value from the input field
  console.log("spoutput", inputValue); // Log the input value to the console

  if (!inputValue) { // Check if the input is empty
    return; // If empty, do nothing
  }

  // Prepare the body for the API request
  options.body = JSON.stringify(
    {
    model: "gpt-3.5-turbo-0125", // Specify the model to use
    messages: [
      {
        "role": "system",
        "content": "you are a sad clown, without makeup"
      },
      {
        "role": "user",
        "content": inputValue // Use the input value as the user message
      }
    ],
    max_tokens: 50, // Limit the response size
    temperature: 0.8 // Temperature set for randomness 
  }
);

  // Make the API request
  fetch(url, options)
    .then(function(response) {
      return response.json(); // Convert the response to JSON
    })
    .then(function(response) {
      if (response.choices && response.choices[0]) { // Check if there are choices in the response
        var assistantMessage = response.choices[0].message.content; // Get the assistant's 'answer'
        
        // Display the response
        console.log("response:", assistantMessage); // Log the assistant's message
        myOutput.html(assistantMessage);
        speech.setVoice('SpeechSynthesisVoice');
        speech.speak(assistantMessage); // say something
      }
    });
}


