'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Pencil, Camera, MapPin, Globe, Mail, User, Shield, Settings } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  location: string;
  education: string;
  skills: string[];
  website: string;
  verified: boolean;
  createdAt: string;
  posts: any[];
  settings: any;
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [params.username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${params.username}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        toast.error('Profile not found');
        router.push('/');
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setProfile(prev => prev ? { ...prev, image: url } : null);
        toast.success('Profile picture updated');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updated = await response.json();
        setProfile(prev => prev ? { ...prev, ...updated } : null);
        toast.success('Profile updated');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleBlockUser = async () => {
    try {
      const response = await fetch(`/api/users/${profile?.id}/block`, {
        method: 'POST',
      });
      if (response.ok) {
        toast.success('User blocked');
        router.push('/');
      }
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleReportUser = async (reason: string, description?: string) => {
    try {
      const response = await fetch(`/api/users/${profile?.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, description }),
      });
      if (response.ok) {
        toast.success('User reported');
      }
    } catch (error) {
      toast.error('Failed to report user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) return null;

  const isOwnProfile = session?.user?.email === profile.email;
  const canEdit = isOwnProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <User size={48} />
                  </div>
                )}
              </div>
              
              {canEdit && (
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                {profile.verified && (
                  <Shield className="w-6 h-6 text-blue-500" />
                )}
              </div>
              
              <p className="text-gray-600 mb-4">@{profile.username}</p>
              
              {profile.bio && (
                <p className="text-gray-700 mb-4 max-w-2xl">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-1">
                    <Globe size={16} />
                    <a href={profile.website} className="text-orange-600 hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{profile.email}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                {canEdit ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Follow
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <div className="space-y-3 text-sm">
                {profile.education && (
                  <div>
                    <span className="font-medium text-gray-700">Education:</span>
                    <p className="text-gray-600">{profile.education}</p>
                  </div>
                )}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Skills:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-semibold">{profile.posts?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-semibold">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
              {profile.posts && profile.posts.length > 0 ? (
                <div className="space-y-4">
                  {profile.posts.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="border-b pb-4 last:border-0">
                      <p className="text-gray-700">{post.content}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No posts yet
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Settings Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateProfile({
                    name: formData.get('name') as string,
                    bio: formData.get('bio') as string,
                    location: formData.get('location') as string,
                    education: formData.get('education') as string,
                    website: formData.get('website') as string,
                  });
                }}
                className="space-y-4"
              >
                <input
                  name="name"
                  type="text"
                  defaultValue={profile.name}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  name="bio"
                  defaultValue={profile.bio || ''}
                  placeholder="Bio"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  name="location"
                  type="text"
                  defaultValue={profile.location || ''}
                  placeholder="Location"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  name="education"
                  type="text"
                  defaultValue={profile.education || ''}
                  placeholder="Education"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  name="website"
                  type="url"
                  defaultValue={profile.website || ''}
                  placeholder="Website"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}