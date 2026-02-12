"use client";

import { User } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  ChatBubbleIcon,
  SearchIcon,
  PersonIcon,
  SettingsIcon,
  LogoutIcon,
  UploadIcon,
  GroupAddIcon,
  FavoriteIcon,
  BoltIcon,
  ShareIcon
} from "/@radix-ui/react-icons";

interface DashboardLayoutProps {
  user: User;
  performance: unknown;
  fields: unknown[];
}

export default function DashboardLayout({ user }: DashboardLayoutProps) {

  return (
    <div className="flex h-screen overflow-hidden bg-background-light text-slate-900 antialiased">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200">
        <div className="p-6 flex flex-col h-full justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <span className="material-symbols-outlined text-2xl">auto_stories</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-slate-900 text-lg font-bold leading-tight">Intelligentsia</h1>
                <p className="text-slate-400 text-xs font-normal">Student Portal</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-md shadow-orange-100">
                <span className="material-symbols-outlined">dashboard</span>
                <p className="text-sm font-semibold">Dashboard</p>
              </Link>
              <Link href="/classroom" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-primary rounded-lg transition-all">
                <span className="material-symbols-outlined">school</span>
                <p className="text-sm font-medium">My Classroom</p>
              </Link>
              <Link href="/scholarships" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-primary rounded-lg transition-all">
                <span className="material-symbols-outlined">payments</span>
                <p className="text-sm font-medium">Scholarships</p>
              </Link>
              <Link href="/internships" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-primary rounded-lg transition-all">
                <span className="material-symbols-outlined">work</span>
                <p className="text-sm font-medium">Internships</p>
              </Link>
              <Link href="/resources" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-primary rounded-lg transition-all">
                <span className="material-symbols-outlined">description</span>
                <p className="text-sm font-medium">Resources</p>
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</p>
              <div className="flex flex-col gap-2">
                <Button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
                  <UploadIcon className="text-sm" />
                  Upload Doc
                </Button>
                <Button className="w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg text-sm font-bold transition-all">
                  <GroupAddIcon className="text-sm" />
                  Join Group
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-600 transition-colors">
                <SettingsIcon />
                <p className="text-sm font-medium">Settings</p>
              </Link>
              <Link href="/logout" className="flex items-center gap-3 px-3 py-2 text-rose-500 hover:text-rose-600 transition-colors">
                <LogoutIcon />
                <p className="text-sm font-medium">Logout</p>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-8">
            <h2 className="text-slate-900 text-xl font-bold tracking-tight">Student Dashboard</h2>
            <div className="relative w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 placeholder:text-slate-400"
                placeholder="Search resources..."
                type="text"
              />
            </div>
            <div className="hidden xl:flex items-center gap-3 border-l border-slate-200 pl-8">
              <div className="intellibar-item">
                <FavoriteIcon className="text-primary text-[18px]" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase leading-none">Likes</span>
                  <span className="text-xs font-bold text-slate-900 leading-none">1,284</span>
                </div>
              </div>
              <div className="intellibar-item">
                <BoltIcon className="text-primary text-[18px]" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase leading-none">Engage</span>
                  <span className="text-xs font-bold text-slate-900 leading-none">84.2%</span>
                </div>
              </div>
              <div className="intellibar-item">
                <ShareIcon className="text-primary text-[18px]" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase leading-none">Shares</span>
                  <span className="text-xs font-bold text-slate-900 leading-none">42</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-primary hover:bg-orange-50 rounded-lg relative transition-all" aria-label="Notifications">
                <BellIcon />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 text-slate-400 hover:text-primary hover:bg-orange-50 rounded-lg transition-all" aria-label="Messages">
                <ChatBubbleIcon />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user.displayName || user.username}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">CS Senior</p>
              </div>
              <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-primary ring-offset-2" style={{backgroundImage: `url(${user.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMbLxRlJxo225D5mXd7xnc-pglPK6AjpEuswW7KJNNWRDaQ4xJm-OBKkS0PB0O8KM7Hgjs3OYjDcsyiOr5m76Z3iTb0B8Kvta2HcLRm4coN6bekz8HAn_opYKFYSjhqBivFHHNU9JWN--xutZFdkHMpYBkAIOMAEBTx_52ZdeW7UlpIbCBcJmLqOLcS92glot2Vd3OVmQRVMYyUjAIUGz0SOLUqJMhtcL8NXQxJzc1GSJVRPmy-8NRos93EHTLFz0hLT2dP5xqgHE'})`}}></div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Welcome back, {user.displayName || user.username}!</h1>
              <p className="text-slate-500 text-lg mt-1 font-medium">Here's what's happening with your studies today.</p>
            </div>
            <Button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <PersonIcon />
              View Profile
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Classes Today</p>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <span className="material-symbols-outlined text-primary">calendar_today</span>
                </div>
              </div>
              <p className="text-slate-900 text-3xl font-black">4</p>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Next: Data Structures @ 2:00 PM
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Tasks</p>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <span className="material-symbols-outlined text-amber-500">assignment</span>
                </div>
              </div>
              <p className="text-slate-900 text-3xl font-black">7</p>
              <p className="text-xs text-slate-500 font-medium">3 priority tasks remaining</p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Upcoming Deadlines</p>
                <div className="p-2 bg-rose-50 rounded-lg">
                  <span className="material-symbols-outlined text-rose-500">alarm</span>
                </div>
              </div>
              <p className="text-slate-900 text-3xl font-black">2</p>
              <p className="text-xs text-rose-500 font-bold">Physics Lab report due tonight</p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scholarships Section */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-slate-900 text-xl font-bold">Available Scholarships</h2>
                <Button variant="ghost" className="text-primary text-sm font-bold hover:text-primary-dark transition-colors">See All</Button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between hover:border-primary hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <span className="material-symbols-outlined">monetization_on</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">STEM Excellence Grant</h3>
                      <p className="text-xs text-slate-400">National Science Foundation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-lg">$5,000</p>
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">3 Days Left</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between hover:border-primary hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Future Tech Leaders</h3>
                      <p className="text-xs text-slate-400">Google Career Initiative</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-lg">$2,500</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">12 Days Left</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Internships Section */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-slate-900 text-xl font-bold">Latest Internships</h2>
                <Button variant="ghost" className="text-primary text-sm font-bold hover:text-primary-dark transition-colors">See All</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="size-10 bg-slate-100 rounded-lg bg-cover bg-center shadow-inner" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBDpMOJ70oo3szeMKlhKtldHJsC_SxyOC8owe_1_qST-HU_hH_-nYVdITtrlq8mx0dpY5GegORiEevzXhk-DLYLoGg_XTNY3seOnWpGz5QcB4u3giNnYW39OvZZxTVi2w-Nxpdj0viqKaRUMizaIUcH2K8Q63vr3F9t8PMfj9g79efe-xFoTALiWxaUSA1Jze_ZgriBGZlRFZrUF0rYmJqogNw-2uW1fRm0HGYkQZMp8H4BN-6IsiyysQqEYl13SbZe32eEA1z2Qbk)'}}></div>
                    <span className="bg-orange-50 text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase">95% Match</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Product Design Intern</h3>
                    <p className="text-xs text-slate-400 font-medium">Stripe • Remote</p>
                  </div>
                  <Button className="mt-2 w-full bg-slate-50 hover:bg-primary hover:text-white transition-all text-slate-700 py-2.5 rounded-xl text-xs font-bold shadow-sm">Apply Now</Button>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="size-10 bg-slate-100 rounded-lg bg-cover bg-center shadow-inner" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuA96zl41cUjpzPgcuOQd9Z7u5buTp_U6OXB1G30EnSGmxJ8NuupqT1iXwC3CEUjyy2jTeowRSh6P4L25m7dZRloxq9Z_vXfLMKbum6D3OuK8r_-tFgCMs5s6biPpZS5mf_JYLumiyfDAMKYbmQAJW6VCkDJIPtKF2G146Rf-Br7F9EbUWApL_KhJlh3VDb0ql5YXJ4Vi8OfUSzv97wnbXINC-94JbO3WE7nAHmexHjN0vk57E87sgjRHBh--S8JLDIXdxgIHEcxg2o)'}}></div>
                    <span className="bg-orange-50 text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase">82% Match</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Software Engineer</h3>
                    <p className="text-xs text-slate-400 font-medium">Vercel • Hybrid</p>
                  </div>
                  <Button className="mt-2 w-full bg-slate-50 hover:bg-primary hover:text-white transition-all text-slate-700 py-2.5 rounded-xl text-xs font-bold shadow-sm">Apply Now</Button>
                </div>
              </div>
            </section>

            {/* Recent Resources Section */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-slate-900 text-xl font-bold">Recent Resources</h2>
                <Button variant="ghost" className="text-primary text-sm font-bold hover:text-primary-dark transition-colors">Explore</Button>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex flex-col divide-y divide-slate-100">
                  <div className="p-4 flex items-center justify-between hover:bg-orange-50/30 cursor-pointer group transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Algorithms_CheatSheet_V2.pdf</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Prof. Chen • 2h ago</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">download</span>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-orange-50/30 cursor-pointer group transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                        <span className="material-symbols-outlined">video_library</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Intro to Machine Learning Recap</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lecture Video • 5h ago</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">play_circle</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Study Groups Section */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-slate-900 text-xl font-bold">My Study Groups</h2>
                <Button variant="ghost" className="text-primary text-sm font-bold hover:text-primary-dark transition-colors">Manage</Button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      <img alt="Student" className="inline-block size-10 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBipgrHqtDhWodRpB7BUZZqm4lRsCI9uoQzKubLGMEE7piAAVtjHGIHU_fojBfUe9chfm9wmwYGbcyoByx9eTvOj9LSgJisfR8HgNjK0_KVOjpEOX5GfZ7_AxpEkDq6mwf-GW0dBvv98mLrobTIZG75vS76TUUj0A-is89598TW2rZtpmHSrAbRf0-JS6VUoHc4A8JlGiGwpvnSFIl0ym8dDTrBo_Z3apw0MSvao8Ad3ByANG4yewpbjvE3UCr2iaNLVnjfwcZVZohFc"/>
                      <img alt="Student" className="inline-block size-10 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq5ffAB9e_G0wK5x1QZ4VAHFqwkO1aFdss_CghTo68RGtL8A2N_8Qj9sgi8mMmKuyCRPN9yQ3oLIIbXUue7vlMaWgXKqQas20xS4KBsQkzC1EfA7Ln5Lw483-KxbP3mznqehaHCKeNvMACjBxoU8BLqeiE20J6-XZsVqxaZZQNgIdgsnFv1Gn6PCuyYL_m57TSLWEQ8O0nkopSAmntnAuKc9H7xiun_UNUQyudjESrIpjINjRddxp3RpSwiAyq0pnELBQ-AmkagMM"/>
                      <img alt="Student" className="inline-block size-10 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbvfjd548aoNoazwZN-PKsdDRzm0Q3o9DIiaIpcBsBC1WUCmDsV7C6OmqOc_OZlRj4fWvooBWF_mTGOM4UcrqiDVFjncP47uKX3aHinoZUZ31ZV0_PnFkzA0RTd3sgNYlA2r2LFrpJQxaFwc2MozTnNzCZbnzjh8LNjNmCt6folZQ8SEbgxcLSJCStIdHd2YG36H9Zn4SZ63jR4hK973AiQBfiYl2e8gtNJCa_DI4B0OcXm2_iCThRvBKixl22NLVnjfwcZVZohFc"/>
                      <div className="inline-flex size-10 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white ring-2 ring-white">+5</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Calculus III Midterm Prep</h3>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        4 active now
                      </p>
                    </div>
                  </div>
                  <Button className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-orange-100">Enter Room</Button>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      <img alt="Student" className="inline-block size-10 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3ry34422Guti8maEfga0F-IzNLd7IbyKqbzymxsE9LjiXPjDTpbPVv-WLYhvuBHuQ6rskO_45Ayx0sZP71qHwRFX9SNVPAvOaCAovekU6SZxAG3NuwWVXt5Ebk6rI21XMI5TEp90EQczGp6y2S5d12cmV8N20iYUjs5O1xwhbMOohtbgb41O2ArjRVnTecGYyv_I0R8uh7xH-G0iuOmvAhqIi5S067QciVSYvKpK_cJtyj2cmbLHw2o8sXAqJnE4nGm4ju2Py3a0"/>
                      <img alt="Student" className="inline-block size-10 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHavcQy8xNfJrqAsaCS0AntjGfnJWNrXyCTuazbtUM7B9mQnaFNZtgWSvh82lY5sZnf8YM3N5Xfa5Z2WwEFisupjlmWT4tQOjrSLsmKh6qc03RImFg3-WZYVBKuj_1efw-RG52jj0QSiiJJcJY2CnoNcpNORvHkfatUlTOEP10MWxQOBsCnVtRnKfOi3f5L-zZ9P3okHVLxxRjFw-bmhRolMnyo5u-37jlpaX75wsYzfxQlcSm8QXNJC489vbTjWT_t5rLTafknoM"/>
                      <div className="inline-flex size-10 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white ring-2 ring-white">+12</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Modern Art History Club</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Friday @ 4:00 PM</p>
                    </div>
                  </div>
                  <Button className="px-5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all">Enter Room</Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}