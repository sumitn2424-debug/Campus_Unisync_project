import { createContext, useState } from "react";
import api from "../services/api"

export const PostContext = createContext()
const PostProvider = ({ children }) => {
  const [postLiked, setPostLiked] = useState(false)
  const [postSaved, setPostSaved] = useState(false)
  const likePost =async (postid) => {
    try {
      const res = await api.post(`/like/like`,{postId:postid})
      return(res.data)
    } catch (error) {
      console.log(error)
      return null;
    }
  }


  const savePost =async (postid) => {
    try {
      const res = await api.post(`/like/save`,{postId:postid})
      return(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <PostContext.Provider value={{postLiked,setPostLiked,likePost,savePost}}>
      {children}
    </PostContext.Provider>
  )
}

export default PostProvider