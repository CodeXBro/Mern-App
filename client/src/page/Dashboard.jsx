import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 6.9271,
  lng: 79.8612,
};

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/clustering")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {!!user && <h2>Hi {user.name}!</h2>}
      {loading ? (
        <p>Loading user locations...</p>
      ) : (
        <LoadScript googleMapsApiKey="AIzaSyCrSNiEuJqZhYrrSB4Y22hrMJcW_ryIpMA">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
            {users.map((user, index) => {
              if (!user.lat || !user.lng) return null;
              return (
                <Marker
                  key={index}
                  position={{
                    lat: user.lat,
                    lng: user.lng,
                  }}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "red",
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWeight: 2,
                  }}
                  title={user.name || "Unknown User"}
                />
              );
            })}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
}
