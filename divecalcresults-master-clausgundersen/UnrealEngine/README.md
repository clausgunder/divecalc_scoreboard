# DiveCalc TCP Client for Unreal Engine

This package provides a TCP client implementation for Unreal Engine to connect to the DiveCalc server on port 9090. It allows Unreal Engine projects to receive and display diving competition data in real-time.

## Implementation Details

### C++ Classes

- `DiveCalcTCPClient.h` - Header file defining the TCP client class and data structures
- `DiveCalcTCPClient.cpp` - Implementation of the TCP client functionality

### Features

- Connects to DiveCalc server via TCP on port 9090
- Parses JSON data from the server
- Provides Blueprint-accessible data structures for competition information
- Event dispatchers for data updates and connection status changes

## How to Use in Your Unreal Engine Project

### Setup Instructions

1. Copy the `DiveCalcTCPClient.h` and `DiveCalcTCPClient.cpp` files to your project's Source directory
2. Add the following to your project's Build.cs file:

```csharp
PublicDependencyModuleNames.AddRange(new string[] { 
    "Core", 
    "CoreUObject", 
    "Engine", 
    "InputCore", 
    "Json", 
    "JsonUtilities", 
    "Networking", 
    "Sockets" 
});
```

3. Rebuild your project

### Blueprint Usage Example

1. Create a new Blueprint class based on the `DiveCalcTCPClient` C++ class
2. In the Blueprint's Event Graph, add the following logic:

```
Event BeginPlay
|
+--> Call "ConnectToServer" function with your server IP (default port is 9090)
|
+--> Bind event to "OnCompetitionDataReceived"
     |
     +--> [Your display logic here]
```

3. Create UI widgets to display the competition data
4. Bind the data from the TCP client to your UI widgets

### Example Blueprint Implementation

Here's a simple example of how to implement a Blueprint that connects to the DiveCalc server and displays the data:

1. Create a new Blueprint class based on `DiveCalcTCPClient`
2. In the Event Graph:
   - On BeginPlay: Call ConnectToServer with the server IP (e.g., "127.0.0.1")
   - Create a custom event "OnDataReceived" with a CompetitionInfo parameter
   - Bind this event to the OnCompetitionDataReceived delegate
   - In the OnDataReceived event, update your UI widgets with the competition data

3. Create UI widgets for:
   - Competition name and location
   - Current diver information
   - Current dive details
   - Scoreboard with results

## Data Structure

The TCP client provides the following data structures:

- `FCompetitionInfo` - Overall competition information
- `FEventInfo` - Event details including round information
- `FDiverInfo` - Current diver information
- `FDiveInfo` - Current dive details
- `FEventResultInfo` - Results for each diver in the competition

## Troubleshooting

- Ensure the DiveCalc server is running and accessible on the specified IP and port
- Check the Unreal Engine log for connection errors
- Verify that your firewall allows connections on port 9090
- If using a development build, you can enable additional logging by adding:
  ```cpp
  UE_LOG(LogTemp, Log, TEXT("Your debug message here"));
  ```

## License

This code is provided as-is under the same license as the DiveCalc project.