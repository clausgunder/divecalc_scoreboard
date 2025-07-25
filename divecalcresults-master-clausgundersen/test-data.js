import net from 'net';
import os from 'os';

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

const testData = {
    event: {
        name: "Test Event",
        round: 1,
        currentDiver: {
            name: "Test Diver",
            club: "Test Club",
            dive: {
                number: "103C",
                description: "Forward 1½ Somersault Tuck",
                difficulty: 1.6
            }
        },
        scores: [7.0, 7.5, 7.0, 7.5, 7.0],
        total: 34.80
    }
};

// Function to send data to a TCP server
const sendDataToServer = (host, port) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        
        client.connect(port, host, () => {
            console.log(`Connected to server at ${host}:${port}`);
            client.write(JSON.stringify(testData));
        });
        
        client.on('data', (data) => {
            console.log(`Received from ${host}:${port}:`, data.toString());
            client.end();
        });
        
        client.on('error', (error) => {
            console.error(`Error connecting to ${host}:${port}:`, error.message);
            client.destroy();
            reject(error);
        });
        
        client.on('close', () => {
            console.log(`Connection to ${host}:${port} closed`);
            resolve();
        });
    });
};

// Send to local server
sendDataToServer('127.0.0.1', 9090)
    .then(() => {
        console.log('Successfully sent data to local server');
        
        // Now send to Unreal Engine (assuming it's listening on the same port)
        // You can change the port if Unreal is listening on a different one
        return sendDataToServer(localIp, 9090);
    })
    .then(() => {
        console.log('Successfully sent data to Unreal Engine');
        process.exit(0);
    })
    .catch(error => {
        console.error('Failed to send data:', error);
        process.exit(1);
    });