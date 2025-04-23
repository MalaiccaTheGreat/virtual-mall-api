from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.debug = False  # Critical for production mode
CORS(app)

print("Starting Flask app...")

@app.route('/', methods=['GET'])
def home():
    return "Test app is running!"

@app.route('/recommendations', methods=['POST'])
def recommendations():
    print("Recommendations endpoint accessed")
    return jsonify({"recommendations": ["Product 1", "Product 2", "Product 3"]})

if __name__ == '__main__':
    app.run(port=5000)