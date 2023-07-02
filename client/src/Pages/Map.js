import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import './Map.css';

// Custom marker icon
const getRandomColor = () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'yellow'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getMarkerIcon = (color) => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });
};

const Map = () => {
  const location = useLocation();
  const roomCode = location.state.roomCode;
  const userName = location.state.userName;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/room/roomData/${roomCode}`);
      const userData = response.data.map((user) => ({ ...user, color: getRandomColor() }));
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const navigate = useNavigate();
  const handleLeaveRoom = async () => {
    try {
      const requestBody = {
        roomCode: roomCode,
        name: userName
      };

      await axios.post('http://localhost:5000/room/leave', requestBody);

      navigate('/');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  useEffect(() => {
    const sendLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;

        const requestBody = {
          "roomCode": roomCode,
          "name": userName,
          "latitude": latitude,
          "longitude": longitude,
        };

        const response = await axios.post('http://localhost:5000/room/updateLocation', requestBody);
        console.log('Location updated:', response.data);
      } catch (error) {
        console.error('Error updating location:', error);
      }
    };

    const interval = setInterval(sendLocation, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [roomCode, userName]);

  return (
    <div className="map-container">
      <MapContainer center={[16, 77]} zoom={5} className="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {users.map((user) => (
          <Marker
            key={user.id}
            position={[user.location.latitude, user.location.longitude]}
            icon={getMarkerIcon(user.color)}
          >
            <Popup>{user.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <button className="leave-button" onClick={handleLeaveRoom}>Leave</button>
    </div>
  );
};

export default Map;

