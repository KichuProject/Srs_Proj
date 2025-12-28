import React, { useState } from 'react';
import './App.css'

const App = () => {
  const [name, setname] = useState('');
  const [people, setpeople] = useState([]);

  const addperson = () => {
    if (name.trim() === '') return;
    setpeople([...people, { name: name, status: 'Absent' }]);
    setname('');
  };

  const handlekey = (e) => {
    if (e.key === 'Enter') {
      addperson();
    }
  };

  const markpresent = (index) => {
    const updated = [...people];
    updated[index].status = 'Present';
    setpeople(updated);
  };

  const markabsent = (index) => {
    const updated = [...people];
    updated[index].status = 'Absent';
    setpeople(updated);
  };

  const total = people.length;
  const presentcount = people.filter(p => p.status === 'Present').length;
  const absentcount = people.filter(p => p.status === 'Absent').length;

  return (
    <div>
      <h1>Attendance System</h1>
      <p>Welcome to Attendance System</p>

      <input
        placeholder="Enter name"
        value={name}
        onChange={(e) => setname(e.target.value)}
        onKeyPress={handlekey}
      />
      <button onClick={addperson}>Add Person</button>

      {people.length === 0 && <p>No people added yet</p>}

      <ul>
        {people.map((p, index) => (
          <li key={index}>
            {p.name}
            <button onClick={() => markpresent(index)}>Present</button>
            <button onClick={() => markabsent(index)}>Absent</button>
          </li>
        ))}
      </ul>

      <div>
        <p>Total: {total}</p>
        <p>Present: {presentcount}</p>
        <p>Absent: {absentcount}</p>
      </div>
    </div>
  );
};

export default App;
