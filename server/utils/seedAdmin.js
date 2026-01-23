const { db } = require('../db');
const { users } = require('../db/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.log('ℹ️ No ADMIN_EMAIL or ADMIN_PASSWORD in .env, skipping admin seed.');
        return;
    }

    try {
        if (global.isMock) return; // Don't seed DB in mock mode

        const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

        if (existingAdmin.length === 0) {
            console.log('⚙️ Seeding Admin User from .env...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await db.insert(users).values({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                credits: 999999,
                postCredits: 999999,
                currentPlan: 'Elite'
            });
            console.log('✅ Admin User created successfully.');
        } else {
            // Optional: Update admin password if env changed? 
            // For now, let's assume if exists, we are good. secure.
            // But if we want to enforce the env password, we could update it here.
            // Let's just log existence.
            // console.log('✅ Admin User already exists in DB.');
        }
    } catch (error) {
        console.error('❌ Failed to seed admin:', error);
    }
};

module.exports = seedAdmin;
