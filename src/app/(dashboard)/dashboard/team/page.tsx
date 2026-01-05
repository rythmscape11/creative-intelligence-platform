'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserGroupIcon,
  ArrowLeftIcon,
  PlusIcon,
  EnvelopeIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useToolAccess } from '@/hooks/use-tool-access';

interface TeamMember {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  status: 'PENDING' | 'ACTIVE';
  addedAt: string;
}

export default function TeamPage() {
  const { userPlan, isAdmin, isLoading: accessLoading } = useToolAccess();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'EDITOR' | 'VIEWER'>('VIEWER');
  const [inviting, setInviting] = useState(false);

  // Check if user has team feature (Agency+ plans)
  const hasTeamAccess = userPlan === 'AGENCY' || userPlan === 'ENTERPRISE' || isAdmin;
  const teamLimit = userPlan === 'ENTERPRISE' ? -1 : userPlan === 'AGENCY' ? 10 : 1;

  useEffect(() => {
    async function fetchTeam() {
      if (!hasTeamAccess) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/team');
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.members || []);
        }
      } catch (error) {
        console.error('Failed to fetch team:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!accessLoading) {
      fetchTeam();
    }
  }, [hasTeamAccess, accessLoading]);

  const handleInvite = async () => {
    if (!inviteEmail) return;

    setInviting(true);
    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });

      if (response.ok) {
        const newMember = await response.json();
        setTeamMembers([...teamMembers, newMember.member]);
        setShowInviteModal(false);
        setInviteEmail('');
      }
    } catch (error) {
      console.error('Failed to invite:', error);
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await fetch(`/api/team/${memberId}`, { method: 'DELETE' });
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-500/20 text-purple-400';
      case 'EDITOR': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (accessLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Upgrade prompt for non-agency users
  if (!hasTeamAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-bg-secondary border border-border-primary rounded-lg p-8 text-center">
          <div className="w-20 h-20 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserGroupIcon className="h-10 w-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">Team Management</h1>
          <p className="text-lg text-text-secondary mb-6">
            Collaborate with your team on marketing strategies
          </p>

          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Team Features Include:</h2>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                <span>Up to 10 team members (Agency plan)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                <span>Role-based access control</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                <span>Share strategies across team</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                <span>Activity logs and audit trails</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-border-primary bg-bg-tertiary rounded-md text-text-primary hover:bg-bg-hover transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 inline mr-2" />
              Back
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              Upgrade to Agency
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="p-2 rounded-lg hover:bg-bg-secondary transition-colors">
                <ArrowLeftIcon className="h-5 w-5 text-text-secondary" />
              </Link>
              <h1 className="text-3xl font-bold text-text-primary">Team Management</h1>
            </div>
            <p className="text-text-secondary ml-10">
              {teamLimit === -1
                ? 'Unlimited team members (Enterprise)'
                : `${teamMembers.length} of ${teamLimit} seats used`}
            </p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            disabled={teamLimit !== -1 && teamMembers.length >= teamLimit}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-5 w-5" />
            Invite Member
          </button>
        </div>

        {/* Team Members List */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
          {teamMembers.length > 0 ? (
            <div className="divide-y divide-border-primary">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-bg-tertiary">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-primary">
                          {member.name || member.email}
                        </p>
                        {member.status === 'PENDING' && (
                          <span className="flex items-center gap-1 text-xs text-amber-400">
                            <ClockIcon className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {member.status === 'ACTIVE' && (
                          <CheckCircleIcon className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                    {member.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <UserGroupIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No team members yet</h3>
              <p className="text-text-secondary mb-4">Invite your first team member to start collaborating</p>
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Invite Member
              </button>
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-text-primary mb-4">Invite Team Member</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="w-full pl-10 pr-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Role
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setInviteRole('EDITOR')}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${inviteRole === 'EDITOR'
                        ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                        : 'border-border-primary text-text-secondary hover:bg-bg-tertiary'
                        }`}
                    >
                      <ShieldCheckIcon className="h-5 w-5 mx-auto mb-1" />
                      Editor
                    </button>
                    <button
                      onClick={() => setInviteRole('VIEWER')}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${inviteRole === 'VIEWER'
                        ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                        : 'border-border-primary text-text-secondary hover:bg-bg-tertiary'
                        }`}
                    >
                      <UserCircleIcon className="h-5 w-5 mx-auto mb-1" />
                      Viewer
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-border-primary text-text-secondary rounded-lg hover:bg-bg-tertiary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail || inviting}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
