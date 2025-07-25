// DiveCalcTCPClient.h
// TCP Client for connecting to DiveCalc server on port 9090

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Sockets.h"
#include "SocketSubsystem.h"
#include "Interfaces/IPv4/IPv4Address.h"
#include "Interfaces/IPv4/IPv4Endpoint.h"
#include "Json.h"
#include "DiveCalcTCPClient.generated.h"

// Forward declarations
class FSocket;

// Structs to hold diving data
USTRUCT(BlueprintType)
struct FDiveInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Dive;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DD;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Height;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;
};

USTRUCT(BlueprintType)
struct FDiverInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Nationality;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Rank;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Result;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Team;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FDiveInfo Dive;
};

USTRUCT(BlueprintType)
struct FEventResultInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Nationality;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Rank;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Result;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Team;
};

USTRUCT(BlueprintType)
struct FEventInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Round;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Rounds;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 DivesPerRound;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int64 StartTime;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    TArray<FEventResultInfo> Results;
};

USTRUCT(BlueprintType)
struct FCompetitionInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Action;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Competition;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Place;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FEventInfo Event;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FDiverInfo Diver;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int64 LatestUpdate;
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnCompetitionDataReceived, const FCompetitionInfo&, CompetitionData);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnConnectionStatusChanged, bool, IsConnected);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnConnectionError, const FString&, ErrorMessage);

UCLASS(BlueprintType, Blueprintable)
class DIVECALCCLIENT_API ADiveCalcTCPClient : public AActor
{
    GENERATED_BODY()

public:
    // Sets default values for this actor's properties
    ADiveCalcTCPClient();

    // Called when the game starts or when spawned
    virtual void BeginPlay() override;
    
    // Called when the game ends or when destroyed
    virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;

    // Called every frame
    virtual void Tick(float DeltaTime) override;

    // Connect to the DiveCalc server
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    bool ConnectToServer(const FString& ServerIP, int32 ServerPort = 9090);

    // Disconnect from the DiveCalc server
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    void DisconnectFromServer();

    // Check if connected to the server
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    bool IsConnected() const;

    // Get the latest competition data
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    FCompetitionInfo GetLatestCompetitionData() const;

    // Event dispatched when new competition data is received
    UPROPERTY(BlueprintAssignable, Category = "DiveCalc")
    FOnCompetitionDataReceived OnCompetitionDataReceived;

    // Event dispatched when connection status changes
    UPROPERTY(BlueprintAssignable, Category = "DiveCalc")
    FOnConnectionStatusChanged OnConnectionStatusChanged;

    // Event dispatched when a connection error occurs
    UPROPERTY(BlueprintAssignable, Category = "DiveCalc")
    FOnConnectionError OnConnectionError;

private:
    // Socket for TCP connection
    FSocket* Socket;

    // Thread for receiving data
    FRunnableThread* ReceiverThread;

    // Buffer for receiving data
    TArray<uint8> ReceiveBuffer;

    // Latest competition data
    FCompetitionInfo LatestCompetitionData;

    // Connection status
    bool bIsConnected;

    // Server endpoint
    FIPv4Endpoint ServerEndpoint;

    // Process received JSON data
    void ProcessJsonData(const FString& JsonString);

    // Receiver thread function
    void ReceiveData();

    // Parse competition data from JSON
    bool ParseCompetitionData(const TSharedPtr<FJsonObject>& JsonObject, FCompetitionInfo& OutCompetitionData);

    // Parse event data from JSON
    bool ParseEventData(const TSharedPtr<FJsonObject>& JsonObject, FEventInfo& OutEventData);

    // Parse diver data from JSON
    bool ParseDiverData(const TSharedPtr<FJsonObject>& JsonObject, FDiverInfo& OutDiverData);

    // Parse dive data from JSON
    bool ParseDiveData(const TSharedPtr<FJsonObject>& JsonObject, FDiveInfo& OutDiveData);

    // Parse event results from JSON
    bool ParseEventResults(const TArray<TSharedPtr<FJsonValue>>& JsonArray, TArray<FEventResultInfo>& OutResults);
};

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Networking.h"
#include "Sockets.h"
#include "SocketSubsystem.h"
#include "DiveCalcTCPClient.generated.h"

// Data structures for competition information
USTRUCT(BlueprintType)
struct FDiveInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Dive;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DiverName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DiverShortName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DD;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Height;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Panel;
};

USTRUCT(BlueprintType)
struct FDiverInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString ShortName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Team;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Nationality;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Result;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Rank;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FDiveInfo Dive;
};

USTRUCT(BlueprintType)
struct FEventResultInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString ShortName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Team;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Nationality;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Result;
};

USTRUCT(BlueprintType)
struct FEventInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Round;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Rounds;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    bool Finished;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    TArray<FEventResultInfo> Results;
};

USTRUCT(BlueprintType)
struct FCompetitionInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Competition;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Place;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Action;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DateFmt;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FEventInfo Event;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FDiverInfo Diver;
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnCompetitionDataReceived, const FCompetitionInfo&, CompetitionInfo);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnConnectionStatusChanged, bool, IsConnected);

