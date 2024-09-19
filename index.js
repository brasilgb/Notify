import { initializeApp, applicationDefault } from 'firebase-admin/app';
import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import express, { json } from "express";
import cors from "cors";

import { createRequire } from 'node:module'

// Import the package.json file to get the version number by using the createRequire function
const require = createRequire(import.meta.url)
const serviceAccount = require('./applojasolar-firebase-adminsdk-8a493-34a60ce174.json')

// const credAccess = process.env.GOOGLE_APPLICATION_CREDENTIALS;
//import serviceAccount from "./applojasolar-firebase-adminsdk-8a493-34a60ce174.json" assert { type: "json" };
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});


initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'applojasolar',
});

app.post("/send", function (req, res) {
  const {data, tokens} = req.body;

  const message = {
    data: data,
    tokens: tokens
  };

  getMessaging()
    .sendEachForMulticast(message)
    .then((response) => {
      res.status(200).json({
        message: "Mensagem enviada com sucesso.",
        success: response.successCount,
        failure: response.failureCount,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
});

app.listen(3333, function () {
  console.log("Server started on port 3333");
});