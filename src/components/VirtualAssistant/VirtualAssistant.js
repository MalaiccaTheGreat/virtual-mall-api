import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, Button } from '@mui/material';
import { Mic, Close, Send } from '@mui/icons-material';
import { useSpeechRecognition } from 'react-speech-recognition';
import { useSpring, animated } from 'react-spring';

const VirtualAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && !isListening) {
      handleTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  const handleTranscript = async (text) => {
    setIsTyping(true);
    try {
      const response = await fetch('/api/virtual-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: text }),
      });
      const data = await response.json();
      setAssistantResponse(data.response);
    } catch (error) {
      setAssistantResponse('I apologize, but I encountered an error. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const springProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  return (
    <animated.div style={springProps}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          maxWidth: 400,
          margin: '20px auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Virtual Assistant
          </Typography>
          <IconButton
            onClick={() => setIsListening(!isListening)}
            color="primary"
          >
            {isListening ? <Close /> : <Mic />}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: '14px',
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Send />}
            onClick={() => handleTranscript(message)}
            disabled={!message}
          >
            Send
          </Button>
        </Box>

        {isTyping && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Thinking...
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                '& > div': {
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  animation: 'bounce 1s infinite',
                },
              }}
            >
              {[1, 2, 3].map((dot) => (
                <div key={dot} style={{ animationDelay: `${dot * 0.2}s` }} />
              ))}
            </Box>
          </Box>
        )}

        {assistantResponse && (
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
            }}
          >
            {assistantResponse}
          </Typography>
        )}
      </Paper>
    </animated.div>
  );
};

export default VirtualAssistant;
