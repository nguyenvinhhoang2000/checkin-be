require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const shopRouter = require("./routes/shop");
const customerGroupRouter = require("./routes/customerGroup");
const supplierGroupRouter = require("./routes/supplierGroup");

const connecDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://nguyenvinhhoang2000:1234@om-db.r30wkcc.mongodb.net/OM`,
      {
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connecDB();

const app = express();
app.use(express.json());

app.use(cors());

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.json("HOME")
})

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/customer-group", customerGroupRouter);
app.use("/api/supplier-group", supplierGroupRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
