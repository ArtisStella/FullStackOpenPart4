const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

jest.setTimeout(20000);

const InitialBlogs = [
  {
    title: "First Blog",
    url: "ShaatHai",
    likes: 420,
  },
  {
    title: "Second Blog",
    url: "ShaatHai",
    likes: 420,
  },
  {
    title: "Third Blog",
    url: "ShaatHai",
  },
];

const InitialUsers = [
  {
    username: "User1",
    password: "User1",
    name: "Huzaifa",
  },
  {
    username: "User2",
    password: "User2",
    name: "Huzaif",
  },
];

const LoginUser = {
  username: "User1",
  password: "User1",
};

let token;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  for (const iUser of InitialUsers) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(iUser.password, saltRounds);
    const user = new User({
      username: iUser.username,
      name: iUser.name,
      passwordHash,
    });
    const savedUser = await user.save();
  }

  let users = await User.find({});
  for (let blog of InitialBlogs) {
    blog.author = users[0].id;
  }

  await Blog.insertMany(InitialBlogs);
  token = (await api.post("/api/login").send(LoginUser)).body.token;
});

describe("Blogs are fetched properly", () => {
  test("Blogs are being fetched", async () => {
    const response = await api
      .get("/api/blogs")
      .set({ Authorization: "Bearer " + token })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveLength(InitialBlogs.length);
  }, 10000);

  test("Blogs have id property", async () => {
    const resposne = await api
      .get("/api/blogs")
      .set({ Authorization: "Bearer " + token })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    let blog = resposne.body[0];
    expect(blog.id).toBeDefined();
  }, 10000);

  test("Likes default to zero if missing", async () => {
    let response = await api
      .get("/api/blogs")
      .set({ Authorization: "Bearer " + token });
    const blogs = response.body;
    expect(blogs[2].likes).toBe(0);
  });
});

describe("Blogs are saved properly", () => {
  test("A valid Blog can be added", async () => {
    const newBlog = {
      title: "Test Blog",
      url: "ShaatHai",
      likes: 69,
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: "Bearer " + token })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs").set({ Authorization: "Bearer " + token });
    const titles = response.body.map((b) => b.title);

    expect(response.body).toHaveLength(InitialBlogs.length + 1);
    expect(titles).toContain("Test Blog");
  });

  test("Invalid blog responds with 400 Bad Request", async () => {
    const newBlog = {
      likes: 69,
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: "Bearer " + token })
      .send(newBlog)
      .expect(400);
  }, 10000);
});

describe("Blogs are updated properly", () => {
  test("A Blog is updated", async () => {
    const iBlogs = (
      await api.get("/api/blogs").set({ Authorization: "Bearer " + token })
    ).body;
    console.log(iBlogs[0]);

    const updatedBlog = { ...iBlogs[0], likes: 69 };

    console.log(updatedBlog);

    let response = await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .set({ Authorization: "Bearer " + token })
      .send(updatedBlog)
      .expect(200);
    response = response.body;

    // const aBlogs = (await api.get("/api/blogs")).body;
    expect(response.likes).toBe(69);
  });
});

describe("Blogs are deleted properly", () => {
  test("A Blog is deleted", async () => {
    const iBlogs = (
      await api.get("/api/blogs").set({ Authorization: "Bearer " + token })
    ).body;

    await api
      .delete(`/api/blogs/${iBlogs[0].id}`)
      .set({ Authorization: "Bearer " + token })
      .expect(204);

    const aBlogs = (
      await api.get("/api/blogs").set({ Authorization: "Bearer " + token })
    ).body;
    expect(aBlogs).toHaveLength(iBlogs.length - 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
