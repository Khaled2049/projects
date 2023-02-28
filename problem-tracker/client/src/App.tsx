import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import axios from "axios";

type msg = {
  message: String;
};

function App() {
  const [data, setdata] = useState<msg>({ message: "" });
  useEffect(() => {
    axios.get("http://localhost:3000/ping").then((response) => {
      setdata(response.data);
    });
  }, []);
  return <div className="App">{data.message}</div>;
}

export default App;
