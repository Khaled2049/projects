import "./App.css";

import ProblemRow from "./components/ProblemRow";

type msg = {
  message: String;
};

function App() {
  return (
    <div className="App">
      <ProblemRow />
    </div>
  );
}

export default App;
