import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Login from "./components/Login";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState();

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
        <BlogForm setBlogs={setBlogs} />
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
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
