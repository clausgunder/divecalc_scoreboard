import React, { useState, useEffect } from 'react';

/**
 * Component to display DiveCalc connection status
 * Can be included in any screen where connection status is needed
 */
const DiveCalcStatus = ({ showDetails = false }) => {
  const [status, setStatus] = useState(window.diveCalcStatus || {
    connected: false,
    lastDataReceived: null,
    lastConnectionTime: null,
    connectionCount: 0,
    clientAddress: null
  });

  useEffect(() => {
    // Update status when DiveCalc status changes
    const handleStatusUpdate = (event) => {
      console.log('DiveCalc status update received:', event.detail);
      setStatus(event.detail);
    };

    // Listen for status updates
    window.addEventListener('diveCalcStatusUpdate', handleStatusUpdate);

    // Check if we already have status information
    if (window.diveCalcStatus) {
      setStatus(window.diveCalcStatus);
    }

    return () => {
      window.removeEventListener('diveCalcStatusUpdate', handleStatusUpdate);
    };
  }, []);

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'Never';
    const date = new Date(timeString);
    return date.toLocaleTimeString();
  };

  const statusStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: status.connected ? '#e6ffe6' : '#ffe6e6',
    border: `1px solid ${status.connected ? '#99cc99' : '#cc9999'}`,
    color: status.connected ? '#006600' : '#660000',
    fontSize: '14px',
    marginBottom: showDetails ? '8px' : '0'
  };

  const indicatorStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: status.connected ? '#00cc00' : '#cc0000',
    marginRight: '6px',
    display: 'inline-block'
  };

  const detailsStyle = {
    fontSize: '12px',
    marginTop: '4px',
    padding: '4px 8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    display: showDetails ? 'block' : 'none'
  };

  return (
    <div style={{ margin: '8px 0' }}>
      <div style={statusStyle}>
        <span style={indicatorStyle}></span>
        <span>DiveCalc: {status.connected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      {showDetails && (
        <div style={detailsStyle}>
          <div>Last data received: {formatTime(status.lastDataReceived)}</div>
          <div>Last connection: {formatTime(status.lastConnectionTime)}</div>
          {status.clientAddress && <div>Client: {status.clientAddress}</div>}
        </div>
      )}
    </div>
  );
};

export default DiveCalcStatus;