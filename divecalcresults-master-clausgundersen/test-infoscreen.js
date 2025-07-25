import { io } from 'socket.io-client';

const socket = io('http://localhost:9001');

const testData = {
    "bergen_test": {
        action: "dive",
        competition: "Test Competition",
        place: "Test Location",
        latestUpdate: Date.now(),
        diver: {
            name: "Test Diver",
            nationality: "NOR",
            position: 1,
            rank: 1,
            result: "68.25",
            team: "Test Club",
            dive: {
                dive: "105B",
                dd: "2.4",
                height: "3",
                position: 1
            }
        },
        event: {
            name: "Men's 3m Springboard",
            round: 1,
            rounds: 6,
            divesPerRound: 1,
            startTime: Date.now(),
            results: [
                {
                    name: "Test Diver",
                    nationality: "NOR",
                    position: 1,
                    rank: 1,
                    result: "68.25",
                    team: "Test Club"
                }
            ]
        }
    }
};

// Send test data every 5 seconds
setInterval(() => {
    console.log('Sending test data...');
    socket.emit('screen', testData);
}, 5000);

// Handle connection events
socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('screen', testData); // Send initial data
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});