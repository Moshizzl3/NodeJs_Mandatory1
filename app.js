import express from "express";
import entriesRouter  from "./routes/entriesRouter.js";
import userRouter from "./routes/usersRouter.js";
import {renderPage} from "./utils/templateRenderer.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use(entriesRouter);
app.use(userRouter);

app.get("/", (req, res) => {
  const page = renderPage(
    "./public/pages/landingPage/landingPage.html",
    {
      tabTitle: "Notepad",
      pageScript: `<script src="/pages/landingPage/landingPage.js"></script>`,
      pageStylesheet: `<link rel="stylesheet" href="/pages/landingPage/landingPage.css">`,
    },
    true
  );
  res.send(page);
});



app.get("/python", (req, res) => {
  const page = renderPage(
    "./public/pages/contentPage/contentPage.html",
    {
      tabTitle: "Python",
      pageScript: `<script src="/pages/contentPage/contentPage.js"></script>`,
      pageStylesheet: `<link rel="stylesheet" href="/pages/contentPage/contentPage.css">`,
    },
    true
  );
  res.send(page);
});

app.get("/nodejs", (req, res) => {
  const page = renderPage(
    "./public/pages/contentPage/contentPage.html",
    {
      tabTitle: "NodeJs",
      pageScript: `<script src="/pages/contentPage/contentPage.js"></script>`,
      pageStylesheet: `<link rel="stylesheet" href="/pages/contentPage/contentPage.css">`,
    },
    true
  );
  res.send(page);
});

app.get("/admin", (req, res) => {
  const page = renderPage(
    "./public/pages/adminPage/adminPage.html",
    {
      tabTitle: "Admin",
      pageScript: `<script src="/pages/adminPage/adminPage.js"></script>`,
      pageStylesheet: `<link rel="stylesheet" href="/pages/adminPage/adminPage.css">`,
    },
    true
  );
  res.send(page);
});

app.get("/login", (req, res) => {
  const page = renderPage(
    "./public/pages/loginPage/loginPage.html",
    {
      pageScript: `<script src="/pages/loginPage/loginPage.js"></script>`,
      tabTitle: "Login",
      pageStylesheet: `<link rel="stylesheet" href="/pages/loginPage/loginPage.css">`,
    },
    false
  );
  res.send(page);
});

const server = app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.log("Server is running on port:", server.address().port);
});
