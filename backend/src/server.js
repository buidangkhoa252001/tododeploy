import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import fileUpload from "express-fileupload"
import initWebRoutes from "./route/web"
import connectDB from "./config/connectDB"
import cors from 'cors';


require('dotenv').config();
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({/* limit:"50mb", */ extended: true }))
app.use(cookieParser());
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

/* app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
});
 */
initWebRoutes(app)
connectDB();
let port = process.env.PORT || 6969;
//Port === undefined => port = 6969

app.listen(port, () => {
    //callback
    console.log("Backend Nodejs is runing1 on the port1 : " + port)
})
