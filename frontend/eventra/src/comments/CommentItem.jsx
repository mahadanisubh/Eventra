import React, { useState } from "react";
import BASE_URL from "../../api.js";

const CommentItem = ({ comment, eventId, refresh }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/comment/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: replyText,
          parentComment: comment._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setReplyText("");
      setShowReplyBox(false);
      refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <strong>{comment.user?.name || "User"}</strong>
        <span>
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      <p>{comment.text}</p>

      <div className="comment-actions">
        <button
          className="reply-btn"
          onClick={() => setShowReplyBox(!showReplyBox)}
        >
          Reply
        </button>

        {comment.replies?.length > 0 && (
          <button
            className="view-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies
              ? "Hide replies"
              : `View replies (${comment.replies.length})`}
          </button>
        )}
      </div>

      {showReplyBox && (
        <div className="reply-box">
          <textarea
            placeholder="Write reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button onClick={handleReply} className="btn small">
            Reply
          </button>
        </div>
      )}

      {showReplies && comment.replies?.length > 0 && (
        <div className="reply-list">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              eventId={eventId}
              refresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;