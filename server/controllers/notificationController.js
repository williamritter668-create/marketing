const { db } = require('../db');
const { notifications, users } = require('../db/schema');
const { eq, desc, and } = require('drizzle-orm');

// Get all notifications for the current user
const getNotifications = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const userNotifications = await db.select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt));

        res.json({ success: true, notifications: userNotifications });
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Mark as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.session.user.id; // Security check

        await db.update(notifications)
            .set({ isRead: true })
            .where(and(
                eq(notifications.id, id),
                eq(notifications.userId, userId)
            ));

        res.json({ success: true });
    } catch (error) {
        console.error('Mark Read Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Mark ALL as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.session.user.id;

        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.userId, userId));

        res.json({ success: true });
    } catch (error) {
        console.error('Mark All Read Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Helper: Create Notification (Internal Use)
const createNotification = async ({ userId, type, title, message }) => {
    try {
        await db.insert(notifications).values({
            userId,
            type,
            title,
            message
        });
        return true;
    } catch (error) {
        console.error('Create Notification Error:', error);
        return false;
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
};
