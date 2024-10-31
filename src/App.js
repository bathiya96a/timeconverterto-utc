import React, { useState } from 'react';
import moment from 'moment-timezone';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [inputArray, setInputArray] = useState([]); // Array to hold the input date-time combinations
  const [utcResults, setUtcResults] = useState([]); // Array to hold the converted UTC results

  const handleAdd = () => {
    // Validate the input format
    const [date, time] = input.split(', ').map(part => part.trim());
    if (!date || !time) {
      alert('Please enter a valid date and time in the format YYYY-MM-DD, h:mm:ss AM/PM');
      return;
    }
    
    // Add the input to the input array
    setInputArray(prev => [...prev, input.trim()]);
    setInput(''); // Clear the input box after adding
  };

  const handleConvertAll = () => {
    const newUtcResults = [];

    inputArray.forEach(item => {
      const [date, time] = item.split(', ').map(part => part.trim());
      const colomboTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD h:mm:ss A', 'Asia/Colombo');

      if (colomboTime.isValid()) {
        // Convert to UTC and add to the results array
        const utcTime = colomboTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        newUtcResults.push(utcTime);
      } else {
        alert(`Invalid date and time format for: ${item}`);
      }
    });

    setUtcResults(newUtcResults); // Set the state with the new UTC results
  };

  const handleClear = () => {
    setInput('');
    setInputArray([]); // Clear the input array
    setUtcResults([]); // Clear the UTC results
  };

  const handleCopy = () => {
    const resultsToCopy = utcResults.join(', '); // Join results into a string
    navigator.clipboard.writeText(resultsToCopy).then(() => {
      alert('Converted UTC times copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy: ', err);
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
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleConvertAll}>Convert All to UTC</button>
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleCopy} disabled={utcResults.length === 0}>Copy UTC Times</button>

      <h3>Input Date and Time Combinations:</h3>
      <p>{inputArray.length > 0 ? inputArray.join(', ') : 'No date and time added.'}</p>

      <h3>Converted UTC Date and Times:</h3>
      <table border={1}>
        <thead>
          <tr>
            <th>UTC Time</th>
          </tr>
        </thead>
        <tbody>
          {utcResults.length > 0 ? utcResults.map((utcTime, index) => (
            <tr key={index}>
              <td>{utcTime}</td>
            </tr>
          )) : (
            <tr>
              <td>No results</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
