import React, { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ setBlogs }) => {
  const [title, setTitle] = useState();
  const [url, setUrl] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const saveBlog = async (event) => {
    event.preventDefault();
    try {
      await blogService.postBlog({ title, url });
      setBlogs(await blogService.getAll());
      setTitle("");
      setUrl("");
      setSuccessMessage("Success!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (exception) {
      setErrorMessage("Some error occured!");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="col-md-3 my-4">
      <h5>Add New</h5>
      <form onSubmit={saveBlog}>
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input
            required
            className="form-control form-control-sm"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="form-label">URL</label>
          <input
            required
            className="form-control form-control-sm"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm" type="submit">
          Add
        </button>
      </form>
      {successMessage ? <p className="mt-2 alert alert-success">{successMessage}</p> : null}
      {errorMessage ? <p className="mt-2 alert alert-danger">{errorMessage}</p> : null}
    </div>
  );
};

export default BlogForm;
