import api from "../services/api";


export const fetchPosts = async (page) => {
  const res = await api.get(`/data/fetchPosts?page=${page}&limit=10`);
  return res.data
}

export default fetchPosts