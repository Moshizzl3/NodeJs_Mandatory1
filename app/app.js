import express, { json } from "express";
import { entriesRouter } from "./routes/entriesRouter.js";
import { userRouter } from "./routes/usersRouter.js";
import { renderPage } from "./utils/templateRenderer.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use(entriesRouter);
app.use(userRouter);

app.get("/", (req, res) => {
  const page = renderPage(
    "./public/pages/landingpage/landingpage.html",
    {
      tabTitle: "Notepad",
      PAGE_SCRIPT: `<script src="/pages/landingpage/landingpage.js"></script>`,
      PAGE_STYLESHEET: `<link rel="stylesheet" href="/pages/landingpage/landingpage.css">`,
    },
    true
  );
  res.send(page);
});

app.get("/login", (req, res) => {
  const page = renderPage(
    "./public/pages/login/login.html",
    {
      PAGE_SCRIPT: `<script src="/pages/login/login.js"></script>`,
      tabTitle: "Login",
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
