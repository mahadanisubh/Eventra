import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({
  event,
  isAdmin = false,
  onDelete,
  onToggleRegistrations,
  isOpen,
}) => {
  const statusClass =
    event.status === "upcoming"
      ? "status-upcoming"
      : event.status === "completed"
        ? "status-completed"
        : "status-cancelled";

  return (
    <div className="event-card">
      <div className="event-image-wrapper">
        <img src={event.bannerImage} alt={event.title} />
        <span className={`status-badge ${statusClass}`}>{event.status}</span>
      </div>

      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="meta">{event.location}</p>
        <p className="meta">{new Date(event.date).toLocaleDateString()}</p>

        {isAdmin ? (
          <div className="card-actions">
            <Link to={`/editevent/${event._id}`} className="btn">
              Edit
            </Link>

            <button className="btn danger" onClick={() => onDelete(event._id)}>
              Delete
            </button>

            <button
              className="btn"
              onClick={() => onToggleRegistrations(event._id)}
            >
              {isOpen ? "Hide Registrations" : "View Registrations"}
            </button>
          </div>
        ) : (
          <Link to={`/event/${event._id}`} className="btn full">
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default EventCard;
