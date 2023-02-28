import { createContext } from "react";
import { useState } from "react";

type Context = {
  id: string;
  selectProblem: any;
  problems?: any;
};

const CodesContext = createContext({} as Context);

function Provider({ children }: any) {
  const [id, setId] = useState("");

  const valueToShare = {
    id,
    selectProblem: (id: any) => {
      setId(id);
    },
  };

  return (
    <CodesContext.Provider value={valueToShare}>
      {children}
    </CodesContext.Provider>
  );
}

export { Provider };
export default CodesContext;
