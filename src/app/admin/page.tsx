'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Users, FileText, AlertTriangle, Settings, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalReports: number;
  totalViews: number;
  activeUsers: number;
  newUsersToday: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  verified: boolean;
  isAdmin: boolean;
  createdAt: string;
  postsCount: number;
  reportsCount: number;
}

interface Post {
  id: string;
  content: string;
  author: any;
  likesCount: number;
  createdAt: string;
  isFlagged: boolean;
}

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  order: number;
  isActive: boolean;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const handleLogin = async () => {
    if (password === 'Damintelligensia2025') {
      setAuthenticated(true);
      fetchData();
    } else {
      toast.error('Invalid password');
    }
  };

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, postsRes, carouselRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/posts'),
        fetch('/api/admin/carousel'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (postsRes.ok) setPosts(await postsRes.json());
      if (carouselRes.ok) setCarouselItems(await carouselRes.json());
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST',
      });
      if (response.ok) {
        toast.success('User verified');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'POST',
      });
      if (response.ok) {
        toast.success('User blocked');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Post deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleCarouselUpdate = async (item: CarouselItem) => {
    try {
      const response = await fetch(`/api/admin/carousel/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        toast.success('Carousel updated');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update carousel');
    }
  };

  const handleAddCarouselItem = async (item: Omit<CarouselItem, 'id'>) => {
    try {
      const response = await fetch('/api/admin/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        toast.success('Carousel item added');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to add carousel item');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter admin password to continue</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Command Center for Intelligensia</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Exit Admin
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['overview', 'users', 'posts', 'carousel', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users },
              { title: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText },
              { title: 'Active Reports', value: stats?.totalReports || 0, icon: AlertTriangle },
              { title: 'Total Views', value: stats?.totalViews || 0, icon: Eye },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-orange-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Users Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Posts</th>
                    <th className="text-left py-2">Reports</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">@{user.username}</p>
                        </div>
                      </td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{user.postsCount}</td>
                      <td className="py-2">{user.reportsCount}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          {!user.verified && (
                            <button
                              onClick={() => handleVerifyUser(user.id)}
                              className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                            >
                              Verify
                            </button>
                          )}
                          {!user.isAdmin && (
                            <button
                              onClick={() => handleBlockUser(user.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                            >
                              Block
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Posts Management</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    by {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mb-2">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{post.likesCount} likes</span>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Carousel Tab */}
        {activeTab === 'carousel' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Carousel Management</h2>
            <div className="space-y-4">
              {carouselItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="mt-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={item.isActive}
                            onChange={(e) => handleCarouselUpdate({ ...item, isActive: e.target.checked })}
                            className="mr-2"
                          />
                          Active
                        </label>
                      </div>
                    </div>
                    <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}