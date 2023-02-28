import React, { useState } from "react";

const BlogForm = ({ saveBlog }) => {
  const [title, setTitle] = useState();
  const [url, setUrl] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const saveBlogHandler = async (event) => {
    event.preventDefault();
    try {
      await saveBlog({ title, url });
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
      <form onSubmit={saveBlogHandler}>
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input
            required
            className="form-control form-control-sm titleInput"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="form-label">URL</label>
          <input
            required
            className="form-control form-control-sm urlInput"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm addBlogBtn" type="submit">
          Add
        </button>
      </form>
      {successMessage ? <p className="mt-2 alert alert-success">{successMessage}</p> : null}
      {errorMessage ? <p className="mt-2 alert alert-danger">{errorMessage}</p> : null}
    </div>
  );
};

export default BlogForm;
