import { initializeApp, applicationDefault } from 'firebase-admin/app';
import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import express, { json } from "express";
import cors from "cors";

// const credAccess = process.env.GOOGLE_APPLICATION_CREDENTIALS;
import serviceAccount from "./applojasolar-firebase-adminsdk-8a493-34a60ce174.json" assert { type: "json" };
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
  const receivedToken = req.body.fcmToken;

  const message = {
    // data: {score: '850', time: '2:45'},
    // notification: {
    //   title: "Bom dia, bem vindo.",
    //   body: "Seja bem vindo as notificações do novo app solar!",
    //   clickAction: "https://www.lojasolar.com.br/carrinho-de-mao-cacamba-50l-azul-77704-432-tramontina/p",
    //   image: "https://lojasolar.vtexassets.com/arquivos/ids/177192-1200-auto"
    // },

      token: "eKCBtqjoRsy57tgvK1b6Pn:APA91bHEJL9CvaDrPf6RCzNUKKPD17KeiAsoqDpfRcNJLgdYr0OVi5XMQojNYsgI5kQrPfwgZOQpc4mnV0q3kTMgaQ9-3zoAEpW44_XDyekvvhSu4CApFJ_E_URD4AoZS3bpXE5o8Y99",
      notification: {
        title: "Bom dia, bem vindo.",
        body: "Seja bem vindo as notificações do novo app solar!",
        // url: "https://www.lojasolar.com.br/carrinho-de-mao-cacamba-50l-azul-77704-432-tramontina/p",
        image: "https://lojasolar.vtexassets.com/arquivos/ids/177192-1200-auto"
      }
  };

  getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });


});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});