const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');

// Endpoint handler function to get all matches of a specific user
// const getMatches = async (req, res) => {
//     try {
//       const { userId } = req.params;
//       // Find the user by ID
//       const user = await MongoDB.db
//       .collection(mongoConfig.collections.USERS).findById(userId);
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       // Find all matches for the user
//       const matches = await user.find({ $or: [{ userId1: userId }, { userId2: userId }] });
//       res.status(200).json({ matches });
//     } catch (error) {
//       console.error('Error getting matches:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
// };


// // Socket.IO server setup
// io.on('connection', socket => {
//     console.log('A user is connected');
  
//     // Event listener for sending messages
//     socket.on('sendMessage', async data => {
//       try {
//         const { senderId, receiverId, message } = data;
  
//         console.log('Message data:', data);
  
//         // Save the message to the database
//         const newMessage = new Chat({ senderId, receiverId, message });
//         await newMessage.save();
  
//         // Emit the message to the receiver
//         io.to(receiverId).emit('receiveMessage', newMessage);
//       } catch (error) {
//         console.error('Error handling the message:', error);
//       }
//     });
  
//     // Event listener for user disconnection
//     socket.on('disconnect', () => {
//       console.log('User disconnected');
//     });
//   });
  
//   // Start the Socket.IO server
//   http.listen(8000, () => {
//     console.log('Socket.IO server running on port 8000');
//   });


//   const Messages = async (req, res) => {
//     try {
//       const { senderId, receiverId } = req.query;
  
//       console.log(senderId);
//       console.log(receiverId);
  
//       const messages = await Chat.find({
//         $or: [
//           { senderId: senderId, receiverId: receiverId },
//           { senderId: receiverId, receiverId: senderId },
//         ],
//       }).populate('senderId', '_id name');
  
//       res.status(200).json(messages);
//     } catch (error) {
//       res.status(500).json({ message: 'Error in getting messages', error });
//     }
//   };

// Export the endpoint handler function
module.exports = { };
