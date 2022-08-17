const mongoose = require("mongoose");

const connection = mongoose;
const connect = (MONGO_URI) => {
  // Connecting to the database
  connection
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log(`database connection failed ${error}`);
    });
  return connection;
};

module.exports = { connect, connection };
