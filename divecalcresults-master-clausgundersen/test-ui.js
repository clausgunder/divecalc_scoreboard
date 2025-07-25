import net from 'net';

// Sample data that matches the expected format
const testData = {
  "test_competition": {
    action: "dive",
    competition: "Test Competition",
    diver: {
      name: "Test Diver",
      nationality: "USA",
      position: 1,
      rank: 1,
      result: "68.25",
      dive: {
        dive: "107B",
        dd: "3.3",
        height: "3",
        effectiveAwards: [7.0, 7.5, 7.0, 7.5, 7.0],
        result: "23.10"
      }
    },
    event: {
      name: "Men's 3m Springboard",
      round: 1,
      rounds: 6,
      results: [
        {
          name: "Test Diver",
          nationality: "USA",
          position: 1,
          rank: 1,
          result: "68.25"
        },
        {
          name: "Second Diver",
          nationality: "CAN",
          position: 2,
          rank: 2,
          result: "65.10"
        }
      ]
    },
    latestUpdate: Date.now()
  }
};

// Connect to the server
const client = new net.Socket();

client.connect(9090, '127.0.0.1', () => {
  console.log('Connected to server');
  
  // Send the test data
  client.write(JSON.stringify(testData));
  console.log('Test data sent');
  
  // Keep connection open for 5 seconds to wait for response
  setTimeout(() => {
    console.log('Closing connection after timeout');
    client.end();
  }, 5000);
});

client.on('data', (data) => {
  console.log('Received response:', data.toString());
  // Don't close the connection immediately to allow for multiple responses
});

client.on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
});

client.on('close', () => {
  console.log('Connection closed');
  process.exit(0);
});

// Send data periodically to simulate continuous updates
let counter = 0;
const interval = setInterval(() => {
  if (client.destroyed) {
    clearInterval(interval);
    return;
  }
  
  counter++;
  const updatedData = JSON.parse(JSON.stringify(testData));
  updatedData.test_competition.latestUpdate = Date.now();
  updatedData.test_competition.event.round = counter;
  updatedData.test_competition.diver.result = (68.25 + counter).toFixed(2);
  
  client.write(JSON.stringify(updatedData));
  console.log(`Sent update #${counter}`);
  
  if (counter >= 3) {
    clearInterval(interval);
  }
}, 2000);