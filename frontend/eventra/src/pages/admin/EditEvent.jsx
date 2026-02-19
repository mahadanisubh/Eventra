import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../../api.js";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    desc: "",
    category: "",
    location: "",
    date: "",
    time: "",
    status: "",
  });

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${BASE_URL}/getEventById/${eventId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const event = data.event;

      setForm({
        title: event.title,
        desc: event.desc,
        category: event.category,
        location: event.location,
        date: event.date?.split("T")[0],
        time: event.time,
        status: event.status,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/updateEvent/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Event updated successfully");
      navigate("/myevents");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-page">
      <h1>Edit Event</h1>

      <form onSubmit={handleUpdate} className="form">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />

        <textarea
          name="desc"
          value={form.desc}
          onChange={handleChange}
          placeholder="Description"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <input
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="Time"
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button className="btn">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
