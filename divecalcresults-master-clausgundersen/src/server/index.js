import Koa from 'koa';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import net from 'net';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Koa app
const app = new Koa();
app.use(bodyParser({ enableTypes: ['json', 'text'], extendTypes: { text: ['text/plain'] } }));
const httpServer = createServer(app.callback());
const io = new Server(httpServer);

// Serve static files
app.use(serve(join(__dirname, '../../dist')));
app.use(serve(join(__dirname, '../../public')));

// Store the latest data
const latestData = {};

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send the latest data to the newly connected client
  if (Object.keys(latestData).length > 0) {
    console.log('Sending existing data to new client');
    socket.emit('screen', latestData);
  }
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Track DiveCalc connection status
let diveCalcStatus = {
  connected: false,
  lastDataReceived: null,
  lastConnectionTime: null,
  connectionCount: 0,
  clientAddress: null
};

// Function to broadcast DiveCalc status to all clients
const broadcastDiveCalcStatus = () => {
  console.log('Broadcasting DiveCalc status:', diveCalcStatus);
  io.emit('divecalc_status', diveCalcStatus);
};

// Create a TCP server to receive data from DiveCalc
const tcpServer = net.createServer((socket) => {
  console.log('DiveCalc connected from:', socket.remoteAddress + ':' + socket.remotePort);
  console.log('Connection established at:', new Date().toISOString());
  
  // Update connection status
  diveCalcStatus.connected = true;
  diveCalcStatus.lastConnectionTime = new Date().toISOString();
  diveCalcStatus.connectionCount++;
  diveCalcStatus.clientAddress = socket.remoteAddress + ':' + socket.remotePort;
  
  // Broadcast updated status to all clients
  broadcastDiveCalcStatus();
  
  let buffer = '';
  

  // Remove the duplicate import at line 74:
  // import net from 'net'; // This is already imported in your code
  
  // Add this near the top of your file (after the existing imports)
  // Add configuration for the remote server
  const REMOTE_SERVER = {
    host: process.env.FORWARD_HOST || '192.168.1.100', // Default IP, replace with actual IP
    port: parseInt(process.env.FORWARD_PORT || '9090', 10),
    enabled: process.env.ENABLE_FORWARDING === 'true' // Set to 'true' to enable forwarding
  };
  
  // Create a TCP client to forward data
  let forwardingClient = null;
  let forwardingConnected = false;
  
  // Function to connect to the remote server
  const connectToRemoteServer = () => {
    if (forwardingClient) {
      // Close existing connection if any
      forwardingClient.destroy();
    }
    
    console.log(`Attempting to connect to remote server at ${REMOTE_SERVER.host}:${REMOTE_SERVER.port}`);
    
    forwardingClient = new net.Socket();
    
    forwardingClient.connect(REMOTE_SERVER.port, REMOTE_SERVER.host, () => {
      console.log(`Connected to remote server at ${REMOTE_SERVER.host}:${REMOTE_SERVER.port}`);
      forwardingConnected = true;
    });
    
    forwardingClient.on('error', (err) => {
      console.error('Error connecting to remote server:', err.message);
      forwardingConnected = false;
      
      // Try to reconnect after a delay
      setTimeout(connectToRemoteServer, 5000);
    });
    
    forwardingClient.on('close', () => {
      console.log('Connection to remote server closed');
      forwardingConnected = false;
      
      // Try to reconnect after a delay
      setTimeout(connectToRemoteServer, 5000);
    });
  };
  
  // Connect to the remote server if forwarding is enabled
  if (REMOTE_SERVER.enabled) {
    connectToRemoteServer();
  }
  
  // Then modify the forwarding logic to check if it's enabled
  socket.on('data', (data) => {
    const rawData = data.toString();
    console.log('------- INCOMING DATA FROM DIVECALC -------');
    console.log('Received raw data from DiveCalc:', rawData);
    console.log('Data length:', rawData.length);
    console.log('Received at:', new Date().toISOString());
    
    // Forward the raw data to the remote server
    if (REMOTE_SERVER.enabled && forwardingConnected && forwardingClient) {
      forwardingClient.write(data, (err) => {
        if (err) {
          console.error('Error forwarding data to remote server:', err.message);
        } else {
          console.log('Data forwarded to remote server successfully');
        }
      });
    }
    
    // Check if this looks like an HTTP request...
    // Parse the actual data from DiveCalc...
  });
});

socket.on('end', () => {
  console.log('DiveCalc disconnected at:', new Date().toISOString());
  
  // Update connection status
  diveCalcStatus.connected = false;
  broadcastDiveCalcStatus();
});

socket.on('error', (err) => {
  console.error('Socket error:', err);
  console.error('Error occurred at:', new Date().toISOString());
  
  // Update connection status on error
  diveCalcStatus.connected = false;
  broadcastDiveCalcStatus();
});

