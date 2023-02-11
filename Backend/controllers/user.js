const bcrypt = require('bcrypt');
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  response.json(await User.find({}).populate('blogs'));
});

usersRouter.post("/", async (request, response) => {
  const { name, username, password } = request.body;
  
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash
  });

  const savedUser = await user.save()

  response.status(201).json(savedUser);
});


module.exports = usersRouter;
