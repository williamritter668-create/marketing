const { db } = require('../db');
const { subscriptions, users } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { createNotification } = require('./notificationController');

const createSubscription = async (req, res) => {
    console.log("📥 Subscription Request Received");
    if (!req.session.user) return res.status(401).json({ message: "Unauthorized" });

    const { plan, amount } = req.body;
    const file = req.file;

    if (!plan || !file) return res.status(400).json({ message: "Missing required fields (plan or receipt)" });

    const receiptUrl = file.path; // Cloudinary URL

    if (global.isMock) {
        const newSub = { id: Date.now().toString(), userId: req.session.user.id, userName: req.session.user.name, userEmail: req.session.user.email, plan, amount, receiptImage: receiptUrl, status: 'PENDING', date: new Date().toISOString() };
        if (!global.mockData.subscriptions) global.mockData.subscriptions = [];
        global.mockData.subscriptions.push(newSub);
        return res.json({ success: true, message: "Subscription request submitted", subscription: newSub });
    }

    try {
        const newSub = await db.insert(subscriptions).values({
            userId: req.session.user.id,
            plan,
            amount: parseInt(amount),
            receiptImage: receiptUrl,
            status: 'PENDING'
        }).returning();

        // NOTIFY ADMINS
        try {
            const admins = await db.select().from(users).where(eq(users.role, 'ADMIN'));
            for (const admin of admins) {
                await createNotification({
                    userId: admin.id,
                    type: 'INFO',
                    title: '📄 طلب اشتراك جديد',
                    message: `قام ${req.session.user.name} بإرسال طلب اشتراك في خطة ${plan}. يرجى المراجعة.`
                });
            }
        } catch (notifError) {
            console.error("Admin Notification Error:", notifError);
        }

        res.json({ success: true, message: "Subscription request submitted", subscription: newSub[0] });
    } catch (err) {
        console.error("Sub Error:", err);
        res.status(500).json({ message: "Failed to submit subscription" });
    }
};


const getMySubscriptions = async (req, res) => {
    if (global.isMock) {
        const userSubs = (global.mockData.subscriptions || []).filter(s => s.userId === req.session.user.id);
        return res.json({ success: true, subscriptions: userSubs });
    }

    try {
        const userSubs = await db.select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, req.session.user.id))
            .orderBy(desc(subscriptions.createdAt));

        res.json({ success: true, subscriptions: userSubs });
    } catch (err) {
        console.error("Get My Subs Error:", err);
        res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
};

const getAllSubscriptions = async (req, res) => {
    if (global.isMock) return res.json({ success: true, subscriptions: global.mockData.subscriptions || [] });

    try {
        const allSubs = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
        const subsWithUsers = await Promise.all(allSubs.map(async (sub) => {
            const userRes = await db.select().from(users).where(eq(users.id, sub.userId));
            const user = userRes[0] || { name: 'Unknown', email: 'Unknown' };
            return {
                ...sub,
                userName: user.name,
                userEmail: user.email,
                date: sub.createdAt
            };
        }));

        res.json({ success: true, subscriptions: subsWithUsers });
    } catch (err) {
        console.error("Get Subs Error:", err);
        res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
};



const updateSubscriptionStatus = async (req, res) => {
    const { id, action } = req.params;
    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';

    if (global.isMock) {
        const sub = global.mockData.subscriptions.find(s => s.id == id);
        if (sub) sub.status = newStatus;
        return res.json({ success: true, message: `Subscription ${newStatus}` });
    }

    try {
        const updated = await db.update(subscriptions)
            .set({ status: newStatus })
            .where(eq(subscriptions.id, parseInt(id)))
            .returning();

        if (updated.length === 0) return res.status(404).json({ message: "Subscription not found" });
        const sub = updated[0];

        // NOTIFICATION LOGIC
        if (newStatus === 'APPROVED') {
            await createNotification({
                userId: sub.userId,
                type: 'SUCCESS',
                title: '🎉 تم تفعيل اشتراكك',
                message: `مبروك! تم تفعيل خطة ${sub.plan} بنجاح. تم إضافة الرصيد إلى حسابك.`
            });

            // ... (Existing Credit Logic) ...
            let creditsToAdd = 0;
            let postCreditsToAdd = 0;
            let planName = 'Free';

            const amount = parseInt(sub.amount);
            const planStr = String(sub.plan || '').toLowerCase();
            const expiresAt = new Date();

            if (planStr.includes('مبتدئ') || planStr.includes('basic') || amount === 12) {
                creditsToAdd = 20;
                postCreditsToAdd = 30;
                planName = 'Basic';
                // 1 Month
                expiresAt.setMonth(expiresAt.getMonth() + 1);
            } else if (planStr.includes('تاجر') || planStr.includes('pro') || amount === 19) {
                creditsToAdd = 50;
                postCreditsToAdd = 60;
                planName = 'Pro';
                // 1 Month
                expiresAt.setMonth(expiresAt.getMonth() + 1);
            } else if (planStr.includes('شركات') || planStr.includes('elite') || amount === 49) {
                creditsToAdd = 120; // 120 images
                postCreditsToAdd = 130;  // 130 posts
                planName = 'Elite';
                // 3 Months
                expiresAt.setMonth(expiresAt.getMonth() + 3);
            } else {
                creditsToAdd = 20;
                postCreditsToAdd = 30;
                planName = 'Basic';
                expiresAt.setMonth(expiresAt.getMonth() + 1);
            }

            if (creditsToAdd > 0 || postCreditsToAdd > 0) {
                const userRes = await db.select().from(users).where(eq(users.id, sub.userId)).limit(1);
                if (userRes.length > 0) {
                    const currentUser = userRes[0];
                    const currentCredits = currentUser.credits ?? 0;
                    const currentPostCredits = currentUser.postCredits ?? 0;

                    await db.update(users)
                        .set({
                            credits: currentCredits + creditsToAdd,
                            postCredits: currentPostCredits + postCreditsToAdd,
                            currentPlan: planName,
                            planExpiresAt: expiresAt
                        })
                        .where(eq(users.id, sub.userId));
                }
            }
        } else if (newStatus === 'REJECTED') {
            await createNotification({
                userId: sub.userId,
                type: 'WARNING',
                title: '❌ رفض طلب الاشتراك',
                message: `عذراً، تم رفض طلب الاشتراك في خطة ${sub.plan}. يرجى التحقق من الإيصال والمحاولة مرة أخرى.`
            });
        }

        res.json({ success: true, message: `Subscription ${newStatus}`, subscription: updated[0] });
    } catch (err) {
        console.error("Update Sub Error:", err);
        res.status(500).json({ message: "Failed to update subscription" });
    }
};


module.exports = {
    createSubscription,
    getMySubscriptions,
    getAllSubscriptions,
    updateSubscriptionStatus
};
