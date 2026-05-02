import { db } from './index'
import { users, categories, products, productImages } from './schema'
import { eq, sql } from 'drizzle-orm'

async function seed() {
  console.log('🌱 Clearing old data and seeding realistic botanical products...')

  try {
    // 1. Clear existing data (but keep users)
    await db.delete(productImages)
    await db.delete(products)
    await db.delete(categories)
    
    // 2. Create Categories
    const catData = [
      { name: 'Benih Sayuran Premium', slug: 'benih-sayuran-premium' },
      { name: 'Benih Buah Tropis', slug: 'benih-buah-tropis' },
      { name: 'Pupuk & Nutrisi', slug: 'pupuk-nutrisi' },
      { name: 'Media Tanam', slug: 'media-tanam' },
      { name: 'Paket Berkebun', slug: 'paket-berkebun' },
    ]

    for (const cat of catData) {
      await db.insert(categories).values(cat)
    }

    const allCats = await db.select().from(categories)
    const sayuranId = allCats.find(c => c.slug === 'benih-sayuran-premium')?.id
    const buahId = allCats.find(c => c.slug === 'benih-buah-tropis')?.id
    const pupukId = allCats.find(c => c.slug === 'pupuk-nutrisi')?.id

    // 3. Create Products
    const productData = [
      {
        name: 'Benih Cabai Rawit Sret Unggul',
        slug: 'benih-cabai-rawit-sret-unggul',
        description: 'Benih cabai rawit dengan tingkat kepedasan tinggi dan tahan terhadap virus gemini. Cocok untuk dataran rendah hingga tinggi.',
        price: '15000',
        stock: 500,
        categoryId: sayuranId,
        isFeatured: true,
        image: '/images/products/cabai-rawit.png'
      },
      {
        name: 'Benih Tomat Cherry Red Ruby',
        slug: 'benih-tomat-cherry-red-ruby',
        description: 'Tomat cherry dengan rasa manis dan tekstur renyah. Berbuah lebat dalam satu tandan.',
        price: '12500',
        stock: 300,
        categoryId: sayuranId,
        isFeatured: true,
        image: '/images/products/tomat-cherry.png'
      },
      {
        name: 'Benih Kangkung Daun Lebar (1kg)',
        slug: 'benih-kangkung-daun-lebar-1kg',
        description: 'Kangkung kualitas premium dengan pertumbuhan cepat, hanya 20-25 hari setelah tanam.',
        price: '45000',
        stock: 100,
        categoryId: sayuranId,
        isFeatured: false,
        image: '/images/hero-product.png'
      },
      {
        name: 'Benih Semangka Non-Biji Premium',
        slug: 'benih-semangka-non-biji-premium',
        description: 'Semangka dengan daging merah segar tanpa biji. Tahan simpan dan manis.',
        price: '25000',
        stock: 150,
        categoryId: buahId,
        isFeatured: true,
        image: '/images/hero-product.png'
      },
      {
        name: 'Pupuk Organik Cair (POC) Booster 500ml',
        slug: 'pupuk-organik-cair-poc-booster-500ml',
        description: 'Nutrisi lengkap untuk mempercepat pertumbuhan daun dan bunga pada tanaman sayur dan hias.',
        price: '35000',
        stock: 200,
        categoryId: pupukId,
        isFeatured: true,
        image: '/images/products/pupuk-cair.png'
      }
    ]

    for (const prod of productData) {
      const { image, ...prodValues } = prod
      const result = await db.insert(products).values(prodValues as any)
      
      // @ts-ignore
      const productId = result[0].insertId
      
      if (productId && image) {
         await db.insert(productImages).values({
           productId: productId,
           url: image,
           alt: prod.name,
         })
      }
    }

    console.log('✅ Real simulation data seeded successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

seed()
