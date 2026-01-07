import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // State to store ID and Password inputs
  const[inputId, setInputId] = useState("");
  const[inputPw, setInputPw] = useState("");
  const[serverMsg, setServerMsg] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        userid: inputId,
        userpw: inputPw
      });
    
    setServerMsg(response.data.message);
    console.log("Response from server:", response.data);

    } catch (error) {
      if (error.response) {
        setServerMsg(error.response.data.message);
      } else { 
        setServerMsg("Cannot connect to server.");
      }
    }
  };

  return (
    <div style= {{ textAlign: "center", marginTop: "50px"}}>
      <h1>Login</h1>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
        <input
          type="text"
          placeholder="ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          style={{ padding: "10px", width: "200px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={inputPw}
          onChange={(e) => setInputPw(e.target.value)}
          style={{ padding: "10px", width: "200px" }}
        />
        <button onClick={handleLogin} style={{ padding: "10px 20px", cursor: "pointer" }}>Login</button>
      </div>

      <h3 style={{ marginTop: "20px", color: "blue" }}>{serverMsg}</h3>
    </div>
  );
}

export default App;