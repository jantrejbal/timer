export default async function handler(req, res) {
  console.log('Received request:', req.method, req.body);
  
  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, memberId } = req.body;
    console.log('Received sessionId:', sessionId, 'memberId:', memberId);

    if (!sessionId || !memberId) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Session ID and Member ID are required' });
    }

    console.log('Validation passed, sending success response');
    return res.status(200).json({
      success: true,
      message: 'Timer started',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in start-timer API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
