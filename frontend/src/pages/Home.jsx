import PostCard from "../components/PostCard";
import StoryBar from "../components/StoryBar";
import { useEffect, useState, useCallback } from "react";
import { fetchPosts } from "../utils/fetchPosts";
import Loader from "../components/Loader";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import PostProvider from "../context/PostContext";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetchPosts(page);
      console.log("full response", res)
      const resData = res
      console.log(resData);

      if (resData?.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...(resData || [])]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadPosts();
  }, []);

  const lastPostRef = useInfiniteScroll(loadPosts, loading, hasMore);

  return (
    <div className="p-3">
      <PostProvider>
        
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostRef} key={post._id}>
                <PostCard post={post} />
              </div>
            );
          }
          return <PostCard key={post._id} post={post} />;
        })}

        {loading && <Loader />}
        {!hasMore && <p className="text-center py-4">No more posts</p>}
      </PostProvider>
    </div>
  );
}