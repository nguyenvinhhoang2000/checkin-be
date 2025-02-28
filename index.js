require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// admin
const authAdminRouter = require("./routes/authAdmin");
const memberRouter = require("./routes/member");
const organizationRouter = require("./routes/organization");

// user
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
// a

const connecDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://nguyenvinhhoang2000:1234@checkinapp.rdojqcw.mongodb.net/?retryWrites=true&w=majority&appName=CheckinApp`,
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

// admin
app.use("/api/admin/auth", authAdminRouter);
app.use("/api/admin/member", memberRouter);
app.use("/api/admin/organizations", organizationRouter);


// user
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
