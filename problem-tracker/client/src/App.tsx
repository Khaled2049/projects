import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import MyNav from "./components/MyNav";
import ProblemRow from "./components/ProblemRow";

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
  return (
    <div className="App">
      <MyNav />
      <ProblemRow />
    </div>
  );
}

export default App;
