import { db } from "@/lib/db"
import { media, users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || ''

    const rows = await db
      .select({
        id: media.id,
        fileName: media.fileName,
        fileUrl: media.fileUrl,
        fileType: media.fileType,
        fileSize: media.fileSize,
        alt: media.alt,
        createdAt: media.createdAt,
        uploader: { displayName: users.displayName }
      })
      .from(media)
      .leftJoin(users, eq(media.uploadedBy, users.id))
      .orderBy(desc(media.createdAt))

    const filtered = type ? rows.filter(m => m.fileType?.startsWith(type)) : rows
    return NextResponse.json(filtered)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const [inserted] = await db.insert(media).values({
      fileName: body.fileName,
      fileUrl: body.fileUrl,
      fileType: body.fileType,
      fileSize: body.fileSize,
      alt: body.alt || body.fileName,
      uploadedBy: Number(session.user.id),
    }).$returningId()

    return NextResponse.json({ id: inserted.id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save media" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await db.delete(media).where(eq(media.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, alt } = await req.json()
    await db.update(media).set({ alt }).where(eq(media.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update media" }, { status: 500 })
  }
}
