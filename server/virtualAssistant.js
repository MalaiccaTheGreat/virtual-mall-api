const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { Readable } = require('stream');
const { ElevenLabs } = require('elevenlabs-node');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize ElevenLabs
const voice = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      // Process message with GPT-4
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful virtual assistant. Keep responses concise and natural. Include an emotion with each response (happy, sad, surprised, angry, or neutral).',
          },
          {
            role: 'user',
            content: data.message,
          },
        ],
      });

      const response = completion.choices[0].message.content;

      // Extract emotion from response (assuming it's in format: [emotion] response text)
      const emotionMatch = response.match(/\[(.*?)\]/);
      const emotion = emotionMatch ? emotionMatch[1].toLowerCase() : 'neutral';
      const cleanResponse = response.replace(/\[.*?\]/, '').trim();

      // Send response to client
      ws.send(
        JSON.stringify({
          text: cleanResponse,
          expression: emotion,
        })
      );
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(
        JSON.stringify({
          text: "I'm sorry, I encountered an error processing your request.",
          expression: 'sad',
        })
      );
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Text-to-speech endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;

    // Generate audio with ElevenLabs
    const audioStream = await voice.textToSpeech({
      text,
      voiceId: 'your-voice-id', // Replace with your chosen voice ID
      model: 'eleven_monolingual_v1',
    });

    // Convert buffer to stream
    const readableStream = new Readable();
    readableStream.push(audioStream);
    readableStream.push(null);

    // Set response headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Pipe the audio stream to response
    readableStream.pipe(res);
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Error generating speech' });
  }
});

// Start Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { Readable } = require('stream');
const { ElevenLabs } = require('elevenlabs-node');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize ElevenLabs
const voice = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      // Process message with GPT-4
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful virtual assistant. Keep responses concise and natural. Include an emotion with each response (happy, sad, surprised, angry, or neutral).',
          },
          {
            role: 'user',
            content: data.message,
          },
        ],
      });

      const response = completion.choices[0].message.content;

      // Extract emotion from response (assuming it's in format: [emotion] response text)
      const emotionMatch = response.match(/\[(.*?)\]/);
      const emotion = emotionMatch ? emotionMatch[1].toLowerCase() : 'neutral';
      const cleanResponse = response.replace(/\[.*?\]/, '').trim();

      // Send response to client
      ws.send(
        JSON.stringify({
          text: cleanResponse,
          expression: emotion,
        })
      );
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(
        JSON.stringify({
          text: "I'm sorry, I encountered an error processing your request.",
          expression: 'sad',
        })
      );
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Text-to-speech endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;

    // Generate audio with ElevenLabs
    const audioStream = await voice.textToSpeech({
      text,
      voiceId: 'your-voice-id', // Replace with your chosen voice ID
      model: 'eleven_monolingual_v1',
    });

    // Convert buffer to stream
    const readableStream = new Readable();
    readableStream.push(audioStream);
    readableStream.push(null);

    // Set response headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Pipe the audio stream to response
    readableStream.pipe(res);
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Error generating speech' });
  }
});

// Start Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
