import express from "express";
import novelRoutes from "./routes/novelRoutes";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use("/api", novelRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
