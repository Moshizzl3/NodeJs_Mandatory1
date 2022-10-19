import { Router } from "express";

const userRouter = Router();

userRouter.get("/users", (req, res) => {
  res.status(200).send({ data: users });
});

userRouter.get("/users/:id", (req, res) => {
  const user = users.find((user) => user.userId === Number(req.params.id));
  res.status(200).send({ data: user });
});

userRouter.post("/login", (req, res) => {

  const user = users.find(
    (user) =>
      user.userEmail === req.body.email &&
      user.userPassword === req.body.password
  );
  if(user){
    res.status(200).send({ data: user.userId});
  }
  else {
    res.status(404).send("No match")
  }
});

userRouter.patch("/users/:id", (req, res) => {
  const index = users.findIndex((user) => user.userId === Number(req.params.id));

  console.log(req.body)
  console.log(index)

  if (index >= 0) {
    users[index] = { ...users[index], ...req.body };
    res.status(200).send("ok")
  } else {
    res.status(404).send("none");
  }
});


const users = [
  {
    userId: 1,
    userFirstName: "Bob",
    userLastName: "Jensen",
    userEmail: "test1@test.dk",
    userPassword: "123",
    userColor: "100, 202, 155"
  },
  {
    userId: 2,
    userFirstName: "hans",
    userLastName: "test",
    userEmail: "test2@test.dk",
    userPassword: "321",
    userColor: "100, 202, 155"
  },
];

export default userRouter
