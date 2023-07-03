import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Entry.css';

const Entry = () => {
  const [userName, setUserName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const navigate = useNavigate();

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post('https://angle-eye-client.vercel.app/room/create', {
        userName: userName,
      });
      const { roomCode } = response.data;
      setRoomCode(roomCode);
      setJoinedRoom(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        axios
          .post('https://angle-eye-client.vercel.app/room/join', {
            roomCode: roomCode,
            name: userName,
            latitude: latitude,
            longitude: longitude,
          })
          .then((response) => {
          
            console.log(response.data);
            setJoinedRoom(true);
          })
          .catch((error) => {
            
            console.error('Error joining room:', error);
          });
      },
      (error) => {
        
        console.error('Error getting location:', error);
      }
    );
  };

  const handleMapClick = () => {
    navigate('/map', { state: { roomCode, userName } }); 
  };

  return (
    <div className="entry-page">
      <div className="entry-container">
        <h2 className="entry-logo">AngleEye</h2>
        <label htmlFor="userName" className="entry-label">User Name:</label>
        <input type="text" id="userName" value={userName} onChange={handleUserNameChange} className="entry-input" />
        <button onClick={handleCreateRoom} className="entry-button">Create Room</button>
  
        {(
          <div>
            <p className="entry-room-code">Room Code: {roomCode}</p>
            <p>Enter Room Code:</p>
            <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} className="entry-input" />
            <button onClick={handleJoinRoom} className="entry-button">Join Room</button>
            {joinedRoom && <button onClick={handleMapClick} className="entry-button">Map</button>}
          </div>
        )}
  
        <div className="entry-note-card">
          <p className="entry-note">
            Note: Please enter your name before pressing "Join Room". Make sure your location is turned on, and after clicking "Join Room", please wait for a few seconds until the "Map" button appears.
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default Entry;
