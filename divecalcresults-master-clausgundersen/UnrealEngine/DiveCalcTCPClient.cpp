#include "DiveCalcTCPClient.h"
#include "JsonObjectConverter.h"
#include "Dom/JsonObject.h"
#include "Serialization/JsonReader.h"
#include "Serialization/JsonSerializer.h"

ADiveCalcTCPClient::ADiveCalcTCPClient()
{
    PrimaryActorTick.bCanEverTick = true;
    Socket = nullptr;
    bConnected = false;
}

void ADiveCalcTCPClient::BeginPlay()
{
    Super::BeginPlay();
    
    // Set up a timer to check connection status
    GetWorldTimerManager().SetTimer(
        ConnectionCheckTimerHandle,
        this,
        &ADiveCalcTCPClient::CheckConnection,
        1.0f,
        true
    );
}

void ADiveCalcTCPClient::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
    DisconnectFromServer();
    Super::EndPlay(EndPlayReason);
}

void ADiveCalcTCPClient::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
    
    if (Socket && Socket->GetConnectionState() == SCS_Connected)
    {
        uint32 DataSize;
        while (Socket->HasPendingData(DataSize))
        {
            TArray<uint8> ReceivedBytes;
            ReceivedBytes.SetNumUninitialized(DataSize);
            
            int32 BytesRead = 0;
            Socket->Recv(ReceivedBytes.GetData(), ReceivedBytes.Num(), BytesRead);
            
            if (BytesRead > 0)
            {
                // Convert bytes to string and append to buffer
                FString ReceivedText = FString(UTF8_TO_TCHAR(reinterpret_cast<const char*>(ReceivedBytes.GetData())));
                ReceivedData.Append(ReceivedText);
                
                // Process the data
                ProcessData();
            }
        }
    }
}

bool ADiveCalcTCPClient::ConnectToServer(const FString& ServerIP, int32 ServerPort)
{
    // Create socket subsystem
    ISocketSubsystem* SocketSubsystem = ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM);
    if (!SocketSubsystem)
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to get socket subsystem"));
        return false;
    }
    
    // Create socket
    Socket = SocketSubsystem->CreateSocket(NAME_Stream, TEXT("DiveCalcTCPClient"), false);
    if (!Socket)
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to create socket"));
        return false;
    }
    
    // Set socket options
    Socket->SetNonBlocking(true);
    Socket->SetNoDelay(true);
    
    // Resolve server address
    TSharedRef<FInternetAddr> ServerAddr = SocketSubsystem->CreateInternetAddr();
    bool bIsValid = false;
    ServerAddr->SetIp(*ServerIP, bIsValid);
    if (!bIsValid)
    {
        UE_LOG(LogTemp, Error, TEXT("Invalid server IP: %s"), *ServerIP);
        SocketSubsystem->DestroySocket(Socket);
        Socket = nullptr;
        return false;
    }
    ServerAddr->SetPort(ServerPort);
    
    // Connect to server
    bool bConnectedSuccessfully = Socket->Connect(*ServerAddr);
    if (!bConnectedSuccessfully && SocketSubsystem->GetLastErrorCode() != SE_EWOULDBLOCK)
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to connect to server: %s"), 
            SocketSubsystem->GetSocketError(SocketSubsystem->GetLastErrorCode()));
        SocketSubsystem->DestroySocket(Socket);
        Socket = nullptr;
        return false;
    }
    
    bConnected = true;
    OnConnectionStatusChanged.Broadcast(true);
    UE_LOG(LogTemp, Log, TEXT("Connected to DiveCalc server at %s:%d"), *ServerIP, ServerPort);
    
    return true;
}

void ADiveCalcTCPClient::DisconnectFromServer()
{
    if (Socket)
    {
        ISocketSubsystem* SocketSubsystem = ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM);
        if (SocketSubsystem)
        {
            Socket->Close();
            SocketSubsystem->DestroySocket(Socket);
        }
        Socket = nullptr;
    }
    
    if (bConnected)
    {
        bConnected = false;
        OnConnectionStatusChanged.Broadcast(false);
        UE_LOG(LogTemp, Log, TEXT("Disconnected from DiveCalc server"));
    }
}

