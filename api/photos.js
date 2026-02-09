import { list } from '@vercel/blob';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // List all blobs
    const { blobs } = await list();
    
    // Convert to photo format and sort by upload time (newest first)
    const photos = blobs
      .map(blob => ({
        url: blob.url,
        uploadedAt: new Date(blob.uploadedAt).getTime(),
      }))
      .sort((a, b) => b.uploadedAt - a.uploadedAt);

    return res.status(200).json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return res.status(500).json({ error: 'Failed to fetch photos' });
  }
}