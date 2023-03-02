import axios from "axios";

const GetCodes = async () => {
  const res = await axios.get("http://localhost:3000/code");
  return res;
};
const GetCode = async (ID: any) => {
  const res = await axios.get(`http://localhost:3000/code/${ID}`);
  return res;
};
const AddCode = async (params: any) => {
  const res = await axios.post(`http://localhost:3000/code`, params);
  return res;
};
const DeleteCode = async (ID: any) => {
  const res = await axios.delete(`http://localhost:3000/code/${ID}`);
  return res;
};

export { GetCodes, GetCode, AddCode, DeleteCode };
