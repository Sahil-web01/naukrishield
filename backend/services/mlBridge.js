import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INFERENCE_SCRIPT = path.resolve(__dirname, '../../ml/notebooks/inference.py');
const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000/predict';

/**
 * Predicts scam probability using the Python SVM model
 * Checks HTTP endpoint first, then falls back to direct Python invocation.
 */
export async function runMlPrediction(payload) {
  // 1. Try FastAPI ML endpoint if running
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(ML_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        source: 'fastapi-service'
      };
    }
  } catch (err) {
    // FastAPI server not running on port 8000; fall through to Python child process
  }

  // 2. Fall back to direct Python script execution
  return new Promise((resolve) => {
    try {
      const pythonProcess = spawn('python', [INFERENCE_SCRIPT], {
        cwd: path.dirname(INFERENCE_SCRIPT),
        timeout: 4000
      });

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0 && stdout.trim()) {
          try {
            const parsed = JSON.parse(stdout.trim());
            return resolve({
              ...parsed,
              source: 'python-direct'
            });
          } catch (parseErr) {
            // parse error
          }
        }
        resolve(null);
      });

      pythonProcess.on('error', () => {
        resolve(null);
      });

      pythonProcess.stdin.write(JSON.stringify(payload));
      pythonProcess.stdin.end();
    } catch (err) {
      resolve(null);
    }
  });
}
