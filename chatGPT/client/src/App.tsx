import { useState } from "react";
import "./normal.css";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <aside className="side-menu">
        <div className="side-menu-button">
          <span className="plus">+</span>New Chat
        </div>
      </aside>
      <section className="chat-box">
        <div className="chat-log">
          <div className="chat-message">
            <div className="avatar">KH</div>
            <div className="message">Hellow World</div>
          </div>
        </div>
        <div className="chat-input-holder">
          <textarea
            className="chat-input-text-area"
            placeholder="Type your message here"
            rows={1}
          ></textarea>
        </div>
      </section>
    </div>
  );
}

export default App;
