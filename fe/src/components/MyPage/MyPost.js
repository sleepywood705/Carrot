import { useState, useEffect } from "react";
import axios from "../../api/axios.js";

export function MyPost({ user }) {
  const [myPost, setMyPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/posts/gets", {
          headers: { Authorization: token },
        });
        console.log("서버에서 받은 데이터:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
          const filteredPosts = response.data.data.filter(
            (post) => post.author.email === user.email
          );
          setMyPost(filteredPosts);
        } else {
          throw new Error("서버에서 받은 데이터 구조가 예상과 다릅니다.");
        }
      } catch (error) {
        console.error("포스팅 데이터를 가져오는 데 실패했습니다:", error);
        setError(error.message || "데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [user.email]);

  return (
    <div id="MyPost">
      <h2>내가 작성한 글</h2>
      {isLoading && <p>로딩 중...</p>}
      {error && <p>{error}</p>}
      {myPost.length === 0 && !isLoading && !error && <div><p>작성한 게시글이 없습니다</p></div>}
      {myPost.map((post, index) => (
        <div key={index} className="postHistory">
          <p>{post.title}</p>
        </div>
      ))}
    </div>
  );
}