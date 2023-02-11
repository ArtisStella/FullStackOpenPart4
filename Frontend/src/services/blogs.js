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

const postBlog = async newBlog => {
  const config = { headers: { Authorization: token } };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, postBlog, SetToken };
