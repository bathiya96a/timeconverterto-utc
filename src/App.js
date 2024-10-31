import React, { useState } from 'react';
import moment from 'moment-timezone';
import './App.css';

function App() {
  const [input, setInput] = useState(''); // For the list of date-time inputs
  const [inputArray, setInputArray] = useState([]); // Array to hold the input date-time combinations
  const [utcResults, setUtcResults] = useState([]); // Array to hold the converted UTC results

  const handleAddAll = () => {
    // Split input by new lines and trim each entry
    const newInputArray = input.split(/\n/).map(item => item.trim()).filter(Boolean);

    // Validate and update input array
    const validDateTimes = [];
    newInputArray.forEach(item => {
      const [date, time] = item.split(', ').map(part => part.trim());
      if (date && time) {
        validDateTimes.push(item); // Only add valid date-time combinations
      } else {
        alert(`Invalid date and time format for: ${item}`);
      }
    });

    if (validDateTimes.length > 0) {
      setInputArray(prev => [...prev, ...validDateTimes]); // Add valid entries to the input array
      setInput(''); // Clear the input box after adding
    } else {
      alert('No valid date-time combinations found.');
    }
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
      
      {/* Input area for the list of date-time combinations */}
      <textarea
        placeholder="Enter date and time combinations, each on a new line (e.g., YYYY-MM-DD, h:mm:ss AM/PM)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        cols={40}
      />
      <br />
      <button onClick={handleAddAll}>Add All</button>

      {/* Section to show all added date-time combinations */}
      <h3>Input Date and Time Combinations:</h3>
      <p>{inputArray.length > 0 ? inputArray.join(', ') : 'No date and time added.'}</p>

      {/* Button to convert all input date-time combinations to UTC */}
      <button onClick={handleConvertAll}>Convert All to UTC</button>
      <button onClick={handleClear}>Clear All</button>
      <button onClick={handleCopy} disabled={utcResults.length === 0}>Copy UTC Times</button>

      {/* Section to show converted UTC times */}
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
