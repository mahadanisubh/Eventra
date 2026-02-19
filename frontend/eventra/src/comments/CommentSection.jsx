import React, { useEffect, useState } from "react";
import BASE_URL from "../../api.js";
import CommentItem from "./CommentItem.jsx";

const CommentSection = ({ eventId }) => {
  const token = localStorage.getItem("token");

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/comments/${eventId}`);
      const data = await res.json();

      if (res.ok) {
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!token) {
      alert("Login to comment");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/comment/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setText("");
      fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="comment-section">
      <h2>Comments</h2>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          placeholder="Write your comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn primary">
          Post
        </button>
      </form>

      <div className="comment-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              eventId={eventId}
              refresh={fetchComments}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;