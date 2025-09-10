import React, { Component } from 'react';
import { Box, Button, VStack, Text } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          p={6} 
          bg="red.50" 
          borderRadius="md"
          borderLeft="4px"
          borderColor="red.500"
          textAlign="center"
        >
          <VStack spacing={4}>
            <Box color="red.500">
              <FaExclamationTriangle size={48} />
            </Box>
            <Text fontSize="xl" fontWeight="bold" color="red.700">
              Something went wrong
            </Text>
            <Text color="red.600" mb={4}>
              {this.props.errorMessage || 'An unexpected error occurred. Please try again.'}
            </Text>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box 
                p={4} 
                mt={4} 
                bg="blackAlpha.100" 
                borderRadius="md" 
                textAlign="left" 
                maxW="100%" 
                overflowX="auto"
              >
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Error Details:
                </Text>
                <Text as="pre" fontSize="xs" color="red.700">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo?.componentStack && (
                  <>
                    <Text fontSize="sm" fontWeight="bold" mt={4} mb={2}>
                      Component Stack:
                    </Text>
                    <Text as="pre" fontSize="xs" color="gray.700">
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </>
                )}
              </Box>
            )}
            <Button 
              colorScheme="red" 
              onClick={this.handleReset}
              mt={4}
            >
              {this.props.resetButtonText || 'Try Again'}
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
