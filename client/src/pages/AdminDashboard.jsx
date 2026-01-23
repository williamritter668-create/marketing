import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

// Layout Components
import { AdminSidebar, AdminMobileNav } from '../components/layout';

// Admin Components
import { UsersTab, BillingTab, CreditModal, ReceiptModal, ConfirmModal, AddUserModal } from '../components/admin';

// Hooks
import { useUsers, useSubscriptions } from '../hooks';

/**
 * AdminDashboard - Admin control panel
 * Clean architecture using extracted components with full mobile responsiveness
 */
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    // Modal States
    const [creditModalOpen, setCreditModalOpen] = useState(false);
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);

    // Selected Items
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [pendingAction, setPendingAction] = useState(null);

    // Hooks
    const { users, fetchUsers, createUser, deleteUser } = useUsers();
    const { subscriptions, isLoading, fetchSubscriptions, handleAction } = useSubscriptions();

    // Fetch data when tab changes
    useEffect(() => {
        if (activeTab === 'billing') {
            fetchSubscriptions();
        }
    }, [activeTab, fetchSubscriptions]);

    // Handlers - Add User Modal
    const handleOpenAddUserModal = () => setAddUserModalOpen(true);
    const handleCloseAddUserModal = () => setAddUserModalOpen(false);
    const handleAddUserSuccess = () => fetchUsers();

    // Handlers - Credit Modal
    const handleOpenCreditModal = (user) => {
        setSelectedUser(user);
        setCreditModalOpen(true);
    };

    const handleCloseCreditModal = () => {
        setCreditModalOpen(false);
        setSelectedUser(null);
    };

    const handleCreditSuccess = () => {
        fetchUsers();
    };

    // Handlers - Receipt Modal
    const handleOpenReceiptModal = (receiptUrl) => {
        setSelectedReceipt(receiptUrl);
        setReceiptModalOpen(true);
    };

    const handleCloseReceiptModal = () => {
        setReceiptModalOpen(false);
        setSelectedReceipt(null);
    };

    // Handlers - Confirm Modal
    const handleInitiateAction = (id, action) => {
        setPendingAction({ id, action });
        setConfirmModalOpen(true);
    };

    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false);
        setPendingAction(null);
    };

    // Handlers - Delete User
    const handleOpenDeleteUserModal = (user) => {
        setPendingAction({ id: user.id, action: 'delete_user' });
        setConfirmModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (pendingAction) {
            if (pendingAction.action === 'delete_user') {
                const result = await deleteUser(pendingAction.id);
                if (result.success) {
                    toast.success("تم حذف المستخدم بنجاح");
                    fetchUsers();
                } else {
                    toast.error(result.message || "فشل حذف المستخدم");
                }
            } else {
                const result = await handleAction(pendingAction.id, pendingAction.action);
                if (result.success) {
                    toast.success(`تم ${pendingAction.action === 'approve' ? 'الموافقة على' : 'رفض'} الطلب بنجاح`);
                    // Refresh users list to show updated credits/plan immediately
                    fetchUsers();
                } else {
                    toast.error("حدث خطأ أثناء تنفيذ الإجراء");
                }
            }
            handleCloseConfirmModal();
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans" dir="rtl">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Desktop Sidebar */}
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Mobile Bottom Navigation */}
            <AdminMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar relative pb-24 md:pb-8">
                {activeTab === 'users' && (
                    <UsersTab
                        users={users}
                        onAddCredits={handleOpenCreditModal}
                        onAddUser={handleOpenAddUserModal}
                        onDeleteUser={handleOpenDeleteUserModal}
                    />
                )}

                {activeTab === 'billing' && (
                    <BillingTab
                        subscriptions={subscriptions}
                        isLoading={isLoading}
                        onViewReceipt={handleOpenReceiptModal}
                        onAction={handleInitiateAction}
                    />
                )}
            </main>

            {/* Modals */}
            <CreditModal
                isOpen={creditModalOpen}
                onClose={handleCloseCreditModal}
                user={selectedUser}
                onSuccess={handleCreditSuccess}
            />

            <ReceiptModal
                isOpen={receiptModalOpen}
                onClose={handleCloseReceiptModal}
                receiptUrl={selectedReceipt}
            />

            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={handleCloseConfirmModal}
                onConfirm={handleConfirmAction}
                action={pendingAction?.action}
            />

            <AddUserModal
                isOpen={addUserModalOpen}
                onClose={handleCloseAddUserModal}
                onCreateUser={createUser}
                onSuccess={handleAddUserSuccess}
            />
        </div>
    );
};

export default AdminDashboard;
