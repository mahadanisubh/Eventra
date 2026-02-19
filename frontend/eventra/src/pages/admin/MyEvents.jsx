import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../../../api.js";
import EventCard from "../../components/EventCard.jsx";

const MyEvents = () => {
  const token = localStorage.getItem("token");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [regs, setRegs] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${BASE_URL}/myevents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/deleteevent/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      setLoadingRegs(true);

      const res = await fetch(`${BASE_URL}/myevents/${eventId}/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRegs(data.registrations);
      setSelectedEventId(eventId);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingRegs(false);
    }
  };

  const handleExport = async (eventId) => {
    try {
      const res = await fetch(`${BASE_URL}/myevents/${eventId}/export-csv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "registrations.csv";
      a.click();
    } catch (err) {
      alert("Export failed");
    }
  };

  const handleToggle = (eventId) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
    } else {
      fetchRegistrations(eventId);
    }
  };

  return (
    <div className="home">
      <h1>My Events</h1>

      <div className="event-grid">
        {events.map((event) => (
          <div key={event._id}>
            <EventCard
              event={event}
              isAdmin={true}
              onDelete={handleDelete}
              onToggleRegistrations={handleToggle}
              isOpen={selectedEventId === event._id}
            />

            {/* REGISTRATIONS SECTION */}
            {selectedEventId === event._id && (
              <div className="registrations-wrapper">
                <div className="registrations-box">
                  {loadingRegs ? (
                    <p>Loading registrations...</p>
                  ) : regs.length === 0 ? (
                    <p>No registrations yet.</p>
                  ) : (
                    <>
                      <table className="registrations-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {regs.map((user) => (
                            <tr key={user._id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <button
                        className="btn"
                        onClick={() => handleExport(event._id)}
                      >
                        Export CSV
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
