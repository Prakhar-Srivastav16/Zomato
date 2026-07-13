const users = [];

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'POST' && pathname === '/api/users/create') {
    try {
      const { username, email, password } = await readBody(req);

      if (!username || !email || !password) {
        return sendJson(res, 400, { message: 'Missing required fields' });
      }

      const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return sendJson(res, 409, { message: 'User already exists' });
      }

      const newUser = { id: Date.now(), username, email, password };
      users.push(newUser);

      const { password: _, ...safeUser } = newUser;
      return sendJson(res, 201, safeUser);
    } catch (error) {
      return sendJson(res, 400, { message: error.message || 'Invalid request body' });
    }
  }

  if (req.method === 'POST' && pathname === '/api/users/login') {
    try {
      const { email, password } = await readBody(req);
      const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

      if (!user || user.password !== password) {
        return sendJson(res, 401, { message: 'Invalid email or password' });
      }

      const { password: _, ...safeUser } = user;
      return sendJson(res, 200, safeUser);
    } catch (error) {
      return sendJson(res, 400, { message: error.message || 'Invalid request body' });
    }
  }

  if (req.method === 'GET' && pathname === '/api/users/all') {
    return sendJson(res, 200, users);
  }

  return sendJson(res, 404, { message: 'Route not found' });
}
