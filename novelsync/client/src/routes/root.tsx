import "../components/style.css";
import { SimpleEditor } from "../components/SimpleEditor";

export default function Root() {
  return (
    <div className="app">
      <h1>Start your novel today 😊</h1>
      <SimpleEditor />
    </div>
  );
}
