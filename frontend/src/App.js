import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

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

  const handleForgotPw = () => {
    alert("Ask the administrator to reset your password.")
  }
  return (
    <div className="background">
     <div className = "app-container">
      <div className="login-card">
        <h2>Login</h2>

        <div className="input-group">
          <label htmlFor="userid"></label>
          <input
            className="input-field"
            type = "text"
            placeholder="User ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            />
            </div>

            <div className = "input-group">
              <input
                className="input-field"
                type = "password"
                placeholder="Password"
                value={inputPw}
                onChange={(e) => setInputPw(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }
              }
              />
            </div>

            <button className="login-btn" onClick={handleLogin}>
              Sign In
            </button>

            <button className="forgot-btn" onClick={handleForgotPw}>
              Forgot Password?
            </button>
            
            <div className="message" style= {{ color: serverMsg.includes("successful") ? "green" : "red" }}>
              {serverMsg}
            </div>
      </div>
      </div>
    </div>
  );
}

export default App;