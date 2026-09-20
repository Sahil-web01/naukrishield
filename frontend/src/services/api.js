const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function analyzeText(text) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to analyze text');
  }
  return data;
}

export async function fetchScanHistory() {
  try {
    const response = await fetch(`${API_BASE}/history`);
    if (!response.ok) return { history: [] };
    return await response.json();
  } catch (err) {
    console.error('Failed to fetch history:', err);
    return { history: [] };
  }
}

export async function fetchScanStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    return null;
  }
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch (err) {
    return false;
  }
}
