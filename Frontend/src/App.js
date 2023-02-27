import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Login from "./components/Login";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState();

  const saveBlog = async ( data ) => {
    await blogService.postBlog(data);
    refreshBlogs();
  };

  const refreshBlogs = () => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  };

  const likeBlog = async (blog, setLikes) => {
    const updatedBlog = {
      id: blog.id,
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1,
      author: blog.author.id,
    };
    blogService.likeBlog(updatedBlog);
    setLikes(blog.likes + 1);
  };

  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure want to delete this blog?")) {
      await blogService.deleteBlog(id);
      refreshBlogs();
    }
  };

  useEffect(() => {
    const user = window.localStorage.getItem("loggedInUser");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.SetToken(user.token);
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  const logout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  const showBlogs = () => {
    return (
      <div>
        <div>
          <span className="me-2">{user.name} logged in.</span>
          <button className="btn btn-outline-primary btn-sm" onClick={logout}>
            Log out
          </button>
        </div>
        <Togglable buttonLabel="Add New">
          <BlogForm saveBlog={saveBlog} />
        </Togglable>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={{ ...blog, user: user }}
              likeBlog= {likeBlog}
              deleteBlog={deleteBlog}
            />
          ))}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h2>Blogs</h2>
      {user ? showBlogs() : <Login setUser={setUser} />}
    </div>
  );
};

export default App;
