from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # This will allow the frontend to make requests to this server

# Load product data to be able to search
with open('public/data/products.json') as f:
    products = json.load(f)

def process_message(message):
    """A simple NLP-like function to process user messages."""
    msg_lower = message.lower()

    if 'hello' in msg_lower or 'hi' in msg_lower:
        return "Hello! Welcome to Pulse & Threads. How can I help you shop today?"

    if 'search for' in msg_lower or 'find' in msg_lower:
        # Extract the search term
        search_term = msg_lower.replace('search for', '').replace('find', '').strip()
        found_products = [p for p in products if search_term in p['name'].lower()]
        if found_products:
            return f"I found {len(found_products)} item(s) matching '{search_term}'. You can find them on the products page!"
        else:
            return f"Sorry, I couldn't find any products matching '{search_term}'."

    if 'products' in msg_lower:
        return "You can browse all our latest items on the products page."

    if 'thank you' in msg_lower or 'thanks' in msg_lower:
        return "You're welcome! Is there anything else I can help with?"

    return "I'm sorry, I'm still in training. I can help with basic product searches. Try asking me to 'find blue jeans'."

@app.route('/api/assistant', methods=['POST'])
def assistant_api():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Invalid request. Message not found.'}), 400

    user_message = data['message']
    response_message = process_message(user_message)

    return jsonify({'response': response_message})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
