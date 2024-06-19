from flask import Flask, request, jsonify
import whisper
import numpy as np
import base64

app = Flask(__name__)

# Load the Whisper model
model = whisper.load_model("base")

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    try:
        # Get audio data from the request
        audio_data = request.json.get("audio_data")
        temperature = request.json.get("temperature", 0.7)  # Default temperature if not provided
        audio_bytes = base64.b64decode(audio_data)
        audio_array = np.frombuffer(audio_bytes, dtype=np.float32)

        # Transcribe the audio with the specified temperature
        result = model.transcribe(audio_array, temperature=temperature)
        return jsonify({"transcription": result["text"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
