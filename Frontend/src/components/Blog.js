import React, { useState } from "react";
import Togglable from "./Togglable";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const Blog = ({ blog, refreshBlogs }) => {
  const [likes, setLikes] = useState(blog.likes);
  const blogByUser = blog.author.username === blog.user.username ? true : false;

  const likeBlog = async () => {
    const updatedBlog = {
      id: blog.id,
      title: blog.title,
      url: blog.url,
      likes: likes + 1,
      author: blog.author.id,
    };
    blogService.likeBlog(updatedBlog);
    setLikes(likes + 1);
  };

  const deleteBlog = async () => {
    if (window.confirm("Are you sure want to delete this blog?")) {
      await blogService.deleteBlog(blog.id);
      refreshBlogs();
    }
  };

  return (
    <div>
      <Togglable
        buttonLabel="View"
        closeButtonLabel="Collapse"
        text={blog.title + " - " + blog.author.name}
      >
        <div className="mb-2">
          <h5>{blog.title}</h5>
          <a href={blog.url}>{blog.url}</a>
          <div>
            <span className="mb-0 me-2">Likes: {likes}</span>
            <button className="btn btn-primary btn-sm" onClick={likeBlog}>
              Like
            </button>
          </div>
          <p>{blog.author.name}</p>
          {blogByUser ? (
            <button className="btn btn-danger btn-sm" onClick={deleteBlog}>
              Delete
            </button>
          ) : null}
        </div>
      </Togglable>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  refreshBlogs: PropTypes.func.isRequired,
};

export default Blog;
