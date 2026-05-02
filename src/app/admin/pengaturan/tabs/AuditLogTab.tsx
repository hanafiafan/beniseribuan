'use client'
import { Activity, User, Settings, ShoppingBag, Shield, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props { auditLogs: any[] }

const actionColors: Record<string, string> = {
  UPDATE_SETTINGS: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  CREATE: 'bg-emerald-100 text-emerald-700',
  LOGIN: 'bg-indigo-100 text-indigo-700',
  UPDATE_ROLE: 'bg-amber-100 text-amber-700',
  UPDATE_ORDER: 'bg-purple-100 text-purple-700',
  default: 'bg-slate-100 text-slate-700',
}

const entityIcons: Record<string, any> = {
  settings: Settings,
  orders: ShoppingBag,
  users: User,
  products: Activity,
  system: Shield,
}

export default function AuditLogTab({ auditLogs }: Props) {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-900 font-heading">Audit Log</h3>
          <p className="text-slate-500 mt-1">Rekaman lengkap seluruh aktivitas administratif sistem.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-black text-emerald-700">Live</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Aksi', value: auditLogs.length, color: 'text-slate-900', bg: 'bg-slate-50' },
          { label: 'Hari Ini', value: auditLogs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Admin Unik', value: new Set(auditLogs.map(l => l.user?.email).filter(Boolean)).size, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Perubahan Kritis', value: auditLogs.filter(l => ['DELETE', 'UPDATE_ROLE'].includes(l.action)).length, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn("p-6 rounded-3xl", bg)}>
            <p className={cn("text-3xl font-black", color)}>{value}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Log Table */}
      <div className="bg-slate-50 rounded-[40px] overflow-hidden border border-slate-100">
        {auditLogs.length === 0 ? (
          <div className="py-24 text-center">
            <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="font-black text-slate-300 text-lg">Belum ada rekaman aktivitas</p>
            <p className="text-slate-400 text-sm mt-1">Setiap perubahan konfigurasi akan muncul di sini</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => {
              const EntityIcon = entityIcons[log.entity?.toLowerCase()] || Activity
              const colorClass = actionColors[log.action] || actionColors.default
              return (
                <div key={log.id} className="flex items-center gap-5 px-8 py-5 hover:bg-white transition-colors group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <EntityIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", colorClass)}>
                        {log.action}
                      </span>
                      {log.entity && (
                        <span className="text-xs font-bold text-slate-400">on <span className="text-slate-700">{log.entity}</span></span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400">
                        {log.user?.displayName?.charAt(0) || 'S'}
                      </div>
                      <p className="text-xs font-bold text-slate-600">{log.user?.displayName || 'System'}</p>
                      <span className="text-slate-300">•</span>
                      <p className="text-[10px] text-slate-400">{log.user?.email || '-'}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-900">{new Date(log.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    {log.ipAddress && (
                      <p className="text-[10px] font-mono text-slate-300 mt-0.5">{log.ipAddress}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-200 shrink-0 group-hover:text-slate-400 transition-colors" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
