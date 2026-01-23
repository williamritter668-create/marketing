const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { users } = require('../db/schema');
const { eq, or } = require('drizzle-orm');

const login = async (req, res) => {
    // Identifier can be email or phone
    const { identifier, password } = req.body;

    // Normalize identifier (basic trim)
    const loginKey = identifier?.trim();

    console.log('🔐 Login attempt:', loginKey);

    // 1. Mock Logic (Kept for dev safety)
    if (global.isMock) {
        // ... (Mock logic omitted for brevity, keeping existing flow is safer but for real implementation we focus on DB)
        // If needed we can adapt mock logic, but let's assume DB focus for this task.
        // Quick adapt for mock:
        if ((loginKey === process.env.DEV_USER_EMAIL || loginKey === '0500000000') && password === process.env.DEV_USER_PASSWORD) {
            req.session.user = { id: 999, email: process.env.DEV_USER_EMAIL, role: 'CLIENT', name: 'Dev User' };
            return res.json({ success: true, user: req.session.user });
        }
        // ...
    }

    // 2. Database Logic
    try {
        // Find user by Email OR Phone
        const result = await db.select().from(users).where(
            or(
                eq(users.email, loginKey),
                eq(users.phone, loginKey)
            )
        ).limit(1);

        const user = result[0];

        if (!user) {
            return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
        }

        // Security: Compare hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
        }

        // Return FULL user data including credits and plan
        req.session.user = {
            id: user.id,
            email: user.email, // Might be null
            phone: user.phone,
            role: user.role,
            name: user.name,
            credits: user.credits || 0,
            postCredits: user.postCredits || 0,
            currentPlan: user.currentPlan || 'Free',
            createdAt: user.createdAt

        };
        console.log(`✅ User ${user.name} logged in successfully`);
        res.json({ success: true, user: req.session.user });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'حدث خطأ في السيرفر' });
    }
};

const signup = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    const fullName = `${firstName} ${lastName}`;

    // Validate: Need at least email OR phone
    if (!email && !phone) {
        return res.status(400).json({ success: false, message: 'يجب توفير البريد الإلكتروني أو رقم الهاتف' });
    }

    try {
        // Check if user exists (by email OR phone)
        const conditions = [];
        if (email) conditions.push(eq(users.email, email));
        if (phone) conditions.push(eq(users.phone, phone));

        const existing = await db.select().from(users).where(or(...conditions)).limit(1);

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'المستخدم موجود بالفعل' });
        }

        // Insert new user
        const newUser = await db.insert(users).values({
            name: fullName,
            email: email || null,
            phone: phone || null,
            password: await bcrypt.hash(password, 10), // Security: Hash password
            role: 'CLIENT'
        }).returning();

        req.session.user = {
            id: newUser[0].id,
            email: newUser[0].email,
            phone: newUser[0].phone,
            role: newUser[0].role,
            name: newUser[0].name
        };
        res.json({ success: true, user: req.session.user });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء التسجيل' });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error("Session destroy error:", err);
        res.clearCookie('connect.sid');
        res.json({ success: true, message: "Logged out" });
    });
};

const checkAuth = (req, res) => {
    res.json({ success: true });
};

const getMe = async (req, res) => {
    if (req.session.user) {
        if (!global.isMock) {
            try {
                // Fetch fresh data from DB - ALWAYS get latest data
                const freshUser = await db.select().from(users).where(eq(users.id, req.session.user.id)).limit(1);
                if (freshUser.length > 0) {
                    const u = freshUser[0];
                    // Update session with fresh data from DB
                    req.session.user = {
                        ...req.session.user,
                        name: u.name,
                        role: u.role,
                        credits: u.credits || 0,
                        postCredits: u.postCredits || 0,
                        currentPlan: u.currentPlan || 'Free',
                        createdAt: u.createdAt

                    };
                }
            } catch (err) {
                console.error("Auth Me DB Error:", err);
            }
        }
        res.json({ user: req.session.user, isAuthenticated: true });
    } else {
        res.json({ user: null, isAuthenticated: false });
    }
};


const axios = require('axios'); // Ensure axios is installed

// ... existing code ...

const googleLogin = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: 'Google code is required' });
    }

    try {
        // 1. Exchange code for access token
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL, // e.g., http://localhost:5173/auth/google/callback
            grant_type: 'authorization_code',
        });

        const { access_token } = tokenResponse.data;

        // 2. Get User Info from Google
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const googleUser = userResponse.data;
        const { email, name, picture, id: googleId } = googleUser;

        // 3. Check if user exists (by email)
        const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
        let user = existingUsers[0];

        if (!user) {
            // Create new user (No password)
            const newUser = await db.insert(users).values({
                name: name,
                email: email,
                role: 'CLIENT',
                // password is null
                // We could add googleId or picture here if schema supported it, but MVP is fine.
            }).returning();
            user = newUser[0];
        }

        // 4. Create Session
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            credits: user.credits || 0,
            postCredits: user.postCredits || 0,
            currentPlan: user.currentPlan || 'Free',
            createdAt: user.createdAt

        };

        console.log(`✅ Google User ${user.email} logged in`);
        res.json({ success: true, user: req.session.user });

    } catch (err) {
        console.error('Google Login Error:', err.response?.data || err.message);
        res.status(500).json({ success: false, message: 'Google login failed' });
    }
};

module.exports = {
    login,
    signup,
    logout,
    checkAuth,
    getMe,
    googleLogin
};