void ADiveCalcTCPClient::ProcessData()
{
    // Try to find complete JSON objects in the buffer
    int32 OpenBraceIndex = ReceivedData.Find(TEXT("{"));
    if (OpenBraceIndex == INDEX_NONE)
    {
        // No JSON object start found, clear buffer
        ReceivedData.Empty();
        return;
    }
    
    // Find the matching closing brace
    int32 BraceCount = 0;
    int32 CloseBraceIndex = INDEX_NONE;
    
    for (int32 i = OpenBraceIndex; i < ReceivedData.Len(); ++i)
    {
        if (ReceivedData[i] == '{')
        {
            BraceCount++;
        }
        else if (ReceivedData[i] == '}')
        {
            BraceCount--;
            if (BraceCount == 0)
            {
                CloseBraceIndex = i;
                break;
            }
        }
    }
    
    if (CloseBraceIndex == INDEX_NONE)
    {
        // No complete JSON object found yet
        return;
    }
    
    // Extract the JSON string
    FString JsonString = ReceivedData.Mid(OpenBraceIndex, CloseBraceIndex - OpenBraceIndex + 1);
    ReceivedData.RemoveAt(0, CloseBraceIndex + 1);
    
    // Parse the JSON
    TSharedPtr<FJsonObject> JsonObject;
    TSharedRef<TJsonReader<>> JsonReader = TJsonReaderFactory<>::Create(JsonString);
    
    if (FJsonSerializer::Deserialize(JsonReader, JsonObject) && JsonObject.IsValid())
    {
        // Convert to our competition info struct
        FCompetitionInfo CompetitionInfo;
        
        // Parse basic competition info
        CompetitionInfo.Competition = JsonObject->GetStringField(TEXT("competition"));
        CompetitionInfo.Place = JsonObject->GetStringField(TEXT("place"));
        CompetitionInfo.Action = JsonObject->GetStringField(TEXT("action"));
        CompetitionInfo.DateFmt = JsonObject->GetStringField(TEXT("dateFmt"));
        
        // Parse event info
        const TSharedPtr<FJsonObject>* EventObject;
        if (JsonObject->TryGetObjectField(TEXT("event"), EventObject))
        {
            CompetitionInfo.Event.Name = (*EventObject)->GetStringField(TEXT("name"));
            CompetitionInfo.Event.Round = (*EventObject)->GetIntegerField(TEXT("round"));
            CompetitionInfo.Event.Rounds = (*EventObject)->GetIntegerField(TEXT("rounds"));
            CompetitionInfo.Event.Finished = (*EventObject)->GetBoolField(TEXT("finished"));
            
            // Parse results
            const TArray<TSharedPtr<FJsonValue>>* ResultsArray;
            if ((*EventObject)->TryGetArrayField(TEXT("results"), ResultsArray))
            {
                for (const TSharedPtr<FJsonValue>& ResultValue : *ResultsArray)
                {
                    const TSharedPtr<FJsonObject>& ResultObject = ResultValue->AsObject();
                    
                    FEventResultInfo ResultInfo;
                    ResultInfo.Name = ResultObject->GetStringField(TEXT("name"));
                    ResultInfo.ShortName = ResultObject->GetStringField(TEXT("shortName"));
                    ResultInfo.Team = ResultObject->GetStringField(TEXT("team"));
                    ResultInfo.Nationality = ResultObject->GetStringField(TEXT("nationality"));
                    ResultInfo.Position = ResultObject->GetIntegerField(TEXT("position"));
                    ResultInfo.Result = ResultObject->GetStringField(TEXT("result"));
                    
                    CompetitionInfo.Event.Results.Add(ResultInfo);
                }
            }
        }
        
        // Parse diver info
        const TSharedPtr<FJsonObject>* DiverObject;
        if (JsonObject->TryGetObjectField(TEXT("diver"), DiverObject))
        {
            CompetitionInfo.Diver.Name = (*DiverObject)->GetStringField(TEXT("name"));
            CompetitionInfo.Diver.ShortName = (*DiverObject)->GetStringField(TEXT("shortName"));
            CompetitionInfo.Diver.Team = (*DiverObject)->GetStringField(TEXT("team"));
            CompetitionInfo.Diver.Nationality = (*DiverObject)->GetStringField(TEXT("nationality"));
            CompetitionInfo.Diver.Position = (*DiverObject)->GetIntegerField(TEXT("position"));
            CompetitionInfo.Diver.Result = (*DiverObject)->GetStringField(TEXT("result"));
            
            if ((*DiverObject)->HasField(TEXT("rank")))
            {
                CompetitionInfo.Diver.Rank = (*DiverObject)->GetIntegerField(TEXT("rank"));
            }
            
            // Parse dive info
            const TSharedPtr<FJsonObject>* DiveObject;
            if ((*DiverObject)->TryGetObjectField(TEXT("dive"), DiveObject))
            {
                CompetitionInfo.Diver.Dive.Dive = (*DiveObject)->GetStringField(TEXT("dive"));
                CompetitionInfo.Diver.Dive.DiverName = (*DiveObject)->GetStringField(TEXT("diverName"));
                CompetitionInfo.Diver.Dive.DiverShortName = (*DiveObject)->GetStringField(TEXT("diverShortName"));
                CompetitionInfo.Diver.Dive.DD = (*DiveObject)->GetStringField(TEXT("dd"));
                CompetitionInfo.Diver.Dive.Height = (*DiveObject)->GetStringField(TEXT("height"));
                CompetitionInfo.Diver.Dive.Position = (*DiveObject)->GetIntegerField(TEXT("position"));
                CompetitionInfo.Diver.Dive.Panel = (*DiveObject)->GetStringField(TEXT("panel"));
            }
        }
        
        // Broadcast the competition info
        OnCompetitionDataReceived.Broadcast(CompetitionInfo);
        UE_LOG(LogTemp, Log, TEXT("Received competition data: %s"), *JsonString);
    }
    else
    {
        UE_LOG(LogTemp, Warning, TEXT("Failed to parse JSON: %s"), *JsonString);
    }
}

void ADiveCalcTCPClient::CheckConnection()
{
    bool bIsConnected = Socket && Socket->GetConnectionState() == SCS_Connected;
    
    if (bConnected != bIsConnected)
    {
        bConnected = bIsConnected;
        OnConnectionStatusChanged.Broadcast(bConnected);
        
        if (bConnected)
        {
            UE_LOG(LogTemp, Log, TEXT("Connection to DiveCalc server established"));
        }
        else
        {
            UE_LOG(LogTemp, Warning, TEXT("Connection to DiveCalc server lost"));
        }
    }
}