import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import OpenAI from 'openai';
import { Voice } from 'elevenlabs-node';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Initialize AI services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const elevenlabs = new Voice({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// WebSocket connection for real-time communication
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('user-input', async (data) => {
    try {
      // Get AI response
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful virtual assistant. Keep responses concise and natural.',
          },
          {
            role: 'user',
            content: data.message,
          },
        ],
        max_tokens: 150,
      });

      const response = completion.choices[0].message.content;

      // Generate speech from response
      const audioBuffer = await elevenlabs.textToSpeech({
        textInput: response,
        voiceId: process.env.ELEVENLABS_VOICE_ID,
        stability: 0.5,
        similarityBoost: 0.75,
      });

      // Send both text and audio back to client
      socket.emit('assistant-response', {
        text: response,
        audio: audioBuffer.toString('base64'),
      });
    } catch (error) {
      console.error('Error processing request:', error);
      socket.emit('error', { message: 'Error processing your request' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
