// password: Rishabh9452

import express, {Express} from 'express';
import mongoose from 'mongoose';
import financialRecordRouter from './routes/financial-records';
import cors from 'cors';

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const mongoURI: string = "mongodb+srv://mehrotrarishabh100:Rishbah9452@cluster0.1qioo.mongodb.net/"

mongoose.connect(mongoURI)
.then(() => console.log("Connected!"))
.catch((err) => console.error("Error is there:", err));

app.use("/financial-records", financialRecordRouter);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
})