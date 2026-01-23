const { orchestrateContentGeneration } = require('../services/aiOrchestrator');
const { db } = require('../db');
const { users, projects } = require('../db/schema');
const { eq } = require('drizzle-orm');

const generate = async (req, res) => {
    try {
        const { inputType, rawData, prompt, region, outputMode = 'both', targetGender, targetAge } = req.body;
        const userId = req.session?.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
        }

        if (!['text', 'image'].includes(inputType)) {
            return res.status(400).json({ success: false, message: 'Invalid input type. Must be "text" or "image".' });
        }

        if (!rawData && !prompt) {
            return res.status(400).json({ success: false, message: 'No input data provided.' });
        }

        // 1. Check Credits
        const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const user = userResult[0];

        if (!user || user.credits < 1) {
            return res.status(403).json({ success: false, message: "عذراً، رصيدك غير كافي. يرجى تجديد الباقة." });
        }

        console.log(`🤖 AI Generation Request from User ${userId} (${inputType}) | Plan: ${user.currentPlan} | Region: ${region} | Mode: ${outputMode}`);

        // 2. Deduct Credits FIRST (Optimistic Locking / Prevent Race Condition)
        await db.update(users)
            .set({ credits: user.credits - 1 })
            .where(eq(users.id, userId));

        let result;
        try {
            // 3. Generate Content
            result = await orchestrateContentGeneration(userId, inputType, rawData, prompt, region, outputMode, targetGender, targetAge);

            // 4. Save to Projects (History)
            await db.insert(projects).values({
                userId,
                imageUrl: result.imageUrl || '',
                caption: result.caption || '',
                prompt: prompt || (inputType === 'text' ? rawData : 'Image generation'),
                platform: region || 'Modern',
                status: 'COMPLETED'
            });

        } catch (error) {
            console.error("Orchestration Failed, Refunding User:", error);
            // REFUND CREDITS
            await db.update(users)
                .set({ credits: user.credits }) // Restore original amount
                .where(eq(users.id, userId));

            throw error; // Re-throw to be caught by outer catch for response
        }

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "AI Generation Failed"
        });
    }
};

module.exports = { generate };