UCLASS(BlueprintType, Blueprintable)
class YOURGAME_API ADiveCalcTCPClient : public AActor
{
    GENERATED_BODY()

public:
    ADiveCalcTCPClient();
    virtual void BeginPlay() override;
    virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;
    virtual void Tick(float DeltaTime) override;

    // Connect to the DiveCalc server
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    bool ConnectToServer(const FString& ServerIP, int32 ServerPort = 9090);

    // Disconnect from the server
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    void DisconnectFromServer();

    // Event dispatchers
    UPROPERTY(BlueprintAssignable, Category = "DiveCalc")
    FOnCompetitionDataReceived OnCompetitionDataReceived;

    UPROPERTY(BlueprintAssignable, Category = "DiveCalc")
    FOnConnectionStatusChanged OnConnectionStatusChanged;

private:
    FSocket* Socket;
    FString ReceivedData;
    bool bConnected;
    FTimerHandle ConnectionCheckTimerHandle;

    void ProcessData();
    void CheckConnection();
};

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Networking.h"
#include "Sockets.h"
#include "SocketSubsystem.h"
#include "DiveCalcTCPClient.generated.h"

// Data structures for competition information
USTRUCT(BlueprintType)
struct FDiveInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Dive;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DiverName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DiverShortName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DD;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Height;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Panel;
};

USTRUCT(BlueprintType)
struct FDiverInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString ShortName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Team;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Nationality;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Result;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Rank;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FDiveInfo Dive;
};

USTRUCT(BlueprintType)
struct FEventResultInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString ShortName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Team;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Nationality;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Result;
};

USTRUCT(BlueprintType)
struct FEventInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Round;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Rounds;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    bool Finished;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    TArray<FEventResultInfo> Results;
};

USTRUCT(BlueprintType)
struct FCompetitionInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Competition;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Place;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Action;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DateFmt;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FEventInfo Event;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FDiverInfo Diver;
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnCompetitionDataReceived, const FCompetitionInfo&, CompetitionInfo);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnConnectionStatusChanged, bool, IsConnected);

UCLASS(BlueprintType, Blueprintable)
class YOURGAME_API ADiveCalcTCPClient : public AActor
{
    GENERATED_BODY()

public:
    ADiveCalcTCPClient();
    virtual void BeginPlay() override;
    virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;
    virtual void Tick(float DeltaTime) override;

    // Connect to the DiveCalc server
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    bool ConnectToServer(const FString& ServerIP, int32 ServerPort = 9090);

    // Disconnect from the server
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    void DisconnectFromServer();

    // Event dispatchers
    UPROPERTY(BlueprintAssignable, Category = "DiveCalc")
    FOnCompetitionDataReceived OnCompetitionDataReceived;

    UPROPERTY(BlueprintAssignable, Category = "DiveCalc")
    FOnConnectionStatusChanged OnConnectionStatusChanged;

private:
    FSocket* Socket;
    FString ReceivedData;
    bool bConnected;
    FTimerHandle ConnectionCheckTimerHandle;

    void ProcessData();
    void CheckConnection();
};

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Networking.h"
#include "Sockets.h"
#include "SocketSubsystem.h"
#include "DiveCalcTCPClient.generated.h"

// Data structures for competition information
USTRUCT(BlueprintType)
struct FDiveInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Dive;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DiverName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DiverShortName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DD;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Height;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Panel;
};

USTRUCT(BlueprintType)
struct FDiverInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString ShortName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Team;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Nationality;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Result;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Rank;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FDiveInfo Dive;
};

USTRUCT(BlueprintType)
struct FEventResultInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString ShortName;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Team;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Nationality;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Position;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Result;
};

USTRUCT(BlueprintType)
struct FEventInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Name;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Round;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    int32 Rounds;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    bool Finished;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    TArray<FEventResultInfo> Results;
};

USTRUCT(BlueprintType)
struct FCompetitionInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Competition;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Place;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString Action;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FString DateFmt;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FEventInfo Event;

    UPROPERTY(BlueprintReadOnly, Category = "DiveCalc")
    FDiverInfo Diver;
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnCompetitionDataReceived, const FCompetitionInfo&, CompetitionInfo);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnConnectionStatusChanged, bool, IsConnected);

UCLASS(BlueprintType, Blueprintable)
class YOURGAME_API ADiveCalcTCPClient : public AActor
{
    GENERATED_BODY()

public:
    ADiveCalcTCPClient();
    virtual void BeginPlay() override;
    virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;
    virtual void Tick(float DeltaTime) override;

    // Connect to the DiveCalc server
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    bool ConnectToServer(const FString& ServerIP, int32 ServerPort = 9090);

    // Disconnect from the server
    UFUNCTION(BlueprintCallable, Category = "DiveCalc")
    void DisconnectFromServer();

    // Event dispatchers
    UPROPERTY(BlueprintAssignable, Category = "DiveCalc")
    FOnCompetitionDataReceived OnCompetitionDataReceived;

    UPROPERTY(BlueprintAssignable, Category = "DiveCalc")
    FOnConnectionStatusChanged OnConnectionStatusChanged;

private:
    FSocket* Socket;
    FString ReceivedData;
    bool bConnected;
    FTimerHandle ConnectionCheckTimerHandle;

    void ProcessData();
    void CheckConnection();
};