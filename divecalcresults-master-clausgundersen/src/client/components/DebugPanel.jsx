import * as React from 'react';

const DebugPanel = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="debug-panel">
        <h3>Debug Panel</h3>
        <p>No data received yet</p>
      </div>
    );
  }

  return (
    <div className="debug-panel">
      <h3>Debug Panel</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DebugPanel;