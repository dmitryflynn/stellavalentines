import { del, list } from '@vercel/blob';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // List all blobs
    const { blobs } = await list();
    
    // Delete all blobs
    const deletePromises = blobs.map(blob => del(blob.url));
    await Promise.all(deletePromises);

    return res.status(200).json({ 
      success: true, 
      deletedCount: blobs.length,
      message: `Deleted ${blobs.length} photos` 
    });
  } catch (error) {
    console.error('Error deleting photos:', error);
    return res.status(500).json({ 
      error: 'Failed to delete photos',
      details: error.message 
    });
  }
}