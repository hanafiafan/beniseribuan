import { db } from "@/lib/db"
import { articles, users } from "@/lib/db/schema"
import { desc, eq, like, or } from "drizzle-orm"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    let query = db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        status: articles.status,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        excerpt: articles.excerpt,
        featuredImage: articles.featuredImage,
        tags: articles.tags,
        author: {
          displayName: users.displayName,
          email: users.email,
        }
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .orderBy(desc(articles.createdAt))

    const rows = await query
    let filtered = rows
    if (search) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.excerpt?.toLowerCase().includes(search.toLowerCase()))
      )
    }
    if (status) {
      filtered = filtered.filter(a => a.status === status)
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const [inserted] = await db.insert(articles).values({
      title: body.title,
      slug,
      content: body.content || '',
      excerpt: body.excerpt || '',
      featuredImage: body.featuredImage || '',
      tags: body.tags || [],
      status: body.status || 'draft',
      authorId: Number(session.user.id),
      publishedAt: body.status === 'published' ? new Date() : null,
    }).$returningId()

    return NextResponse.json({ id: inserted.id, slug })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    
    await db.update(articles).set({
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      featuredImage: data.featuredImage,
      tags: data.tags,
      status: data.status,
      publishedAt: data.status === 'published' ? new Date() : null,
      updatedAt: new Date(),
    }).where(eq(articles.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await db.delete(articles).where(eq(articles.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
