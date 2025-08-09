import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './config/db.js';
import messageRoutes from './routes/message.route.js';
import MessagesModel from './models/Messages.model.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
connectDB();


const app = express();
app.use(
  cors({
    origin: [
      "https://whatsapp-a7yf.vercel.app", // frontend URL
      "http://localhost:5173" // for local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/messages', messageRoutes);

const server = http.createServer(app);

// Create socket server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // React URL
    methods: ["GET", "POST"]
  }
});

// When a client connects
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for send_message event
  socket.on('send_message', async (msgData) => {
  try {
    const messageDoc = {
      id: msgData.id || `wamid.${Date.now()}-${Math.random().toString(36).slice(2)}`,
      contact_name: msgData.contact_name,
      direction: msgData.direction, // 'outbound' or 'inbound'
      from: msgData.from,
      status: msgData.status || 'sent',
      text: msgData.text,
      timestamp: msgData.timestamp, // seconds
      to: msgData.to,
      type: 'text',
      wa_id: msgData.wa_id,
      status_timestamp: msgData.status_timestamp || Math.floor(Date.now() / 1000)
    };

    const newMsg = new MessagesModel(messageDoc);
    await newMsg.save();
    console.log("✅ Message saved:", messageDoc);

    // Send to recipient
    io.to(msgData.wa_id).emit('receive_message', messageDoc);
  } catch (err) {
    console.error("❌ Failed to save message:", err);
  }
});

  // Join a room based on user id (for private messaging)
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
