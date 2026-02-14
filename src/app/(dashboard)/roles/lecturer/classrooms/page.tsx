"use client";

/* eslint-disable */

import { useState } from "react";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import { 
  Book, 
  Search, 
  Plus, 
  Users, 
  ArrowRight, 
  Play,
  Copy,
  Trash2,
  Edit,
  Settings,
  FileText,
  Calendar,
  X,
  Check,
  ExternalLink
} from "lucide-react";

// Mock classroom data for lecturer
const MOCK_CLASSROOMS = [
  {
    id: "class_1",
    name: "Advanced Quantum Computing",
    description: "Mastering quantum algorithms and their practical applications",
    field: { name: "Physics" },
    joinCode: "QC2024",
    memberCount: 156,
    assignmentCount: 8,
    resourceCount: 24,
    isEnrolled: true,
    userRole: "ADMIN",
    createdAt: "2024-01-15"
  },
  {
    id: "class_2",
    name: "Advanced Data Structures",
    description: "Graph theory, B-Trees, and complex algorithmic structures",
    field: { name: "Computer Science" },
    joinCode: "DS2024",
    memberCount: 234,
    assignmentCount: 12,
    resourceCount: 45,
    isEnrolled: true,
    userRole: "ADMIN",
    createdAt: "2024-02-01"
  },
  {
    id: "class_3",
    name: "Neural Network Architectures",
    description: "Deep learning, transformers, and NLP applications",
    field: { name: "Computer Science" },
    joinCode: "NN2024",
    memberCount: 189,
    assignmentCount: 6,
    resourceCount: 18,
    isEnrolled: true,
    userRole: "ADMIN",
    createdAt: "2024-03-10"
  }
];

// Fields for the dropdown
const FIELDS = [
  { id: "cs", name: "Computer Science" },
  { id: "physics", name: "Physics" },
  { id: "math", name: "Mathematics" },
  { id: "chem", name: "Chemistry" },
  { id: "bio", name: "Biology" },
  { id: "eng", name: "Engineering" }
];

export default function LecturerClassrooms() {
  const { user } = useSession();
  const [classrooms, setClassrooms] = useState(MOCK_CLASSROOMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState<string | null>(null);
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    fieldId: ""
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter classrooms based on search
  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.field?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClass = () => {
    if (newClass.name.trim()) {
      const joinCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newClassroom = {
        id: `class_${Date.now()}`,
        ...newClass,
        field: FIELDS.find(f => f.id === newClass.fieldId) || { name: "General" },
        joinCode,
        memberCount: 0,
        assignmentCount: 0,
        resourceCount: 0,
        isEnrolled: true,
        userRole: "ADMIN",
        createdAt: new Date().toISOString().split('T')[0]
      };
      setClassrooms([newClassroom, ...classrooms]);
      setNewClass({ name: "", description: "", fieldId: "" });
      setShowCreateDialog(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteClass = (id: string) => {
    if (confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      setClassrooms(classrooms.filter(c => c.id !== id));
      setShowSettingsDialog(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Header Section */}
        <div className="pt-8 pb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Classrooms</h1>
          <p className="text-white/60">Manage your classes and students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-4">
            <p className="text-white/60 text-sm">Total Classes</p>
            <p className="text-2xl font-bold text-white">{classrooms.length}</p>
          </div>
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-4">
            <p className="text-white/60 text-sm">Total Students</p>
            <p className="text-2xl font-bold text-white">
              {classrooms.reduce((sum, c) => sum + c.memberCount, 0)}
            </p>
          </div>
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-4">
            <p className="text-white/60 text-sm">Total Assignments</p>
            <p className="text-2xl font-bold text-white">
              {classrooms.reduce((sum, c) => sum + c.assignmentCount, 0)}
            </p>
          </div>
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-4">
            <p className="text-white/60 text-sm">Total Resources</p>
            <p className="text-2xl font-bold text-white">
              {classrooms.reduce((sum, c) => sum + c.resourceCount, 0)}
            </p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your classes..."
              className="w-full bg-[#121212] border border-[#262626] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary text-white placeholder-white/40"
            />
          </div>

          <button 
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold py-2.5 px-5 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Class
          </button>
        </div>

        {/* Classes Grid */}
        {filteredClassrooms.length === 0 ? (
          <div className="text-center py-16 bg-[#121212] rounded-xl border border-[#262626]">
            <Book className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-2">No classes yet</p>
            <p className="text-white/40 text-sm mb-6">Create your first class to get started</p>
            <button 
              onClick={() => setShowCreateDialog(true)}
              className="text-primary font-bold hover:underline inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create a class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => (
              <div 
                key={classroom.id}
                className="bg-[#121212] border border-[#262626] rounded-xl p-5 hover:border-primary/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Book className="text-primary w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setShowSettingsDialog(classroom.id)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg mb-1">{classroom.name}</h3>
                <p className="text-white/40 text-xs mb-4 line-clamp-2">{classroom.description}</p>

                {/* Join Code */}
                <div className="bg-black/30 rounded-lg p-3 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Join Code</p>
                    <p className="text-white font-mono font-bold text-sm">{classroom.joinCode}</p>
                  </div>
                  <button 
                    onClick={() => handleCopyCode(classroom.joinCode)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {copiedCode === classroom.joinCode ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/40" />
                    )}
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-white/60 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {classroom.memberCount} students
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {classroom.assignmentCount} assignments
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-black rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1">
                    Manage
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="py-2 px-4 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg text-sm font-bold transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Class Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create New Class</h3>
              <button 
                onClick={() => setShowCreateDialog(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Class Name *</label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="e.g., Advanced Quantum Computing"
                  className="w-full bg-white/5 border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-2 block">Description</label>
                <textarea
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                  placeholder="What will students learn in this class?"
                  rows={3}
                  className="w-full bg-white/5 border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-2 block">Field/Subject</label>
                <select
                  value={newClass.fieldId}
                  onChange={(e) => setNewClass({ ...newClass, fieldId: e.target.value })}
                  className="w-full bg-white/5 border border-[#262626] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a field</option>
                  {FIELDS.map(field => (
                    <option key={field.id} value={field.id}>{field.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 py-3 border border-white/10 text-white/60 rounded-xl font-bold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateClass}
                  disabled={!newClass.name.trim()}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-black rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Create Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Class Settings Dialog */}
      {showSettingsDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          {(() => {
            const classroom = classrooms.find(c => c.id === showSettingsDialog);
            if (!classroom) return null;
            
            return (
              <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Class Settings</h3>
                  <button 
                    onClick={() => setShowSettingsDialog(null)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-xs text-white/40 mb-1">Class Name</p>
                    <p className="text-white font-bold">{classroom.name}</p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-xs text-white/40 mb-1">Join Code</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-mono font-bold">{classroom.joinCode}</p>
                      <button 
                        onClick={() => handleCopyCode(classroom.joinCode)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {copiedCode === classroom.joinCode ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-white/40" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-xs text-white/40 mb-1">Members</p>
                    <p className="text-white font-bold">{classroom.memberCount} students</p>
                  </div>

                  <div className="pt-4 border-t border-[#262626]">
                    <button className="w-full py-3 flex items-center justify-center gap-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-colors mb-2">
                      <Edit className="w-4 h-4" />
                      Edit Class Details
                    </button>
                    <button 
                      onClick={() => handleDeleteClass(classroom.id)}
                      className="w-full py-3 flex items-center justify-center gap-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-bold transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Class
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
