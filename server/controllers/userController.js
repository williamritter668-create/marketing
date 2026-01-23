const { db } = require('../db');
const { users } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    const { name, email, password, role, credits } = req.body;

    if (global.isMock) {
        const newUser = {
            id: Date.now(),
            name,
            email,
            role: role || 'CLIENT',
            credits: credits || 0,
            password: password
        };
        global.mockData.users.push(newUser);
        return res.json({ success: true, user: newUser });
    }

    try {
        // Check if user exists
        const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'المستخدم موجود بالفعل' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const newUser = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role: role || 'CLIENT',
            credits: parseInt(credits) || 0,
            currentPlan: 'Free'
        }).returning();

        res.json({ success: true, user: newUser[0] });
    } catch (err) {
        console.error("Create User Error:", err);
        res.status(500).json({ success: false, message: "تعذر إنشاء المستخدم" });
    }
};

const getAllUsers = async (req, res) => {
    if (global.isMock) {
        return res.json({ success: true, users: global.mockData.users || [] });
    }

    try {
        const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
        res.json({ success: true, users: allUsers });
    } catch (err) {
        console.error("Get Users Error:", err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

const addUserCredits = async (req, res) => {
    const { id } = req.params;
    const { credits } = req.body;

    if (global.isMock) {
        const user = global.mockData.users.find(u => u.id == id);
        if (user) user.credits = (user.credits || 0) + parseInt(credits);
        return res.json({ success: true, message: "Credits added" });
    }

    try {
        const currentUser = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
        if (currentUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const newCredits = (currentUser[0].credits || 0) + parseInt(credits);
        await db.update(users)
            .set({ credits: newCredits })
            .where(eq(users.id, parseInt(id)));

        res.json({ success: true, message: "Credits added", newCredits });
    } catch (err) {
        console.error("Update Credits Error:", err);
        res.status(500).json({ message: "Failed to update credits" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (global.isMock) {
        const index = global.mockData.users.findIndex(u => u.id == id);
        if (index !== -1) {
            global.mockData.users.splice(index, 1);
            return res.json({ success: true, message: "User deleted successfully" });
        }
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const userId = parseInt(id);

        // Import the other tables we need
        const { subscriptions, projects, notifications } = require('../db/schema');

        // Delete related records first (to avoid foreign key constraint violations)
        // 1. Delete subscriptions
        await db.delete(subscriptions).where(eq(subscriptions.userId, userId));

        // 2. Delete projects
        await db.delete(projects).where(eq(projects.userId, userId));

        // 3. Delete notifications
        await db.delete(notifications).where(eq(notifications.userId, userId));

        // 4. Finally, delete the user
        await db.delete(users).where(eq(users.id, userId));

        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete User Error:", err);
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
};

module.exports = {
    getAllUsers,
    addUserCredits,
    createUser,
    deleteUser
};
