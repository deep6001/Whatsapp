import express from 'express';
import Message from '../models/Messages.model.js';


const router = express.Router();

router.get('/getallusers',async (req, res) => {
    const businessNumber = '918329446654'; // your own number
    try {
const users = await Message.aggregate([
      {
        $match: {
          wa_id: { $ne: businessNumber }
        }
      },
      {
        $group: {
          _id: "$wa_id", // unique user ID
          name: { $first: "$contact_name" },
          lastMessage: { $last: "$text" },
          lastTimestamp: { $last: "$timestamp" }
        }
      },
      {
        $sort: { lastTimestamp: -1 }
      }
    ]);

    res.json(users);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const messages = await Message.find({ wa_id: userId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



export default router;


