import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

const DeleteActivities = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = useParams();
  console.log("Activity ID:", id);
  console.log("Params:", params);

  const handleCancel = () => {
    navigate("/home");
  };
  const handleDeleteActivities = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! Redirecting to login...");
      navigate("/"); // Redirect to login page if no token
      return;
    }
    setLoading(true);
    axios
      .delete(`${import.meta.env.VITE_SERVER_URL}/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setLoading(false);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div
        className="p-4 d-flex align-items-center justify-content-center container"
        style={{
          height: "100vh",
          flexDirection: "column",
          background: "linear-gradient(135deg, #f1f8e9, #e3f2fd)",
        }}
      >
        <div className="loading-spinner"></div> {/* Spinner */}
        <div className="mt-3">Loading...</div> {/* Text below the spinner */}
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column min-vh-100"
      style={{ background: "rgba(0, 0, 0, 0.05)" }}
    >
      <div
        className="bg-white shadow-sm rounded-4 p-5 text-center"
        style={{ width: "400px" }}
      >
        <h5 className="display-6 mb-4 text-danger">
          Are you sure you want to delete this workout?
        </h5>
        <p className="text-secondary mb-4">
          This action cannot be undone. Please confirm if you'd like to proceed.
        </p>
        <div className="d-flex justify-content-between">
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="btn btn-outline-secondary px-4 py-2 fw-bold"
            style={{ width: "45%" }}
          >
            Cancel
          </button>
          {/* Delete Button */}
          <button
            onClick={handleDeleteActivities}
            className="btn btn-danger px-4 py-2 fw-bold"
            style={{ width: "45%" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteActivities;
