const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { csrfSync } = require("csrf-sync");
const flash = require("connect-flash");
require("dotenv").config();

const errorController = require("./controllers/error.js");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const addLocalVariablesToRes = require("./middleware/addLocalVariablesToRes.js");
const checkSessionUser = require("./middleware/checkSessionUser.js");
const globalErrorHandler = require("./middleware/globalErrorHandler.js");
const imageParser = require("./middleware/imageParser.js");
const MONGODB_URI = require("./utils/mongoDbUri");
const session = require("./middleware/session.js");

const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: req => req.body.csrfToken,
});

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(imageParser);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cookieParser());
app.use(session);
app.use(csrfSynchronisedProtection);
app.use(flash());
app.use(addLocalVariablesToRes);
app.use(checkSessionUser);

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);
app.get("/500", errorController.get500);

app.use(globalErrorHandler);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT);
  })
  .catch(err => {
    console.log(err);
  });
