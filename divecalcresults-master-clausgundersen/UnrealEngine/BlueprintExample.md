# DiveCalc TCP Client Blueprint Implementation Example

This document provides a visual guide for implementing the DiveCalc TCP Client in Unreal Engine Blueprints.

## Blueprint Class Setup

### 1. Create a New Blueprint Class

1. In the Content Browser, click **Add New** > **Blueprint Class**
2. Select **DiveCalcTCPClient** as the parent class
3. Name it `BP_DiveCalcClient`

### 2. Configure the Blueprint

#### Event Graph - Connection Setup

![Connection Setup](https://placeholder.com/blueprint_connection_setup.png)

```
Event BeginPlay
|
+--> [Set Variable] ServerIP = "127.0.0.1" (or your DiveCalc server IP)
|
+--> [Call Function] ConnectToServer
     |
     +--> [Input] ServerIP
     +--> [Input] ServerPort = 9090
     |
     +--> [Branch] IsConnected?
         |
         +--> [True] Print String "Connected to DiveCalc Server"
         +--> [False] Print String "Failed to connect to DiveCalc Server"
```

#### Event Graph - Event Binding

```
Event BeginPlay
|
+--> [Create Event] Bind Event to OnCompetitionDataReceived
     |
     +--> [Custom Event] HandleCompetitionData (CompetitionData as input)
|
+--> [Create Event] Bind Event to OnConnectionStatusChanged
     |
     +--> [Custom Event] HandleConnectionStatus (IsConnected as input)
|
+--> [Create Event] Bind Event to OnConnectionError
     |
     +--> [Custom Event] HandleConnectionError (ErrorMessage as input)
```

#### Event Graph - Data Handling

```
[Custom Event] HandleCompetitionData (CompetitionData as input)
|
+--> [Set Variable] CurrentCompetitionData = CompetitionData
|
+--> [Call Function] UpdateUI
```

```
[Function] UpdateUI
|
+--> [Get] CurrentCompetitionData
     |
     +--> [Set Text] CompetitionNameText = CurrentCompetitionData.Competition
     +--> [Set Text] CompetitionPlaceText = CurrentCompetitionData.Place
     |
     +--> [Get] CurrentCompetitionData.Diver
     |    |
     |    +--> [Set Text] DiverNameText = Diver.Name
     |    +--> [Set Text] DiverNationalityText = Diver.Nationality
     |    +--> [Set Text] DiverTeamText = Diver.Team
     |    +--> [Set Text] DiverResultText = Diver.Result
     |    |
     |    +--> [Get] Diver.Dive
     |         |
     |         +--> [Set Text] DiveNumberText = Dive.Dive
     |         +--> [Set Text] DiveDDText = Dive.DD
     |         +--> [Set Text] DiveHeightText = Dive.Height
     |
     +--> [Get] CurrentCompetitionData.Event
          |
          +--> [Set Text] EventNameText = Event.Name
          +--> [Set Text] EventRoundText = Event.Round + "/" + Event.Rounds
          |
          +--> [ForEach Loop] Event.Results as Result
               |
               +--> [Add Row to Table] ResultsTable
                    |
                    +--> [Column] Position = Result.Position
                    +--> [Column] Name = Result.Name
                    +--> [Column] Nationality = Result.Nationality
                    +--> [Column] Team = Result.Team
                    +--> [Column] Score = Result.Result
```

## UI Widget Implementation

### 1. Create a Widget Blueprint

1. In the Content Browser, click **Add New** > **User Interface** > **Widget Blueprint**
2. Name it `WBP_DiveCalcDisplay`

### 2. Design the Widget Layout

Create a layout with the following elements:

- **Header Section**
  - Text Block for Competition Name
  - Text Block for Competition Location
  - Text Block for Event Name
  - Text Block for Current Round

- **Current Diver Section**
  - Text Block for Diver Name
  - Text Block for Nationality
  - Text Block for Team
  - Text Block for Current Score

- **Current Dive Section**
  - Text Block for Dive Number
  - Text Block for Dive DD
  - Text Block for Dive Height

- **Results Section**
  - Data Table for displaying all divers and their scores

### 3. Connect the Widget to the Client

In your level blueprint or game mode:

```
Event BeginPlay
|
+--> [Spawn Actor] BP_DiveCalcClient
     |
     +--> [Store] DiveCalcClient
|
+--> [Create Widget] WBP_DiveCalcDisplay
     |
     +--> [Store] DiveCalcDisplay
     +--> [Add to Viewport]
|
+--> [Get] DiveCalcClient
     |
     +--> [Get] DiveCalcDisplay
          |
          +--> [Set Variable] DiveCalcClient reference in widget
```

## Testing the Implementation

1. Ensure your DiveCalc server is running on the specified IP and port (9090)
2. Run your Unreal Engine project
3. The client should automatically connect to the server
4. When data is received, the UI should update with the competition information

## Troubleshooting

- If the connection fails, check that your server is running and accessible
- Verify that port 9090 is open and not blocked by a firewall
- Add debug print statements to track the flow of data
- Check the Output Log in Unreal Engine for any error messages

## Advanced Features

### Reconnection Logic

Add reconnection logic to handle server disconnections:

```
[Custom Event] HandleConnectionStatus (IsConnected as input)
|
+--> [Branch] IsConnected?
     |
     +--> [False] 
          |
          +--> [Delay] 5.0 seconds
          |
          +--> [Call Function] ConnectToServer
```

### Data Visualization

Extend the UI to include visual elements like:

- Bar charts for scores
- Country flags for nationalities
- Animations for score updates
- 3D visualization of dive positions