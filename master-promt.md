# MASTER PROMPT — BENIH SERIBUAN E-COMMERCE PLATFORM (REVISED V3)

## OVERVIEW

Buat platform e-commerce **Benih Seribuan** — toko online benih & kebutuhan berkebun yang modern, cepat, dan premium. 
Nama brand: **"BenihSeribuan"** (satu kata, huruf kapital B dan S). 
Tagline: *"Ekosistem berkebun terlengkap untuk semua orang."*
Tema: **Modern Botanical** dengan nuansa premium, bersih, dan fungsional.

---

## TECH STACK

| Layer | Teknologi |
|---|---|
| **Core Framework** | Next.js 15+ (App Router) |
| **Database** | PostgreSQL (Local/Self-hosted) |
| **ORM** | Drizzle ORM |
| **CMS & Dashboard** | Payload CMS 3.0+ (Integrated with Next.js) |
| **Auth (Keamanan)** | Better Auth |
| **Styling & UI** | Tailwind CSS + shadcn/ui |
| **Penyimpanan Gambar** | Local File System (Payload Media) |
| **Optimasi Gambar** | Sharp (Image Processing) |
| **Analytics** | Umami Analytics |
| **Transactional Email** | Resend |
| **Shipping & API** | RajaOngkir / Custom Expedition API |
| **Payment Gateway** | Xendit / Midtrans |
| **Process Manager** | PM2 / Docker |

---

## DESIGN SYSTEM — "PREMIUM BOTANICAL"

### Visual Aesthetic
- **Hero Section**: Menggunakan gambar render 3D statis berkualitas tinggi (High-Fidelity 3D Renders) yang menggantikan Interactive 3D (Three.js) untuk performa maksimal namun tetap terlihat modern.
- **Glassmorphism**: Penggunaan efek kaca transparan pada navbar, kartu produk, dan modal.
- **Typography**: 
  - Headings: **Outfit** atau **Plus Jakarta Sans** (Bold/Black)
  - Body: **Inter** (Regular/Medium)
- **Colors**:
  - Primary: `Emerald-600` (#059669) & `Emerald-700` (#047857)
  - Accent: `Lime-400` (#a3e635) untuk tombol aksi
  - Neutral: `Slate-900` untuk teks, `Slate-50` untuk background

---

## DATABASE SCHEMA (Drizzle + PostgreSQL)

Payload CMS akan mengelola sebagian besar skema melalui koleksi, namun Drizzle digunakan untuk akses data performa tinggi.

1. **Users & Auth**: Dikelola oleh Better Auth & Payload (Role: Admin, Customer).
2. **Products**: Name, Slug, Description, Price, Sale Price, Stock, Weight, SKU, Media (Images), Category, Variants (JSONB), SEO Meta.
3. **Categories**: Name, Slug, Icon, Image.
4. **Orders**: Order Number, User ID, Status (Pending, Paid, Processing, Shipped, Delivered, Cancelled, Refunded), Items, Shipping Details, Payment Details, Tracking Number.
5. **Settings**: Configuration store untuk API Keys, Email, WhatsApp, Shipping, & Payment.

---

## ADMIN DASHBOARD FEATURES (Payload CMS Customization)

Dashboard admin harus mencakup modul manajemen berikut:

1. **Email Settings**:
   - Konfigurasi API Resend.
   - Manajemen template email (Promo, Status Pesanan, Reset Password, Welcome Email).
   - Fitur "Test Send Email" ke alamat admin.

2. **WhatsApp Notification**:
   - Integrasi API WhatsApp (seperti Fonnte atau sejenisnya).
   - Pengiriman otomatis notifikasi status pesanan, OTP, atau promo.

3. **Shipping Management**:
   - Toggle aktif/matikan ekspedisi (JNE, TIKI, POS, dll).
   - Pengaturan Origin/Gudang.
   - Integrasi API untuk tracking otomatis.

4. **Payment Gateway Configuration**:
   - Aktivasi/Deaktivasi metode pembayaran (Transfer Bank, QRIS, E-Wallet).
   - Fitur Manajemen Pengembalian Dana (Refund) langsung dari dashboard.

5. **Logistics & Fulfillment**:
   - Tombol **"Cetak Surat Pesanan"**: Generate PDF instruksi ambil barang untuk gudang.
   - Tombol **"Cetak Resi"**: Generate label pengiriman standar (Shipping Label) yang siap tempel dengan barcode/QR.

---

## KEY FEATURES — STOREFRONT

1. **Smart Cookie Consent & Geo-Location**:
   - Popup Cookies saat pertama kali masuk (Modern & Unobtrusive).
   - Izin Akses Lokasi: Digunakan untuk mendeteksi lokasi user secara otomatis.
   - **Real-time Shipping Calculation**: Menampilkan estimasi ongkir langsung di halaman detail produk berdasarkan lokasi terdeteksi tanpa harus ke checkout.

2. **Hero Section**: 
   - Visual 3D render statis yang memukau.
   - Tipografi yang kuat dan CTA yang jelas.

3. **Product Experience**:
   - Filter & Search yang instan (Debounced).
   - Varian produk dengan pemilihan yang intuitif.
   - Quick Add to Cart & Wishlist.

4. **Checkout Workflow**:
   - One-page checkout yang efisien.
   - Integrasi RajaOngkir untuk perhitungan ongkir akurat.
   - Integrasi Payment Gateway untuk pembayaran otomatis.

---

## PERFORMANCE & OPTIMIZATION

- **Sharp**: Digunakan untuk automatic image resizing dan format conversion (WebP/AVIF).
- **Caching**: Implementasi Next.js Data Cache untuk produk dan kategori.
- **SEO**: Metadata otomatis untuk setiap halaman produk dan artikel.
- **Analytics**: Umami Analytics terintegrasi tanpa mengorbankan privasi user.

---

## DEPLOYMENT STRATEGY

- **Environment**: PostgreSQL Local/Docker.
- **Process Manager**: PM2 untuk mengelola instance Next.js di server.
- **Storage**: Penggunaan volume lokal untuk folder `/media` Payload.

---

## PANDUAN IMPLEMENTASI

1. Inisialisasi Next.js 15 dengan Payload CMS 3.0.
2. Setup Better Auth untuk autentikasi user & admin.
3. Konfigurasi Drizzle dengan PostgreSQL.
4. Buat Koleksi Payload untuk Produk, Kategori, Pesanan, dan Settings.
5. Implementasikan Logic Email (Resend) dan WA.
6. Bangun Storefront dengan Tailwind & shadcn/ui.
7. Implementasikan Fitur Cetak PDF (Logistik).
8. Tambahkan Cookie Consent dengan Geo-Location API.

---

*Catatan: Pastikan desain tetap bersih, premium, dan memberikan pengalaman belanja yang mulus.*
