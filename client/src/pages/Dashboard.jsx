import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import { Sidebar, MobileNav } from '../components/layout';

// Dashboard Components
import { StudioTab, HistoryTab, PricingTab, SubscriptionModal, ProfileTab } from '../components/dashboard';

// Common Components
import { LoadingSpinner } from '../components/common';

// Hooks
import { useProjects, useUserQuery, useInvalidateUser } from '../hooks';

/**
 * Dashboard - Main user dashboard page
 * Clean architecture using extracted components
 */
const Dashboard = () => {
    const { auth } = useAuth(); // We still use auth for initial layout/redirect logic if needed
    const [activeTab, setActiveTab] = useState('studio');

    // React Query for Real-time User Data (Credits, Plan)
    const { data: userData, isLoading: isUserLoading } = useUserQuery();
    const invalidateUser = useInvalidateUser();

    // Use the fresh data from React Query if available, otherwise fall back to Auth Context
    const user = userData || auth?.user;

    // Subscription Modal State
    const [subModalOpen, setSubModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Projects Hook
    const { projects, fetchProjects } = useProjects();

    // Handlers
    const handleSelectPlan = (planName, amount) => {
        setSelectedPlan({ name: planName, amount });
        setSubModalOpen(true);
    };

    const handleCloseSubModal = () => {
        setSubModalOpen(false);
        setSelectedPlan(null);
    };

    const handleProjectCreated = () => {
        fetchProjects(); // Refresh projects list
        invalidateUser(); // Refresh user credits immediately
    };

    // Loading state
    const loading = auth?.loading || isUserLoading;
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <LoadingSpinner size="md" text="جاري تحميل بياناتك..." />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden p-4 md:p-6 gap-6 bg-[#f1f5f9] font-sans" dir="rtl">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Desktop Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Mobile Bottom Navigation */}
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Workspace */}
            <main className="flex-grow flex flex-col gap-6 overflow-hidden md:pb-0 pb-20">
                {activeTab === 'studio' && (
                    <StudioTab
                        user={user}
                        onProjectCreated={handleProjectCreated}
                        onSubscribeClick={() => setActiveTab('pricing')}
                    />
                )}

                {activeTab === 'history' && (
                    <HistoryTab projects={projects} />
                )}

                {activeTab === 'pricing' && (
                    <PricingTab
                        onSelectPlan={handleSelectPlan}
                        currentPlan={user?.currentPlan}
                    />
                )}

                {activeTab === 'profile' && (
                    <ProfileTab
                        user={user}
                        onSubscribeClick={() => setActiveTab('pricing')}
                    />
                )}


            </main>

            {/* Subscription Modal */}
            <SubscriptionModal
                isOpen={subModalOpen}
                onClose={handleCloseSubModal}
                selectedPlan={selectedPlan}
            />
        </div>
    );
};

export default Dashboard;
