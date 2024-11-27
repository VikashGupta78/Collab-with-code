import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    transports: ['websocket'], // Ensure 'websocket' is a string
  };

  console.log('Connecting to:', process.env.REACT_APP_BACKEND_URL);
  console.log('Options:', options);

  return io(process.env.REACT_APP_BACKEND_URL, options);
};
