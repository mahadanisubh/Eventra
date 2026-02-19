import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api.js";
import Loader from "../components/Loader.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    if (!token) {
      navigate("/loginuser");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/myprofile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setProfile(data.profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loader />;
  if (error) return <h2>{error}</h2>;
  if (!profile) return <h2>No profile data</h2>;

  return (
    <div className="profile-page">
      {/* Header Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          {profile.name?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>
      </div>

      {/* Registered Events */}
      <div className="profile-section">
        <h3>Registered Events</h3>

        {profile.registeredEvents?.length === 0 ? (
          <p>No events registered yet.</p>
        ) : (
          <div className="registered-grid">
            {profile.registeredEvents.map((event) => (
              <div key={event._id} className="registered-card">
                <h4>{event.title}</h4>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
