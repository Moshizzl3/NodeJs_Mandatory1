import { Router } from "express";

export const userRouter = Router();

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


const users = [
  {
    userId: 1,
    userFirstName: "Bob",
    userLastName: "Jensen",
    userEmail: "test1@test.dk",
    userPassword: "123",
  },
  {
    userId: 2,
    userFirstName: "hans",
    userLastName: "test",
    userEmail: "test2@test.dk",
    userPassword: "321",
  },
];
