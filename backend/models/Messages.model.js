import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: String,
  from: String,
  to: String,
  timestamp: Number,
  text: String,
  type: String,
  contact_name: String,
  wa_id: String,
  direction: String,
  status: String,
  status_timestamp: Number
}, { timestamps: true });
export default mongoose.model('Message', messageSchema, 'processed_messages');
