import axios from 'axios';

export default async function handler(req, res) {
  const { page = 1, per_page = 12 } = req.query; // Extract query parameters

  try {
    const response = await axios.get('https://api.unsplash.com/photos', {
      params: { page, per_page },
      headers: {
        Authorization: `Client-ID ${process.env.VITE_UNSPLASH_ACCESS_KEY}`,
      },
    });

    // Set CORS headers to allow frontend requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log('Unsplash API Response:', response.data); // Debugging

    res.status(200).json(response.data); // Return the photo data
  } catch (error) {
    console.error('Error fetching photos:', error.message);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
}
