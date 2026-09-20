import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiDatabase, FiShield, FiTrash2, FiEdit2, FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function AdminPanelPage() {
  const { user, allUsers, updateUserRole, updateUser, deleteUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'data'

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('user');
  const [isSaving, setIsSaving] = useState(false);
  const [actionFeedback, setActionFeedback] = useState({ message: '', type: '' });

  // Delete User Confirmation State
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to get normalized User ID
  const getUserId = (u) => (u?._id || u?.id)?.toString();

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setEditName(u.name || '');
    setEditEmail(u.email || '');
    setEditRole(u.role || 'user');
    setActionFeedback({ message: '', type: '' });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const uid = getUserId(editingUser);
    if (!uid) return;

    setIsSaving(true);
    try {
      const res = await updateUser(uid, {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
      });

      if (res && res.success) {
        setActionFeedback({ message: 'User updated successfully!', type: 'success' });
        setTimeout(() => {
          setEditingUser(null);
          setActionFeedback({ message: '', type: '' });
        }, 1200);
      } else {
        setActionFeedback({ message: res?.error || 'Failed to update user', type: 'error' });
      }
    } catch (err) {
      setActionFeedback({ message: err.message || 'Error updating user', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    const uid = getUserId(deletingUser);
    if (!uid) return;

    setIsDeleting(true);
    try {
      const res = await deleteUser(uid);
      if (res && res.success) {
        setDeletingUser(null);
      } else {
        alert(res?.error || 'Failed to delete user');
      }
    } catch (err) {
      alert(err.message || 'Error deleting user');
    } finally {
      setIsDeleting(false);
    }
  };

  const currentUserId = getUserId(user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Admin Header */}
      <div className="bg-ocean-card border border-ocean-border rounded-2xl p-6 shadow-card-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading text-ocean-text">
            Admin Management Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage researcher access, edit user details, and control permission levels.
          </p>
        </div>
        <Badge variant="danger">
          Super Admin: {user?.email}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-ocean-border pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'users'
              ? 'border-ocean-primary text-ocean-primary'
              : 'border-transparent text-slate-500 hover:text-ocean-text'
          }`}
        >
          <FiUsers className="w-4 h-4" />
          User Management ({allUsers?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'data'
              ? 'border-ocean-primary text-ocean-primary'
              : 'border-transparent text-slate-500 hover:text-ocean-text'
          }`}
        >
          <FiDatabase className="w-4 h-4" />
          Data Override (Demo)
        </button>
      </div>

      {/* Tab Content: Users */}
      {activeTab === 'users' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-ocean-border pb-3">
            <h3 className="text-sm font-bold font-heading text-ocean-text">
              Registered Researchers & Staff ({allUsers?.length || 0})
            </h3>
            <span className="text-xs text-slate-400">
              Click edit to modify user credentials or permissions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ocean-bg text-slate-600 border-b border-ocean-border">
                  <th className="p-3 font-bold">Name</th>
                  <th className="p-3 font-bold">Email</th>
                  <th className="p-3 font-bold">Role</th>
                  <th className="p-3 font-bold">Joined</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-border/60">
                {allUsers && allUsers.length > 0 ? (
                  allUsers.map((u) => {
                    const uid = getUserId(u);
                    const isSelf = currentUserId && uid === currentUserId;
                    const isSuperAdmin = u.email === 'karuppuduraikece@gmail.com';

                    return (
                      <tr key={uid || u.email} className="hover:bg-ocean-bg/80 transition-colors">
                        <td className="p-3 font-semibold text-ocean-text flex items-center gap-2">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}`}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-ocean-border"
                          />
                          <span>{u.name || 'Anonymous User'}</span>
                          {isSelf && (
                            <span className="text-[10px] bg-ocean-primary/10 text-ocean-primary font-bold px-1.5 py-0.5 rounded">
                              YOU
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              u.role === 'admin'
                                ? 'danger'
                                : u.role === 'researcher'
                                ? 'info'
                                : u.role === 'coast_guard'
                                ? 'warning'
                                : 'default'
                            }
                          >
                            {(u.role || 'user').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-3 text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          {/* Edit User Button */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-slate-600 hover:text-ocean-primary hover:bg-ocean-primary/10 rounded-lg transition-colors"
                            title="Edit User Details"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>

                          {/* Quick Toggle Role (Only if not self) */}
                          {!isSelf && (
                            <button
                              onClick={() => updateUserRole(uid, u.role === 'admin' ? 'researcher' : 'admin')}
                              className="p-1.5 text-ocean-primary hover:bg-ocean-primary/10 rounded-lg transition-colors"
                              title={`Switch to ${u.role === 'admin' ? 'Researcher' : 'Admin'}`}
                            >
                              <FiShield className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Button (Disabled for self and primary super admin) */}
                          {!isSelf && !isSuperAdmin && (
                            <button
                              onClick={() => setDeletingUser(u)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      No registered researchers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab Content: Data */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-ocean-text border-b border-ocean-border pb-2">
              Inject Custom Alert
            </h3>
            <p className="text-xs text-slate-500">
              Manually trigger an emergency alert to the global dashboard.
            </p>
            <div className="space-y-3 pt-2">
              <input type="text" placeholder="Alert Title" className="w-full text-sm p-2 rounded-lg border border-ocean-border bg-ocean-bg" />
              <textarea placeholder="Alert Description..." rows={3} className="w-full text-sm p-2 rounded-lg border border-ocean-border bg-ocean-bg"></textarea>
              <Button className="w-full">Broadcast Alert</Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-ocean-text border-b border-ocean-border pb-2">
              Override Prediction Parameters
            </h3>
            <p className="text-xs text-slate-500">
              Force Deep Learning model to output specific Risk Values.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Force Cyclone Risk (%)</span>
                <input type="number" defaultValue={64} className="w-20 text-sm p-1.5 rounded-lg border border-ocean-border bg-ocean-bg text-center" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Force Peak Surge (m)</span>
                <input type="number" defaultValue={3.45} step={0.1} className="w-20 text-sm p-1.5 rounded-lg border border-ocean-border bg-ocean-bg text-center" />
              </div>
              <Button variant="outline" className="w-full mt-2">Apply Override</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-ocean-card border border-ocean-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-ocean-border pb-3">
                <div className="flex items-center gap-2">
                  <FiEdit2 className="w-5 h-5 text-ocean-primary" />
                  <h3 className="text-base font-bold text-ocean-text">Edit User Account</h3>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {actionFeedback.message && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    actionFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {actionFeedback.type === 'success' ? <FiCheck className="w-4 h-4" /> : <FiAlertTriangle className="w-4 h-4" />}
                  <span>{actionFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-ocean-text block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ocean-border bg-ocean-bg text-ocean-text text-sm focus:outline-none focus:border-ocean-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-ocean-text block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ocean-border bg-ocean-bg text-ocean-text text-sm focus:outline-none focus:border-ocean-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-ocean-text block">Assigned Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ocean-border bg-ocean-bg text-ocean-text text-sm focus:outline-none focus:border-ocean-primary"
                  >
                    <option value="admin">Admin (Full Control)</option>
                    <option value="researcher">Researcher (Telemetry & ML)</option>
                    <option value="coast_guard">Coast Guard (Emergency Advisories)</option>
                    <option value="user">Standard User</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-ocean-border">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-ocean-card border border-rose-200 dark:border-rose-900/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center mx-auto">
                <FiTrash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-ocean-text">Delete Researcher Account?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to delete <strong className="text-ocean-text">{deletingUser.name || deletingUser.email}</strong>? This action cannot be reversed.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  disabled={isDeleting}
                  className="w-1/2 py-2.5 rounded-xl border border-ocean-border text-xs font-semibold text-slate-600 hover:bg-ocean-bg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
