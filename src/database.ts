import mongoose from "mongoose";

// Config Mongoose
mongoose.connect(`${process.env.URI}`, { dbName: "Reviews" });
const connection = mongoose.connection;

// Msg: Connection Stablished
connection.once("open", function () {
  console.log(`MongoDB Connection Stablished`);
});

// Msg: Terminate on failed connection with MongoDB
connection.on("error", function (error) {
  console.log(error);
  process.exit(0);
});
