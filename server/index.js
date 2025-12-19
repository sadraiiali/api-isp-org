import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limit payload size

// Rate limiting (simple in-memory)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute

app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, startTime: now });
  } else {
    const record = rateLimit.get(ip);
    if (now - record.startTime > RATE_LIMIT_WINDOW) {
      record.count = 1;
      record.startTime = now;
    } else {
      record.count++;
      if (record.count > RATE_LIMIT_MAX) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }
    }
  }
  next();
});

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimit.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW * 2) {
      rateLimit.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

// Function to get IP info from ipwho.is (free HTTPS API)
async function getIPInfo(ip, includeAlternate = false) {
  try {
    const url = ip ? `https://ipwho.is/${ip}` : 'https://ipwho.is/';
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      return { error: data.message || 'Invalid IP address' };
    }
    
    const result = {
      ip: data.ip,
      ipType: data.type || (data.ip.includes(':') ? 'IPv6' : 'IPv4'),
      country: data.country,
      countryCode: data.country_code,
      region: data.region,
      regionCode: data.region_code,
      city: data.city,
      postalCode: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone?.id || data.timezone,
      isp: data.connection?.isp || 'Unknown',
      organization: data.connection?.org || 'Unknown',
      asName: data.connection?.asn ? `AS${data.connection.asn} ${data.connection.org}` : 'Unknown'
    };

    return result;
  } catch (error) {
    return { error: 'Failed to fetch IP information' };
  }
}

// API endpoint for IP lookup
app.get('/ip', async (req, res) => {
  // Get client IP - prioritize Cloudflare header
  const cfIP = req.headers['cf-connecting-ip'];
  const xRealIP = req.headers['x-real-ip'];
  const xForwardedFor = req.headers['x-forwarded-for'];
  
  // Debug log
  console.log('Headers:', { cfIP, xRealIP, xForwardedFor });
  
  let clientIP = cfIP || xRealIP || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : '') || req.socket.remoteAddress || '';
  
  // Clean up IP - handle IPv4-mapped IPv6 and localhost
  clientIP = clientIP.replace('::ffff:', '');
  if (clientIP === '::1' || clientIP === '127.0.0.1') {
    clientIP = '';
  }
  
  console.log('Final IP:', clientIP);
  
  // Check if IP is IPv6
  const isIPv6 = clientIP.includes(':');
  
  // Get IP info
  const info = await getIPInfo(clientIP);
  
  // If it's IPv6, set ipv6 field and try to show both
  if (isIPv6 && !info.error) {
    info.ipv6 = clientIP;
    info.ipType = 'IPv6';
    
    // For display, we keep the IPv6 as main IP
    // The frontend will show IPv4 if available or IPv6
  } else if (!info.error) {
    info.ipv4 = clientIP;
    info.ipType = 'IPv4';
  }
  
  res.json(info);
});

app.get('/ip/:ip', async (req, res) => {
  const { ip } = req.params;
  
  // Validate IP format
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
    return res.status(400).json({ error: 'Invalid IP address format' });
  }
  
  const info = await getIPInfo(ip);
  res.json(info);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
  console.log(`Using ipwho.is API (HTTPS)`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  GET /ip       - Get your IP information`);
  console.log(`  GET /ip/:ip   - Get information for a specific IP`);
  console.log(`  GET /health   - Health check`);
});
