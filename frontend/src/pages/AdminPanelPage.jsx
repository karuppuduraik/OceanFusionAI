import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiDatabase, FiShield, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function AdminPanelPage() {
  const { user, allUsers, updateUserRole, deleteUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'data'

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
            Manage researcher access, user roles, and override prediction data.
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
          User Management
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
              Registered Researchers ({allUsers.length})
            </h3>
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
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-ocean-bg transition-colors">
                    <td className="p-3 font-semibold text-ocean-text">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <Badge variant={u.role === 'admin' ? 'danger' : 'info'}>
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {u.id !== user.id && (
                        <>
                          <button
                            onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                            className="p-1.5 text-ocean-primary hover:bg-ocean-primary/10 rounded-lg transition-colors"
                            title="Toggle Role"
                          >
                            <FiShield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-1.5 text-ocean-danger hover:bg-ocean-danger/10 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
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
    </motion.div>
  );
}