socket.on('timeout', () => {
  console.log('Socket connection timed out at:', new Date().toISOString());
});

// Start the servers
const PORT = process.env.PORT || 9001;
const TCP_PORT = process.env.TCP_PORT || 9090;

// Listen on all network interfaces (0.0.0.0) instead of just localhost
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP server listening on port ${PORT} (accessible from network)`);
});

tcpServer.listen(TCP_PORT, '0.0.0.0', () => {
  console.log(`TCP server listening on port ${TCP_PORT} (accessible from network)`);
});

// Add a test route to verify the server is running
app.use(async (ctx) => {
  if (ctx.path === '/api/status') {
    ctx.body = {
      status: 'ok',
      data: Object.keys(latestData).length > 0 ? 'Data available' : 'No data yet',
      diveCalcStatus: diveCalcStatus
    };
  }
});

// Add this to your Koa app setup
app.use(async (ctx) => {
  if (ctx.path === '/debug/data') {
    ctx.body = {
      timestamp: new Date().toISOString(),
      data: latestData
    };
  }
});

// Add a route to handle DiveCalc HTTP requests
app.use(async (ctx) => {
  if (ctx.path === '/api/divecalc') {
    console.log('Received HTTP request from DiveCalc');
    
    // Parse the request body if it's a POST request
    let data;
    if (ctx.method === 'POST') {
      try {
        console.log('------- INCOMING HTTP DATA FROM DIVECALC -------');
        console.log('Received HTTP POST request at:', new Date().toISOString());
        console.log('Request headers:', JSON.stringify(ctx.headers));
        
        // Get the raw body data
        const body = await getRawBody(ctx.req);
        const rawData = body.toString();
        console.log('Raw data from DiveCalc (HTTP):', rawData);
        console.log('Data length:', rawData.length);
        
        // Try to parse as JSON
        try {
          data = JSON.parse(rawData);
          console.log('Successfully parsed JSON data:');
          console.log('- Keys found:', Object.keys(data).join(', '));
          
          // Store the data
          console.log('Storing parsed data in memory:');
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              latestData[key] = data[key];
              console.log(`- Stored data for key: ${key}`);
              
              // Log data structure details
              const value = data[key];
              if (typeof value === 'object' && value !== null) {
                console.log(`  - Sub-keys:`, Object.keys(value).join(', '));
                
                // If there's an 'action' field, log it specifically and normalize it
                if (value.action) {
                  console.log(`  - Action:`, value.action);
                  
                  // Normalize action values to match client-side expectations
                  const validActions = [
                    "Present Event", "Present Judges", "Present Dive", 
                    "Display Awards", "Show Start List", "Show Results"
                  ];
                  
                  // Map DiveCalc action names to client component action names
                  if (validActions.includes(value.action)) {
                    // Convert action names to match client component expectations
                    switch (value.action) {
                      case "Present Judges":
                        value.action = "judges";
                        break;
                      case "Present Dive":
                        value.action = "dive";
                        break;
                      case "Display Awards":
                        value.action = "awards";
                        break;
                      case "Show Start List":
                        value.action = "startlist";
                        break;
                      case "Show Results":
                        value.action = "results";
                        break;
                      case "Present Event":
                        value.action = "event";
                        break;
                      default:
                        // Keep the action as is if not matched
                        break;
                    }
                    console.log(`  - Normalized action to:`, value.action);
                  }
                }
                
                // If there's a 'diver' field, log it specifically
                if (value.diver) {
                  console.log(`  - Diver:`, value.diver.name, value.diver.nationality);
                  if (value.diver.dive) {
                    console.log(`  - Dive:`, value.diver.dive.dive, 'DD:', value.diver.dive.dd);
                  }
                }
              }
            }
          }
          
          // Broadcast to all connected clients
          console.log('Broadcasting data to all connected clients:');
          console.log('- Number of connected clients:', io.engine.clientsCount);
          console.log('- Broadcast timestamp:', new Date().toISOString());
          io.emit('screen', latestData);
          
          ctx.body = { status: 'ok' };
          console.log('------- END OF HTTP DATA PROCESSING -------');
        } catch (e) {
          console.error('Error parsing JSON:', e.message);
          ctx.body = { status: 'error', message: 'Invalid JSON' };
          ctx.status = 400;
        }
      } catch (e) {
        console.error('Error reading request body:', e.message);
        ctx.body = { status: 'error', message: 'Error reading request body' };
        ctx.status = 500;
      }
    } else {
      ctx.body = { status: 'ok', message: 'DiveCalc endpoint ready' };
    }
    return;
  }
});

// Helper function to get raw request body
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}