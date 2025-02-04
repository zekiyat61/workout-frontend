import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { RiDeleteBin5Line } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";
import "../App.css";

const Home = () => {
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const navigate = useNavigate();
  const usernameLocal = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/"); // Redirect if not authenticated
  }

  const { enqueueSnackbar } = useSnackbar();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/activities`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token with the request
        },
      })
      .then((res) => {
        setActivities(res.data.data);
        console.log("data", res);
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("Failed to fetch activities", { variant: "error" });
      });
  }, [token]);

  // Handle creating a new activity
  const handleSaveActivitie = async () => {
    if (!title || !load || !reps) {
      enqueueSnackbar("Please fill in all fields", {
        variant: "error",
      });
      return;
    }

    const data = {
      title,
      load,
      reps,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/activities`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token with the request
          },
        }
      );
      console.log("Workout added:", response.data);

      enqueueSnackbar("Workout added successfully!", { variant: "success" });

      setActivities((prevActivities) => [...prevActivities, response.data]); // Add the new activity to the state
      setTitle("");
      setLoad("");
      setReps("");
    } catch (error) {
      console.error("Error creating workout:", error);
      if (error.response?.status === 401) {
        enqueueSnackbar("Unauthorized: Please log in again.", {
          variant: "error",
        });
        handleLogOut(); // Log the user out if unauthorized
      } else {
        enqueueSnackbar("An error occurred while adding the workout.", {
          variant: "error",
        });
      }
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #f1f8e9, #e3f2fd)",
      }}
    >
      {/* Navbar */}
      <div className="d-flex justify-content-between align-items-center bg-white shadow-sm p-3 px-5">
        <h1 className="fw-bold text-primary">MY WORKOUT GYM</h1>
        <div className="d-flex align-items-center gap-3">
          <span className="text-secondary fs-5">{usernameLocal}</span>
          <button
            className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container my-4 d-flex flex-wrap justify-content-between gap-4">
        {/* Activities List */}
        <div className="flex-grow-1">
          <h2 className="text-primary fw-bold mb-4">Workouts</h2>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity._id}
                className="mb-4 p-4 bg-white shadow-sm rounded-4 d-flex justify-content-between align-items-start"
              >
                <div>
                  <h4 className="text-primary fw-bold mb-3">
                    {activity.title}
                  </h4>
                  <div className="mb-2">
                    <span className="fw-bold text-secondary">Load (kg): </span>
                    <span>{activity.load}</span>
                  </div>
                  <div className="mb-2">
                    <span className="fw-bold text-secondary">Reps: </span>
                    <span>{activity.reps}</span>
                  </div>
                  <div>
                    <small className="text-muted">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                      })}
                    </small>
                  </div>
                </div>
                <Link
                  to={`/activities/delete/${activity._id}`}
                  className="text-danger fs-4"
                >
                  <RiDeleteBin5Line />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-muted fs-5">
              No activities found. Add a new workout to get started!
            </p>
          )}
        </div>

        {/* Add New Workout */}
        <div
          className="bg-white shadow-sm rounded-4 p-4"
          style={{
            width: "350px",
          }}
        >
          <h2 className="text-primary fw-bold mb-4">Add a New Workout</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveActivitie();
            }}
          >
            <div className="mb-3">
              <label className="form-label text-secondary fw-bold">
                Exercise Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control rounded-pill px-3 py-2"
                placeholder="Enter exercise title"
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary fw-bold">
                Load (in Kg):
              </label>
              <input
                type="number"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                className="form-control rounded-pill px-3 py-2"
                placeholder="Enter load in kg"
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-secondary fw-bold">Reps:</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="form-control rounded-pill px-3 py-2"
                placeholder="Enter number of reps"
              />
            </div>
            <button
              className="btn btn-primary rounded-pill w-100 py-2 fw-bold"
              type="submit"
              style={{
                transition: "0.3s ease",
                backgroundColor: "#007bff",
                border: "none",
              }}
            >
              Add Workout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
