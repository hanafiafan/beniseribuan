'use client'
import { useState, useEffect } from 'react'
import { Users, ShieldCheck, Mail, Search, Filter, MoreVertical, UserPlus, Shield, User, Trash2, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function UsersManagementPage() {
  const [usersList, setUsersList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'admins'>('users')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsersList(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])
   const deleteUser = async (id: number) => {
     if (!confirm('Hapus user ini secara permanen?')) return
     try {
       const res = await fetch('/api/admin/users', {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id })
       })
       if (res.ok) {
         setUsersList(usersList.filter(u => u.id !== id))
       }
     } catch (error) {
       console.error(error)
     }
   }

   const toggleRole = async (id: number, currentRole: string) => {
     const newRole = currentRole === 'admin' ? 'user' : 'admin'
     try {
       const res = await fetch('/api/admin/users', {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id, role: newRole })
       })
       if (res.ok) {
         setUsersList(usersList.map(u => u.id === id ? { ...u, role: newRole } : u))
       }
     } catch (error) {
       console.error(error)
     }
   }

   const customers = usersList.filter(u => u.role === 'user' || !u.role)
   const admins = usersList.filter(u => u.role === 'admin')
 
   const filteredData = (activeTab === 'users' ? customers : admins).filter(u => 
     (u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
     (u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
   )
 
   return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">Manajemen User & Akses</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola hak akses dan database pengguna Benih Seribuan.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all">
          <UserPlus className="w-5 h-5" />
          Undang Admin Baru
        </button>
      </div>

      {/* Stats & Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
         <button 
           onClick={() => setActiveTab('users')}
           className={cn(
             "p-8 rounded-[40px] border transition-all text-left relative overflow-hidden group",
             activeTab === 'users' ? "bg-white border-brand-200 shadow-xl shadow-brand-500/5" : "bg-white/50 border-slate-100 opacity-60 hover:opacity-100"
           )}
         >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors", activeTab === 'users' ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400")}>
               <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Database Pelanggan</h3>
            <p className="text-sm text-slate-500 mt-1">{customers.length} User Terdaftar</p>
            {activeTab === 'users' && <div className="absolute top-8 right-8 w-2 h-2 bg-brand-500 rounded-full" />}
         </button>

         <button 
           onClick={() => setActiveTab('admins')}
           className={cn(
             "p-8 rounded-[40px] border transition-all text-left relative overflow-hidden group",
             activeTab === 'admins' ? "bg-white border-blue-200 shadow-xl shadow-blue-500/5" : "bg-white/50 border-slate-100 opacity-60 hover:opacity-100"
           )}
         >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors", activeTab === 'admins' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400")}>
               <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Administrator / Staff</h3>
            <p className="text-sm text-slate-500 mt-1">{admins.length} Admin Aktif</p>
            {activeTab === 'admins' && <div className="absolute top-8 right-8 w-2 h-2 bg-blue-500 rounded-full" />}
         </button>
      </div>

      {/* Main Table Area */}
      <div className="px-6">
         <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
               <div className="relative w-full sm:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari nama atau email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  />
               </div>
               <div className="flex items-center gap-3">
                  <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-slate-100 transition-all">
                     <Filter className="w-4 h-4" /> Filter
                  </button>
               </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Info</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Role</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Terdaftar Pada</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {loading ? (
                        <tr>
                           <td colSpan={4} className="px-8 py-20 text-center text-slate-300 font-bold">Memuat data pengguna...</td>
                        </tr>
                     ) : filteredData.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">Data tidak ditemukan.</td>
                        </tr>
                     ) : (
                        filteredData.map((user) => (
                           <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm">
                                       {user.displayName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                       <p className="font-bold text-slate-900 leading-none mb-1">{user.displayName || 'Unnamed User'}</p>
                                       <div className="flex items-center gap-2">
                                          <Mail className="w-3 h-3 text-slate-300" />
                                          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <span className={cn(
                                       "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                                       user.role === 'admin' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                                    )}>
                                       {user.role || 'user'}
                                    </span>
                                    {user.emailVerified && <Shield className="w-3 h-3 text-emerald-500" />}
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-sm font-medium text-slate-600">{new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              </td>
                               <td className="px-8 py-6 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button 
                                        onClick={() => toggleRole(user.id, user.role)}
                                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"
                                     >
                                        <Shield className="w-4 h-4" />
                                     </button>
                                     <button 
                                        onClick={() => deleteUser(user.id)}
                                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 shadow-sm transition-all"
                                     >
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                  </div>
                               </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  )
}
