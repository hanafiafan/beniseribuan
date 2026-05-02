import { db } from '../src/lib/db'
import { articles, users } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'

async function seedArticles() {
  console.log('🌱 Seeding articles...')

  // Get first admin user as author, or use null
  const adminUsers = await db.select({ id: users.id, displayName: users.displayName })
    .from(users)
    .where(eq(users.role, 'admin'))
    .limit(1)

  const authorId = adminUsers[0]?.id || null
  console.log(`📝 Using author: ${adminUsers[0]?.displayName || 'No admin found, authorId = null'}`)

  const sampleArticles = [
    {
      title: '5 Tips Menanam Cabai Rawit agar Berbuah Lebat',
      slug: 'tips-menanam-cabai-rawit-berbuah-lebat',
      excerpt: 'Cabai rawit adalah salah satu tanaman yang paling banyak ditanam di rumah. Simak rahasia agar cabai Anda berbuah lebat dan tahan lama.',
      content: `# 5 Tips Menanam Cabai Rawit agar Berbuah Lebat

Cabai rawit (*Capsicum frutescens*) adalah tanaman favorit banyak rumah tangga Indonesia. Selain karena harganya yang sering melonjak, menanam cabai sendiri juga sangat memuaskan.

## 1. Pilih Benih Berkualitas

Gunakan benih cabai rawit unggul yang memiliki tingkat germinasi tinggi. Pilih benih dari varietas yang sudah terbukti produktif seperti **Dewata F1** atau **Lado F1**.

## 2. Persiapkan Media Tanam yang Tepat

Campurkan:
- 50% tanah subur
- 30% pupuk kandang / kompos matang
- 20% sekam bakar / cocopit

Pastikan pH tanah antara **6.0–7.0** untuk hasil optimal.

## 3. Perawatan Rutin

- Siram 2x sehari (pagi dan sore)
- Pemupukan NPK setiap 2 minggu sekali
- Semprot pestisida organik untuk mencegah hama

## 4. Pruning (Pemangkasan)

Pangkas tunas air dan daun yang tidak produktif agar energi tanaman fokus pada pembentukan buah.

## 5. Panen pada Waktu yang Tepat

Panen ketika buah sudah berwarna merah penuh. Jangan terlambat panen karena akan mengurangi produksi berikutnya.

---

*Dengan perawatan yang tepat, satu tanaman cabai rawit bisa menghasilkan ratusan buah per musim panen!*`,
      featuredImage: 'https://images.unsplash.com/photo-1592841208389-52317a7027e4?auto=format&fit=crop&q=80&w=800',
      tags: ['Tips & Trik', 'Cabai', 'Berkebun'],
      status: 'published' as const,
      publishedAt: new Date('2024-04-12'),
      authorId,
    },
    {
      title: 'Mengenal Hidroponik Sederhana untuk Pemula',
      slug: 'mengenal-hidroponik-sederhana-pemula',
      excerpt: 'Tidak punya lahan tanah? Hidroponik adalah solusinya. Mari pelajari cara memulai hidroponik dengan alat seadanya dan biaya minimal.',
      content: `# Mengenal Hidroponik Sederhana untuk Pemula

Hidroponik adalah metode bercocok tanam **tanpa menggunakan tanah**. Tanaman ditumbuhkan dalam media air yang diperkaya dengan nutrisi.

## Mengapa Hidroponik?

✅ Tidak butuh lahan luas
✅ Hasil panen 30–50% lebih cepat
✅ Lebih hemat air (70% dibanding konvensional)
✅ Bebas gulma dan hama tanah

## Sistem Hidroponik Termudah: Wick System

Sistem ini paling cocok untuk pemula karena tidak perlu pompa atau listrik.

### Bahan yang dibutuhkan:
- Botol plastik bekas 1,5L
- Sumbu kompor / kain flanel
- Nutrisi AB Mix
- Rockwool atau spons

### Langkah-langkah:
1. Potong botol menjadi 2 bagian
2. Balik bagian atas ke dalam bagian bawah
3. Pasang sumbu melalui lubang tutup botol
4. Isi bagian atas dengan rockwool + bibit
5. Isi bagian bawah dengan larutan nutrisi

## Tanaman yang Cocok untuk Pemula

- Selada (paling mudah)
- Kangkung
- Bayam
- Sawi
- Mint

---

*Mulai dengan 5–10 tanaman untuk belajar, kemudian kembangkan sistem Anda secara bertahap.*`,
      featuredImage: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800',
      tags: ['Edukasi', 'Hidroponik', 'Pemula'],
      status: 'published' as const,
      publishedAt: new Date('2024-04-10'),
      authorId,
    },
    {
      title: 'Pupuk Organik vs Kimia: Mana yang Lebih Baik?',
      slug: 'pupuk-organik-vs-kimia-mana-lebih-baik',
      excerpt: 'Pilihan pupuk sangat menentukan kesehatan tanaman dan hasil panen. Ketahui perbedaan mendasar antara pupuk organik dan kimia untuk memilih yang terbaik.',
      content: `# Pupuk Organik vs Kimia: Mana yang Lebih Baik?

Pertanyaan ini sering muncul di kalangan petani dan pecinta tanaman. Jawabannya: **tergantung kebutuhan Anda**.

## Pupuk Organik

### Kelebihan:
- Memperbaiki struktur tanah jangka panjang
- Ramah lingkungan
- Meningkatkan populasi mikroorganisme baik
- Tidak menyebabkan "keracunan" pada tanaman jika berlebih

### Kekurangan:
- Efeknya lambat (2–4 minggu)
- Kandungan nutrisi tidak seragam
- Membutuhkan volume besar

### Contoh:
Kompos, pupuk kandang, guano, pupuk hijau, MOL

---

## Pupuk Kimia (Anorganik)

### Kelebihan:
- Nutrisi langsung tersedia
- Kandungan NPK terukur dan konsisten
- Efek cepat terlihat

### Kekurangan:
- Penggunaan berlebihan merusak tanah
- Dapat mencemari air tanah
- Tanaman menjadi "ketergantungan"

### Contoh:
Urea, NPK Mutiara, KCl, TSP, ZA

---

## Rekomendasi Kami

Gunakan **kombinasi keduanya**:

1. **Pupuk dasar**: Pupuk organik (kompos/kandang) saat pengolahan tanah
2. **Pupuk susulan**: NPK kimia dosis rendah saat pertumbuhan vegetatif
3. **Pupuk cair organik**: Semprotkan setiap 2 minggu untuk hasil maksimal

Dengan kombinasi ini, tanaman mendapat nutrisi lengkap sekaligus menjaga kesehatan tanah untuk jangka panjang.`,
      featuredImage: 'https://images.unsplash.com/photo-1628350060942-873c94e790a3?auto=format&fit=crop&q=80&w=800',
      tags: ['Info Produk', 'Pupuk', 'Organik'],
      status: 'published' as const,
      publishedAt: new Date('2024-04-08'),
      authorId,
    },
    {
      title: 'Panduan Lengkap Menanam Tomat di Rumah',
      slug: 'panduan-menanam-tomat-di-rumah',
      excerpt: 'Tomat adalah salah satu sayuran yang paling populer untuk ditanam di rumah. Pelajari panduan lengkap dari semai hingga panen.',
      content: `# Panduan Lengkap Menanam Tomat di Rumah

Tomat bisa ditanam di pot, polybag, maupun bedengan. Dengan perawatan yang benar, Anda bisa panen tomat segar langsung dari halaman rumah.

## Tahap 1: Persemaian Benih

1. Rendam benih tomat dalam air hangat selama 6–8 jam
2. Semai di tray semai dengan media cocopit + kompos (1:1)
3. Letakkan di tempat teduh selama 3–5 hari
4. Pindahkan ke tempat terkena sinar matahari setelah berkecambah

## Tahap 2: Pemindahan Bibit

Pindahkan bibit setelah berumur 2–3 minggu atau sudah memiliki 4 helai daun sejati.

## Tahap 3: Perawatan

**Pengairan**: 1–2x sehari
**Pemupukan**:
- Minggu 1–3: NPK tinggi N (untuk pertumbuhan vegetatif)
- Minggu 4+: NPK tinggi P dan K (untuk pembungaan dan pembuahan)

**Perambatan**: Pasang ajir/tiang panjang 1–1,5m untuk menopang tanaman.

## Tahap 4: Panen

Tomat siap panen sekitar 60–80 hari setelah tanam, ditandai dengan warna merah merata dan terasa sedikit lunak.`,
      featuredImage: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&q=80&w=800',
      tags: ['Panduan', 'Tomat', 'Berkebun'],
      status: 'published' as const,
      publishedAt: new Date('2024-04-05'),
      authorId,
    },
    {
      title: 'Cara Merawat Tanaman Hias Indoor agar Tumbuh Subur',
      slug: 'cara-merawat-tanaman-hias-indoor',
      excerpt: 'Tanaman hias indoor tidak hanya memperindah ruangan, tapi juga menyehatkan udara. Ketahui tips merawatnya agar tetap hijau dan subur.',
      content: `# Cara Merawat Tanaman Hias Indoor agar Tumbuh Subur

Tanaman hias indoor semakin populer sebagai dekorasi ruangan yang sekaligus bermanfaat untuk kualitas udara.

## Tanaman Hias Indoor Populer

1. **Monstera Deliciosa** - Daun besar berlubang yang ikonik
2. **Pothos** - Mudah dirawat, cocok untuk pemula  
3. **Snake Plant** - Tahan banting, bisa di tempat gelap
4. **Peace Lily** - Berbunga indah, pembersih udara terbaik
5. **ZZ Plant** - Tahan kekeringan ekstrem

## Tips Perawatan Umum

### Pencahayaan
- Letakkan dekat jendela yang mendapat cahaya tidak langsung
- Hindari sinar matahari langsung yang bisa membakar daun
- Putar pot setiap 2 minggu agar pertumbuhan merata

### Penyiraman
- Cek kelembaban tanah sebelum menyiram
- Lebih baik kurang siram daripada berlebihan
- Siram hingga air keluar dari lubang drainase

### Kelembaban
- Semprot daun dengan air 2–3x seminggu
- Letakkan nampan berisi batu dan air di bawah pot
- Gunakan humidifier di ruangan ber-AC

## Tanda Tanaman Tidak Sehat

🟡 Daun kuning = terlalu banyak air atau kekurangan nutrisi
🟤 Ujung daun coklat = udara terlalu kering atau air mengandung klorin
🔴 Daun layu = kekurangan air atau akar busuk`,
      featuredImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
      tags: ['Tips & Trik', 'Tanaman Hias', 'Indoor'],
      status: 'published' as const,
      publishedAt: new Date('2024-04-01'),
      authorId,
    },
    {
      title: 'Mengatasi Hama pada Tanaman Sayur Secara Organik',
      slug: 'mengatasi-hama-tanaman-sayur-organik',
      excerpt: 'Hama adalah musuh utama petani. Pelajari cara mengatasinya secara organik tanpa bahan kimia berbahaya yang aman untuk keluarga.',
      content: `# Mengatasi Hama pada Tanaman Sayur Secara Organik

Pestisida kimia memang efektif, tapi risikonya besar bagi kesehatan dan lingkungan. Ada banyak cara organik yang tidak kalah ampuh.

## Identifikasi Hama Umum

| Hama | Tanda Serangan | Tanaman Favorit |
|------|---------------|-----------------|
| Ulat grayak | Daun berlubang besar | Kubis, sawi |
| Kutu daun (Aphid) | Daun keriting, ada serangga hijau kecil | Cabai, tomat |
| Thrips | Bintik perak di daun | Bawang, cabai |
| Tungau | Daun menguning, ada jaring halus | Stroberi, cabai |

## Pestisida Organik Buatan Sendiri

### 1. Larutan Bawang Putih
- Haluskan 100g bawang putih
- Rendam dalam 1L air selama 24 jam
- Saring dan encerkan 1:10 dengan air
- Semprot ke seluruh bagian tanaman

### 2. Larutan Sabun Insektisida
- 1 sendok makan sabun cuci piring
- 1L air bersih
- Campurkan dan semprotkan langsung ke hama

### 3. Pestisida Daun Mimba (Neem Oil)
- Paling efektif untuk hama ulat dan kutu
- Campurkan 5ml minyak mimba + 1L air + beberapa tetes sabun
- Semprotkan pagi atau sore hari

## Pencegahan Lebih Baik dari Pengobatan

✅ Rotasi tanaman setiap musim
✅ Tanam tanaman pengusir hama (kemangi, serai, tagetes)
✅ Jaga kebersihan area kebun
✅ Periksa tanaman setiap 2–3 hari`,
      featuredImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
      tags: ['Tips & Trik', 'Hama', 'Organik'],
      status: 'draft' as const,
      publishedAt: null,
      authorId,
    },
  ]

  let inserted = 0
  let skipped = 0

  for (const article of sampleArticles) {
    try {
      await db.insert(articles).values(article)
      inserted++
      console.log(`  ✅ "${article.title}"`)
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        skipped++
        console.log(`  ⏭️  Skipped (already exists): "${article.title}"`)
      } else {
        console.error(`  ❌ Error inserting "${article.title}":`, err.message)
      }
    }
  }

  console.log(`\n✨ Done! Inserted: ${inserted}, Skipped: ${skipped}`)
  process.exit(0)
}

seedArticles().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
