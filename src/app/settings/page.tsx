'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, Bell, Lock, User, Shield, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface UserSettings {
  isPrivate: boolean;
  allowComments: boolean;
  allowMessages: boolean;
  showEmail: boolean;
  showLocation: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: string;
  language: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    isPrivate: false,
    allowComments: true,
    allowMessages: true,
    showEmail: false,
    showLocation: true,
    emailNotifications: true,
    pushNotifications: true,
    theme: 'light',
    language: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchSettings();
  }, [session]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      showNotification('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        showNotification('success', 'Settings saved');
      }
    } catch (error) {
      showNotification('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const settingGroups = [
    {
      title: 'Privacy',
      icon: Shield,
      settings: [
        { key: 'isPrivate', label: 'Private Account', description: 'Only approved followers can see your content' },
        { key: 'allowComments', label: 'Allow Comments', description: 'Allow others to comment on your posts' },
        { key: 'allowMessages', label: 'Allow Messages', description: 'Allow direct messages from other users' },
        { key: 'showEmail', label: 'Show Email', description: 'Display your email on your profile' },
        { key: 'showLocation', label: 'Show Location', description: 'Display your location on your profile' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email notifications' },
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications' },
      ],
    },
    {
      title: 'Appearance',
      icon: Settings,
      settings: [
        { key: 'theme', label: 'Theme', description: 'Choose your preferred theme' },
        { key: 'language', label: 'Language', description: 'Select your language preference' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          <div className="space-y-8">
            {settingGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="border rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <group.icon className="w-6 h-6 text-orange-500" />
                  <h2 className="text-xl font-semibold">{group.title}</h2>
                </div>

                <div className="space-y-4">
                  {group.settings.map((setting) => (
                    <div key={setting.key} className="flex items-start justify-between">
                      <div>
                        <label className="font-medium">{setting.label}</label>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      
                      {setting.key === 'theme' || setting.key === 'language' ? (
                        <select
                          value={settings[setting.key as keyof UserSettings] as string}
                          onChange={(e) =>
                            setSettings({ ...settings, [setting.key]: e.target.value })
                          }
                          className="px-3 py-1 border rounded"
                        >
                          {setting.key === 'theme' ? (
                            <>
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="system">System</option>
                            </>
                          ) : (
                            <>
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[setting.key as keyof UserSettings] as boolean}
                            onChange={(e) =>
                              setSettings({ ...settings, [setting.key]: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}