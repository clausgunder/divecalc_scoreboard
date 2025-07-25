// test-divecalc.js
// Run this script with: node test-divecalc.js

import net from 'net';
import os from 'os';
import { io } from 'socket.io-client';

// Get the local IP address
const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (loopback) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback to localhost
};

const localIp = getLocalIpAddress();
console.log(`Local IP address: ${localIp}`);

// Connect to WebSocket server for frontend updates
const socket = io('http://localhost:9001');
socket.on('connect', () => console.log('Connected to WebSocket server'));
socket.on('connect_error', (err) => console.error('WebSocket error:', err));

// Sample diving data to send to the server
const sampleData = {
    action: "dive",
    competition: "Test Competition",
    place: "Test Location",
    event: {
        name: "Men's 3m Springboard",
        round: 1,
        rounds: 6,
        divesPerRound: 1,
        startTime: Date.now(),
        results: [
            {
                name: "John Smith",
                nationality: "USA",
                position: 1,
                rank: 1,
                result: "68.25",
                team: "Team A"
            },
            {
                name: "Alex Johnson",
                nationality: "CAN",
                position: 2,
                rank: 2,
                result: "65.10",
                team: "Team B"
            }
        ]
    },
    diver: {
        name: "John Smith",
        nationality: "USA",
        position: 1,
        rank: 1,
        result: "68.25",
        team: "Team A",
        dive: {
            dive: "107B",
            dd: "3.3",
            height: "3",
            position: 1
        }
    },
    latestUpdate: Date.now()
};

// Connect to the DiveCalc server
const client = new net.Socket();
const serverHost = '127.0.0.1';
const serverPort = 9090;

console.log(`Connecting to ${serverHost}:${serverPort}...`);

client.connect(serverPort, serverHost, () => {
    console.log('Connected to server');

    // Wait for the initial server response
    setTimeout(() => {
        console.log('Sending sample data...');
        client.write(JSON.stringify(sampleData));
    }, 1000);
});

client.on('data', (data) => {
    console.log('Received from server:', data.toString().trim());
});

client.on('error', (err) => {
    console.error('Connection error:', err);
});

client.on('close', () => {
    console.log('Connection closed');
});

// Close the connection after 5 seconds
setTimeout(() => {
    console.log('Closing connection...');
    client.end();
    
    // Broadcast to WebSocket for frontend
    socket.emit('screen', sampleData);
    console.log('Broadcasted data to WebSocket clients');
}, 5000);