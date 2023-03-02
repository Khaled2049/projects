import axios from "axios";

const GetCode = async () => {
  const res = await axios.get("http://localhost:3000/code");
  return res;
};

export default GetCode;
