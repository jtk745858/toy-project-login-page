import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
// ✅
function App() {
  // State to store ID and Password inputs
  const[inputId, setInputId] = useState("");
  const[inputPw, setInputPw] = useState("");

  const[inputEmail, setInputEmail] = useState("");
  const[confirmPw, setConfirmPw] = useState("");
  // Response msg from server
  const[serverMsg, setServerMsg] = useState("");

  // switch: Judging whether current page is login page or register page.
  // flase == login page, true == register page
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async() => {
    if (!inputId || !inputPw) {
      setServerMsg("Please Enter ID and Password");
      return;
  }
  if (isRegister) {
    if(!inputEmail) {
      setServerMsg("Please Enter your Email");
      return;
    }
    if(inputPw.length < 8) {
      setServerMsg("Password must be at least 8 characters");
      return;
    }
    if(inputPw !== confirmPw) {
      setServerMsg("Passwords do not match!");
      return;
    }
  }
  
  
  // Determine the Endpoint to send based on the current mode
  const endpoint = isRegister ? "/api/register" : "/api/login";
  const apiUrl = `http://127.0.0.1:5000${endpoint}`;

  try {
    const requestData = {
      userid: inputId,
      userpw: inputPw,
      ...(isRegister && { email: inputEmail })
    };
    // transport data to server(app.py)
    const response = await axios.post(apiUrl,requestData);
    // Process success response
    console.log("Server response",response);
    console.log("Server data",response.data);
    if(response.data && response.data.result === "success") {
      setServerMsg("✅ " + response.data.msg);

      //if success register -> Automatically switch to login screen after 1.5 sec
      if (isRegister){
        setTimeout(() => {
          setIsRegister(false); // Switch to login mode
          setServerMsg("✅ Sign up complete! Now you can login");
          
          // empty input windows
          setInputId("");
          setInputPw("");
          setInputEmail("");
          setConfirmPw("");
        }, 1000);
      } 
    } else {
        setServerMsg("❌ " + (response.data.msg || "Operation failed"))
    }
  } catch (error) {
    // process fail response (401, 409 error etc.)
    console.error("Error:",error);
    if(error.response && error.response.data) {
      setServerMsg("❌ " + (error.response.data.message || "Error"));
    } else {
      setServerMsg("❌ Cannot connect to Server");
    }
  }
};
  
const toggleMode = () => {
  setIsRegister(!isRegister); // reverse true <-> false
  setServerMsg(""); // clean message
  // empty input window
  setInputId("");
  setInputPw("");
  setInputEmail("");
  setConfirmPw("");
  };

const handleForgotPw = () => {
  alert("Contact the administrator");
}

  return (
    <div className="background">
     <div className = "app-container">
      <div className="login-card">
        {/* switch h2 according to mode */}
        <h2 className='login-header'>
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        {/* Input Windows */}
        <div className="input-group">
          <input
            className="input-field"
            type = "text"
            placeholder="Username"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            />
            </div>
            {/* email input window*/}
            {isRegister && (
              <div className='input-group'>
                <input
                  className="input-field"
                  type='email'
                  placeholder='Email Address'
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  />
                </div>
            )}
            {/*password input windows*/}
            <div className = "input-group">
              <input
                className="input-field"
                type = "password"
                placeholder="Password"
                value={inputPw}
                onChange={(e) => setInputPw(e.target.value)}
              />
            </div>
            {isRegister && (
              <div className='input-group'>
                <input
                  className='input-field'
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                  />
                  </div>
            )}
            {!isRegister && (
              <div style={{display: 'none'}}>
                </div>
            )}
            {/* Button: Switch button and color according to mode */}
            <button 
            className="login-btn" 
            onClick={handleSubmit}
            style = {{ backgroundColor: isRegister ? "#28a745" : "#4a90e2" }} // Regiser : green, Login : blue
            >
              {isRegister ? "Sign up" : "Login"}  
              </button>

            {/* Switch link: if clicked -> change mode */}
            <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
              {isRegister ? "I already have account.. " : "I don't have account.. "}
              <span
                onClick = {toggleMode}
                style={{ color: "#4a90e2", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}
                >
                  {isRegister ? "Login" : "Sign up"}
                </span>
              </p>
            {!isRegister && (
            <button className="forgot-btn" onClick={handleForgotPw}>
              Forgot Password?
            </button>
            )}
            <div className="message" style= {{ color: serverMsg && serverMsg.includes("✅") ? "green" : "red" }}>
              {serverMsg}
            </div>
      </div>
      </div>
    </div>
  );
}

export default App;