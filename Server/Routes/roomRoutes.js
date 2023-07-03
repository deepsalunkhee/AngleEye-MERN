const express = require('express');
const Room = require('../Models/Room');
const router = express.Router();

// Creating a new room
router.post('/create', async (req, res) => {
  try {
    // Generating a room code
    const generateRoomCode = () => {
      const digits = '0123456789';
      let roomCode = '';

      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        roomCode += digits[randomIndex];
      }

      return roomCode;
    };

    const roomCode = generateRoomCode();
   

    // Generating an expiration time
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 5);

    // Create a new room using the Room model
    const room = new Room({
      roomCode: roomCode,
      expitationTime: expirationTime,
      
    });

    // Save the room to the database
    const savedRoom = await room.save();

    res.status(200).json(savedRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Joining a room

router.post('/join', async (req, res) => {
    try {
        const { roomCode, name, latitude, longitude } = req.body;

        // Find the room with the given room code

        const room=await Room.findOne({roomCode:roomCode});
        if(!room){
            return res.status(404).json({error:'Room not found'});
        }

        // Add the user to the room
        room.users.push({
            name:name,
            location:{
                latitude:latitude,
                longitude:longitude,
            }

        })

        // Save the room to the database
        const savedRoom=await room.save();
        res.status(200).json(savedRoom);
    } catch (error) {
        console.error('Error joining room:', error);
        res.status(500).json({ error: 'Failed to join room' });
    }
});

//leave the room
router.post('/leave', async (req, res) => {
    try {
      const { roomCode, name } = req.body;
  
      // Find the room with the given room code
      const room = await Room.findOne({ roomCode: roomCode });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      // Check if the user is already in the room
      const user = room.users.find((user) => user.name === name);
      if (!user) {
        return res.status(400).json({ error: 'User is not in the room' });
      }
  
      // Remove the user from the room
      room.users = room.users.filter((user) => user.name !== name);
      await room.save();
  
      res.json({ message: 'Left room successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to leave room' });
    }
  });

  // Fetching all users of a room along with their locations
router.get('/roomData/:roomCode', async (req, res) => {
  try {
    const roomCode = req.params.roomCode;

    // Find the room with the given room code
    const room = await Room.findOne({ roomCode: roomCode });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Extract the user data with locations from the room
    const userData = room.users.map((user) => {
      return {
        name: user.name,
        location: user.location,
      };
    });

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching room data:', error);
    res.status(500).json({ error: 'Failed to fetch room data' });
  }
});

//Updating the location of a user
router.post('/updateLocation', async (req, res) => {
  try {
    const { roomCode, name, latitude, longitude } = req.body;

    // Find the room with the given room code
    const room = await Room.findOne({ roomCode: roomCode });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Find the user in the room
    const user = room.users.find((user) => user.name === name);
    if (!user) {
      return res.status(400).json({ error: 'User not found in the room' });
    }

    // Update the user location
    user.location.latitude = latitude;
    user.location.longitude = longitude;

    // Save the room to the database
    const savedRoom = await room.save();
    res.status(200).json(savedRoom);
  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({ error: 'Failed to update user location' });
  }
});

  

  




module.exports = router;
