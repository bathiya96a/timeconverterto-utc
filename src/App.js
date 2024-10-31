import React, { useState } from 'react';
import moment from 'moment-timezone';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [utcResult, setUtcResult] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState(null); // Changed to null for clearer state management

  const handleConvert = () => {
    // Split the input by ', ' to get date and time separately
    const [date, time] = input.split(', ').map(part => part.trim());

    // Validate the input format
    if (!date || !time) {
      setUtcResult('Please enter a valid date and time in the format YYYY-MM-DD, h:mm:ss AM/PM');
      return;
    }

    // Try to create a moment object
    const colomboTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD h:mm:ss A', 'Asia/Colombo');

    // Check if the moment object is valid
    if (!colomboTime.isValid()) {
      setUtcResult('Invalid date and time format. Please check your input.');
      return;
    }

    // Convert to UTC
    const utcTime = colomboTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    
    setUtcResult(utcTime);
  };

  const handleClear = () => {
    setInput('');
    setUtcResult('');
    setCopyMessage(''); // Clear the copy message as well
    setCopyStatus(null); // Reset copy status
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(utcResult).then(() => {
      setCopyStatus(true); // success
      setCopyMessage('Time converted to UTC & copied to clipboard!');
      setTimeout(() => {
        setCopyMessage('');
      }, 1000);
    }).catch(err => {
      setCopyStatus(false);
      setCopyMessage('Failed to copy: ' + err);
    });
  };

  return (
    <div className="App">
      <h2>Convert Date and Time from Asia/Colombo to UTC</h2>
      <input
        type="text"
        placeholder="YYYY-MM-DD, h:mm:ss AM/PM"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <button onClick={handleClear}>Clear</button>
      <button onClick={() => { handleConvert(); handleCopy(); }}>Convert to UTC & Copy</button>
      <h3>UTC Date and Time:</h3>
      <p>{utcResult}</p>
      <div style={{ backgroundColor: copyStatus === true ? 'green' : copyStatus === false ? 'red' : 'transparent' }}>
        {copyMessage && <p className="copy-message">{copyMessage}</p>} {/* Display the copy message */}
      </div>
    </div>
  );
}

export default App;
