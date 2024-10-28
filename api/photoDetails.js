import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query; // Extract the photo ID from the request parameters

  try {
    const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
      headers: {
        Authorization: `Client-ID ${process.env.VITE_UNSPLASH_ACCESS_KEY}`,
      },
    });

    // Set CORS headers to allow frontend requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    

    res.status(200).json(response.data); // Send photo details as JSON
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to fetch photo details' });
  }
}
