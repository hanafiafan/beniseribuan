'use server'

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: number, role: 'customer' | 'admin' | 'editor') {
  try {
    await db.update(users)
      .set({ role })
      .where(eq(users.id, userId))
    
    revalidatePath('/admin/pelanggan')
    return { success: true }
  } catch (error) {
    console.error("Failed to update user role:", error)
    return { success: false, error: "Gagal memperbarui role" }
  }
}

export async function deleteUser(userId: number) {
  try {
    await db.delete(users).where(eq(users.id, userId))
    revalidatePath('/admin/pelanggan')
    return { success: true }
  } catch (error) {
    console.error("Failed to delete user:", error)
    return { success: false, error: "Gagal menghapus user" }
  }
}
