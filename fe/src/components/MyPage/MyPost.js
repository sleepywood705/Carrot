import { useState, useEffect } from "react";
import axios from "../../api/axios.js";

export function MyPost({ userId }) {
  const [userEmail, setUserEmail] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myPost, setMyPost] = useState([]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/users/me", {
          headers: {
            Authorization: token,
          },
        });
        console.log(response.data.data.email);
        setUserEmail(response.data.data.email);
      } catch (err) {
        console.error(err);
        setError("이메일을 가져오는 데 실패했습니다.");
      }
    };
    fetchUserEmail();
  }, [userId]);

  useEffect(() => {
    if (userEmail) {
      const fetchTrips = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get("/posts/gets");
          console.log("서버에서 받은 데이터:", response.data);

          if (response.data && Array.isArray(response.data.data)) {
            setTrips(response.data.data);
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
      fetchTrips();
    }
  }, [userEmail]);

  useEffect(() => {
    if (trips.length > 0) {
      const filteredTrips = trips.filter(
        (trip) => trip.author.email === userEmail
      );
      setMyPost(filteredTrips);
    }
  }, [trips, userEmail]);

  return (
    <div id="MyPost">
      <h2>내가 작성한 글</h2>
      {isLoading && <p>로딩 중...</p>}
      {error && <p>{error}</p>}
      {myPost.length === 0 && !isLoading && !error && <div><p>작성한 게시글이 없습니다</p></div>}
      {myPost.map((post, index) => (
        <div key={index}>
          <p>{post.title}</p>
        </div>
      ))}
    </div>
  );
}