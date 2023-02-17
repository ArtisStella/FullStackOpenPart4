import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const SetToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const config = { headers: { Authorization: token } };

  const response = await axios.get(baseUrl, config);
  return response.data;
};

const postBlog = async (newBlog) => {
  const config = { headers: { Authorization: token } };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const likeBlog = async (updatedBlog) => {
  const config = { headers: { Authorization: token } };

  const response = await axios.put(
    baseUrl + `/${updatedBlog.id}`,
    updatedBlog,
    config
  );
  return response.data;
};

const deleteBlog = async (blogId) => {
  const config = { headers: { Authorization: token } };

  const response = await axios.delete(baseUrl + `/${blogId}`, config);
  return response.data;
};


export default { getAll, postBlog, likeBlog, deleteBlog, SetToken };
