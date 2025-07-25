// src/client/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import BigScreen from './components/BigScreen';
import './styles/main.scss';

// Fix the Socket.IO connection to use the correct port
const socketURL = window.location.protocol + '//' + window.location.hostname + ':9001';
window.socketIO = io(socketURL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
});

// Track DiveCalc connection status
window.diveCalcStatus = {
  connected: false,
  lastDataReceived: null,
  lastConnectionTime: null
};

// Add connection status logging
window.socketIO.on('connect', () => {
  console.log('Socket.IO connected successfully to', socketURL);
  // Dispatch connected event
  const connectedEvent = new CustomEvent('socketConnected', { detail: socketURL });
  window.dispatchEvent(connectedEvent);
});

window.socketIO.on('connect_error', (error) => {
  console.error('Socket.IO connection error:', error);
  // Dispatch error event
  const errorEvent = new CustomEvent('socketError', { detail: error });
  window.dispatchEvent(errorEvent);
});

// Listen for DiveCalc connection status updates
window.socketIO.on('divecalc_status', (status) => {
  console.log('DiveCalc connection status update:', status);
  window.diveCalcStatus = status;
  
  // Dispatch DiveCalc status event
  const statusEvent = new CustomEvent('diveCalcStatusUpdate', { detail: status });
  window.dispatchEvent(statusEvent);
});

// Helper function for URL parameters (referenced in scoreboard_auto.jsx)
window.getParameterByName = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

// Global state to store competition data
window.competitionData = {};

// Add a global handler for the 'screen' event to process incoming data
window.socketIO.on('screen', (data) => {
  console.log('Received screen data:', data);
  
  try {
    // If data is a string, try to parse it as JSON
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    
    // Store the data in our global state
    window.competitionData = data;
    
    // Update DiveCalc status - data received means DiveCalc is connected
    window.diveCalcStatus.connected = true;
    window.diveCalcStatus.lastDataReceived = new Date().toISOString();
    
    // Dispatch a custom event to notify components that data has changed
    const dataUpdateEvent = new CustomEvent('competitionDataUpdate', { detail: data });
    window.dispatchEvent(dataUpdateEvent);
    
    // Also dispatch a DiveCalc status update event
    const statusEvent = new CustomEvent('diveCalcStatusUpdate', { detail: window.diveCalcStatus });
    window.dispatchEvent(statusEvent);
    
    console.log('Processed competition data:', window.competitionData);
    console.log('DiveCalc status updated:', window.diveCalcStatus);
  } catch (error) {
    console.error('Error processing competition data:', error);
  }
});

// Render the appropriate component based on the page
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('Root element not found');
    return;
  }
  
  const root = createRoot(container);
  
  // Determine which page we're on based on the URL path
  const path = window.location.pathname;
  
  if (path.includes('bigscreen')) {
    root.render(<BigScreen channel="screen" />);
  } else if (path.includes('infoscreen')) {
    root.render(<BigScreen channel="info" hideScore={true} />);
  } else {
    // Default screen
    root.render(<BigScreen />);
  }
  
  console.log('React component rendered');
});