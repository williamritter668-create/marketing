const { db } = require('../db');
const { projects, users } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

const generateProject = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: "Unauthorized" });

    // --- STRICT CREDIT CHECK ---
    if (!req.session.user.credits || req.session.user.credits < 1) {
        console.warn(`⛔ Blocked generation for user ${req.session.user.id}: Insufficient credits (${req.session.user.credits})`);
        return res.status(403).json({
            success: false,
            message: "Insufficient credits. Please upgrade your plan to continue."
        });
    }

    const { platform, prompt } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "Image is required" });

    const imageUrl = file.path;

    try {
        if (global.isMock) {
            const newProject = {
                id: Date.now(),
                userId: req.session.user.id,
                imageUrl,
                platform,
                prompt,
                status: 'COMPLETED',
                createdAt: new Date()
            };
            if (!global.mockData.projects) global.mockData.projects = [];
            global.mockData.projects.push(newProject);
            if (req.session.user.credits > 0) req.session.user.credits -= 1;
            return res.json({ success: true, project: newProject, remainingCredits: req.session.user.credits });
        }

        // DB Insert
        const newProject = await db.insert(projects).values({
            userId: req.session.user.id,
            imageUrl: imageUrl,
            platform: platform || 'facebook',
            prompt: prompt || '',
            status: 'COMPLETED'
        }).returning();

        // --- DEDUCT CREDIT ---
        await db.update(users)
            .set({ credits: (req.session.user.credits - 1) })
            .where(eq(users.id, req.session.user.id));

        // Update Session
        req.session.user.credits -= 1;

        res.json({ success: true, project: newProject[0], remainingCredits: req.session.user.credits });

    } catch (err) {
        console.error("❌ Generation/Upload Error:", err);
        res.status(500).json({ message: "Generation failed", error: err.message });
    }
};

const getUserProjects = async (req, res) => {
    if (global.isMock) {
        const userProjects = (global.mockData.projects || []).filter(p => p.userId === req.session.user.id);
        return res.json({ success: true, projects: userProjects });
    }

    try {
        const userProjects = await db.select().from(projects)
            .where(eq(projects.userId, req.session.user.id))
            .orderBy(desc(projects.createdAt));

        res.json({ success: true, projects: userProjects });
    } catch (err) {
        console.error("Get Projects Error:", err);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
};

module.exports = {
    generateProject,
    getUserProjects
};
