const http = require("http")
const express = require("express");
const database = require("./database");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const { MONGO_URI } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan("combined"));
app.use(cors());

require("./routes")(app);
database.connect(MONGO_URI);
// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     console.log(`Connected to database`);
//   })
//   .catch(error => {
//     console.log(`Not Connected to database ${error}`);
//   })

http.createServer(app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
