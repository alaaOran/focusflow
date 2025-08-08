# Minimal Flask backend for optional persistence (stores JSON to data.json)
from flask import Flask, request, jsonify
from pathlib import Path
import json

app = Flask(__name__)
DATA = Path(__file__).parent / 'data.json'
if not DATA.exists():
    DATA.write_text(json.dumps({'tasks':[], 'notes':[], 'diary':{}}))

def read():
    return json.loads(DATA.read_text())

def write(data):
    DATA.write_text(json.dumps(data, indent=2))

@app.get('/api/data')
def get_data():
    return jsonify(read())

@app.post('/api/data')
def save_data():
    payload = request.get_json() or {}
    write(payload)
    return jsonify({'status':'ok'})

if __name__ == '__main__':
    app.run(port=5000)