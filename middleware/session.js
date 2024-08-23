const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGODB_URI = require("./../utils/mongoDbUri");

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
});
