import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [userLocation, setUserLocation] = useState(null); // Store selected location
  const [googleLoaded, setGoogleLoaded] = useState(false); // State to check if Google Maps API is loaded

  const handleMapClick = (e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setUserLocation(newLocation); // Update location when the map is clicked
    console.log("Selected location:", newLocation); // Log the selected location
  };

  // Register user with location
  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;

    if (!userLocation) {
      toast.error("Please select a location on the map.");
      return;
    }

    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
        location: userLocation, // Send the selected location
      });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setData({ name: "", email: "", password: "" });
        toast.success("Registration successful. Welcome!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const containerStyle = {
    width: "100%",
    height: "300px",
  };

  useEffect(() => {
    const checkGoogleMaps = setInterval(() => {
      if (window.google) {
        setGoogleLoaded(true);
        clearInterval(checkGoogleMaps);
      }
    }, 100);
  }, []);

  const redMarkerIcon = googleLoaded
    ? {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(32, 32),
      }
    : null;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Register</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={registerUser} className="border p-4 rounded shadow">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter name..."
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter email..."
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter password..."
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
            </div>

            {/* Google Maps Display */}
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Select Location
              </label>
              <LoadScript googleMapsApiKey="AIzaSyCrSNiEuJqZhYrrSB4Y22hrMJcW_ryIpMA">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{ lat: 6.9271, lng: 79.8612 }} // Default to a central location (Sri Lanka)
                  zoom={10}
                  onClick={handleMapClick} // Allows user to select location by clicking the map
                >
                  {/* Show red marker when user selects location */}
                  {userLocation && redMarkerIcon && (
                    <Marker position={userLocation} icon={redMarkerIcon} />
                  )}
                </GoogleMap>
              </LoadScript>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
          <p className="text-center mt-3">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
