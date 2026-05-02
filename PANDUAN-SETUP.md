# 📖 Panduan Setup Benih Seribuan v2.0
Dokumen ini berisi langkah-langkah lengkap untuk mengaktifkan seluruh fitur platform Benih Seribuan v2.0, mulai dari setup lokal hingga integrasi API pihak ketiga.

---

## 🛠 Langkah 1: Inisialisasi Lokal
1.  **Extract Project**: Pastikan folder project sudah berada di lokasi yang diinginkan.
2.  **Install Dependencies**: Buka terminal di folder project dan jalankan:
    ```bash
    npm install
    ```
3.  **Setup Database (XAMPP)**:
    *   Buka XAMPP Control Panel dan aktifkan **Apache** & **MySQL**.
    *   Buka `http://localhost/phpmyadmin`.
    *   Buat database baru dengan nama `benihseribuan_v2`.
    *   Klik tab **Import**, pilih file `database/benihseribuan_v2.sql`, lalu klik **Go**.
4.  **Konfigurasi .env**:
    *   Copy file `.env.example` menjadi `.env`.
    *   Pastikan konfigurasi database di bagian atas sudah benar (host, user, password).
    *   Jalankan project:
    ```bash
    npm run dev
    ```

---

## 🔑 Langkah 2: Integrasi API Key (Koneksi Pihak Ketiga)

Berikut adalah daftar layanan yang perlu Anda daftarkan untuk mengaktifkan fitur otomatisasi:

### 1. Xendit (Payment Gateway - Otomatisasi Pembayaran)
*   **Fungsi**: Menerima pembayaran via VA, E-Wallet (OVO, DANA), dan QRIS.
*   **Pendaftaran**: [dashboard.xendit.co](https://dashboard.xendit.co/register)
*   **Cara Ambil Key**:
    1.  Login ke Dashboard Xendit.
    2.  Masuk ke menu **Settings** > **Developers** > **API Keys**.
    3.  Klik **Generate Secret Key**. Beri izin Read/Write untuk semua.
    4.  Copy key yang muncul (biasanya berawalan `xnd_sct_...`).
*   **Penempatan di .env**: `XENDIT_SECRET_KEY`

### 2. RajaOngkir (Shipping - Cek Ongkir Otomatis)
*   **Fungsi**: Menghitung biaya kirim JNE, J&T, Sicepat, dll secara real-time.
*   **Pendaftaran**: [rajaongkir.com](https://rajaongkir.com/registrasi)
*   **Cara Ambil Key**:
    1.  Login ke akun RajaOngkir.
    2.  Masuk ke menu **Panel Samping** > **API Key**.
    3.  Copy kode API Key Anda.
*   **Penempatan di .env**: `RAJAONGKIR_API_KEY` (Gunakan tipe `pro` jika Anda berlangganan, atau `starter` untuk gratisan).

### 3. Fonnte (WhatsApp Gateway - Notifikasi WA)
*   **Fungsi**: Mengirim notifikasi pesanan otomatis ke WhatsApp pembeli.
*   **Pendaftaran**: [fonnte.com](https://fonnte.com/)
*   **Cara Ambil Key**:
    1.  Login ke Fonnte.
    2.  Hubungkan nomor WA Anda di tab **Devices**.
    3.  Masuk ke menu **Profile** untuk melihat **API Token**.
*   **Penempatan di .env**: `FONNTE_API_KEY`

### 4. Resend (Email Gateway - Notifikasi Email)
*   **Fungsi**: Mengirim email konfirmasi pesanan dan lupa password.
*   **Pendaftaran**: [resend.com](https://resend.com/)
*   **Cara Ambil Key**:
    1.  Login/Daftar di Resend.
    2.  Masuk ke tab **API Keys**.
    3.  Klik **Create API Key**.
*   **Penempatan di .env**: `RESEND_API_KEY`

### 5. OpenAI (AI Copywriter & Insights)
*   **Fungsi**: Menjalankan fitur AI di Admin Dashboard (saran marketing & penulisan artikel).
*   **Pendaftaran**: [platform.openai.com](https://platform.openai.com/signup)
*   **Cara Ambil Key**:
    1.  Login ke Dashboard OpenAI.
    2.  Masuk ke menu **Settings** > **API Keys**.
    3.  Klik **Create new secret key**.
*   **Penempatan di .env**: `OPENAI_API_KEY`

### 6. Google OAuth (Login with Google)
*   **Fungsi**: Memungkinkan pelanggan login tanpa mengisi form pendaftaran.
*   **Pendaftaran**: [console.cloud.google.com](https://console.cloud.google.com/)
*   **Cara Ambil Key**:
    1.  Buat project baru di Google Cloud Console.
    2.  Masuk ke **APIs & Services** > **Credentials**.
    3.  Klik **Create Credentials** > **OAuth client ID**.
    4.  Set Authorized redirect URIs ke `http://localhost:3000/api/auth/callback/google`.
    5.  Dapatkan **Client ID** dan **Client Secret**.
*   **Penempatan di .env**: `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`

---

## 🚀 Langkah 3: Menjalankan Mode Produksi
Jika Anda ingin mengetes performa asli (lebih cepat dari mode dev):
1.  Jalankan Build:
    ```bash
    npm run build
    ```
2.  Jalankan Production:
    ```bash
    npm run start
    ```

---

## 📝 Catatan Penting
*   **Keamanan**: Jangan pernah membagikan file `.env` Anda kepada siapapun atau mengunggahnya ke GitHub publik.
*   **NextAuth Secret**: Untuk mengisi `NEXTAUTH_SECRET`, Anda bisa membuat string acak apapun atau jalankan `openssl rand -base64 32` di terminal.
*   **XAMPP**: Pastikan XAMPP selalu berjalan saat Anda mengakses website secara lokal.

---
*Dibuat oleh Tim Pengembang Benih Seribuan v2.0*
