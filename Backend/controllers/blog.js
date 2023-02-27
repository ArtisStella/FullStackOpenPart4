const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// const logger = require("../utils/logger")

blogsRouter.get("/", async (request, response) => {
  response.json(await Blog.find({}).populate("author"));
});

blogsRouter.post("/", async (request, response) => {
  
  if (!request.user.id) {
    return response.status(401).json({error: "Invalid token."});
  }

  const author = await User.findById(request.user.id);
  const blog = new Blog({
    title: request.body.title,
    author: author.id,
    url: request.body.url,
    likes: request.body.likes,
  });

  let result = await blog.save();
  author.blogs = author.blogs.concat(result._id);
  await author.save();

  response.status(201).json(result);
});

blogsRouter.put("/:id", async (request, response) => {
  if (!request.user.id) {
    return response.status(401).json({error: "Invalid token."});
  }
  
  const updateBlog = { likes: request.body.likes };
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    updateBlog,
    { new: true }
  );
  response.status(200).json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  
  if (blog.author.toString() !== request.user.id) {
    return response.status(401).json({error: "Invalid token."});
  }
  
  await blog.delete();
  response.status(204).end();
});

module.exports = blogsRouter;
