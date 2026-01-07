import React, { useState, useEffect } from 'react';

function App() {
  const [serverMsg, setServerMsg] = useState("서버 응답 대기 중...");

  useEffect(() => {
  
    fetch('http://127.0.0.1:5000/api/test')
      .then(response => response.json())
      .then(data => setServerMsg(data.message)) 
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>React + Flask link test</h1>
      <p>Message from Server <strong>{serverMsg}</strong></p>
    </div>
  );
}

export default App;