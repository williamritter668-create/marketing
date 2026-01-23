require('dotenv').config();

// FIX: Force disable SSL verification for Aiven/Railway self-signed certs
// This is required because 'pg' sometimes ignores connection config
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Database & Config
const { connectDB, pool } = require('./db');
const seedAdmin = require('./utils/seedAdmin');

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');

const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Railway's reverse proxy (required for secure cookies in production)
app.set('trust proxy', true); // Trust all proxies to ensure protocol detection works

// Security & Config
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            "http://localhost:5173",
            "http://localhost:3000",
            "https://ad-syria-ai.com",
            "https://www.ad-syria-ai.com",
            "https://adsyria.ai",
            "https://www.adsyria.ai",
            "https://marketing-agency-production.up.railway.app"
        ];

        // Normalize allowed origins by removing trailing slashes
        const normalizedAllowed = allowedOrigins.map(url => url ? url.replace(/\/$/, "") : url);

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (normalizedAllowed.includes(origin) ||
            (origin && (
                origin.endsWith('.railway.app') ||
                origin.includes('vercel.app') ||
                origin.endsWith('.ad-syria-ai.com') ||
                origin.endsWith('.adsyria.ai')
            ))) {
            return callback(null, true);
        }

        console.error('❌ CORS Blocked Origin:', origin);
        return callback(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session Setup
const isProduction = process.env.NODE_ENV === 'production';
console.log(`🔧 Session Config | Env: ${process.env.NODE_ENV} | Secure Cookie: ${isProduction}`);

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'user_sessions',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        partitioned: isProduction, // Required for Chrome's new cross-site cookie policy
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

// Global Mock State (Preserved for logic compatibility)
global.mockData = { users: [], subscriptions: [], projects: [] };
global.isMock = true; // Default

// Initialize Database and Start Server
const startServer = async () => {
    let dbConnected = false;

    if (process.env.DATABASE_URL) {
        dbConnected = await connectDB();
        if (dbConnected) {
            global.isMock = false;
            console.log('🎯 Running in LIVE DATABASE MODE');

            // Secure Admin Seeding
            await seedAdmin();
        } else {
            console.log('⚠️  Falling back to MOCK DATA MODE');
            global.isMock = true;
        }
    } else {
        console.log('⚠️  No DATABASE_URL found. Running in MOCK DATA MODE');
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
};

startServer();

// Routes Wiring
app.use('/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes); // Admin user management
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);


// Basic Health Check & Session State Debug
app.get('/', (req, res) => {
    res.json({
        message: 'Ad Syria Ai API is Running 🚀',
        mode: global.isMock ? 'Mock Mode' : 'Live Database',
        user: req.session.user ? req.session.user.email : 'Guest / No Session Found',
        sessionID: req.sessionID ? 'Valid' : 'Invalid',
        cookieStatus: 'Secure+SameSiteNone'
    });
});
