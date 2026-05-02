-- ============================================================
-- BENIHSERIBUAN v2.0 — Database Schema
-- MySQL 8.0 | Import via phpMyAdmin (XAMPP)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Buat database
CREATE DATABASE IF NOT EXISTS `benihseribuan_v2`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `benihseribuan_v2`;

-- ─── USERS ──────────────────────────────────────────────
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) DEFAULT NULL,
  `display_name` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `avatar` VARCHAR(500) DEFAULT NULL,
  `role` ENUM('customer','admin','editor') DEFAULT 'customer',
  `provider` ENUM('credentials','google') DEFAULT 'credentials',
  `provider_id` VARCHAR(255) DEFAULT NULL,
  `email_verified` TIMESTAMP NULL DEFAULT NULL,
  `two_factor_enabled` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── ADDRESSES ──────────────────────────────────────────
CREATE TABLE `addresses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('billing','shipping') DEFAULT 'shipping',
  `label` VARCHAR(100) DEFAULT NULL,
  `recipient_name` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `province` VARCHAR(100) DEFAULT NULL,
  `province_id` INT DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `city_id` INT DEFAULT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `postal_code` VARCHAR(10) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `addresses_user_idx` (`user_id`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── CATEGORIES ─────────────────────────────────────────
CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `parent_id` BIGINT UNSIGNED DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_idx` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PRODUCTS ───────────────────────────────────────────
CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `short_description` TEXT DEFAULT NULL,
  `sku` VARCHAR(100) DEFAULT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `sale_price` DECIMAL(12,2) DEFAULT NULL,
  `stock` INT DEFAULT 0,
  `weight` DECIMAL(8,2) DEFAULT 0.00,
  `category_id` BIGINT UNSIGNED DEFAULT NULL,
  `brand` VARCHAR(150) DEFAULT 'Benih Seribuan',
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `is_digital` TINYINT(1) DEFAULT 0,
  `download_file_url` VARCHAR(500) DEFAULT NULL,
  `estimated_delivery` VARCHAR(100) DEFAULT NULL,
  `compare_attributes` JSON DEFAULT NULL,
  `rating_avg` DECIMAL(3,2) DEFAULT 0.00,
  `rating_count` INT DEFAULT 0,
  `view_count` INT DEFAULT 0,
  `sold_count` INT DEFAULT 0,
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_idx` (`slug`(191)),
  KEY `products_category_idx` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PRODUCT IMAGES ─────────────────────────────────────
CREATE TABLE `product_images` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `alt` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `product_images_product_idx` (`product_id`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PRODUCT VARIANTS ───────────────────────────────────
CREATE TABLE `product_variants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `sale_price` DECIMAL(12,2) DEFAULT NULL,
  `stock` INT DEFAULT 0,
  `sku` VARCHAR(100) DEFAULT NULL,
  `weight` DECIMAL(8,2) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `product_variants_product_idx` (`product_id`),
  CONSTRAINT `fk_product_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── ORDERS ─────────────────────────────────────────────
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_number` VARCHAR(50) NOT NULL,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `status` ENUM('pending','awaiting_payment','paid','processing','shipped','delivered','completed','cancelled','refunded','failed','on_hold') DEFAULT 'pending',
  `subtotal` DECIMAL(12,2) NOT NULL,
  `shipping_cost` DECIMAL(12,2) DEFAULT 0.00,
  `discount` DECIMAL(12,2) DEFAULT 0.00,
  `total` DECIMAL(12,2) NOT NULL,
  `voucher_code` VARCHAR(50) DEFAULT NULL,
  `shipping_method` VARCHAR(100) DEFAULT NULL,
  `shipping_service` VARCHAR(100) DEFAULT NULL,
  `tracking_number` VARCHAR(100) DEFAULT NULL,
  `estimated_delivery` VARCHAR(100) DEFAULT NULL,
  `billing_address` JSON DEFAULT NULL,
  `shipping_address` JSON DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `billing_email` VARCHAR(255) DEFAULT NULL,
  `payment_method` VARCHAR(50) DEFAULT NULL,
  `payment_id` VARCHAR(255) DEFAULT NULL,
  `payment_url` VARCHAR(500) DEFAULT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `shipped_at` TIMESTAMP NULL DEFAULT NULL,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_number_idx` (`order_number`),
  KEY `orders_user_idx` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── ORDER ITEMS ────────────────────────────────────────
CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED DEFAULT NULL,
  `variant_id` BIGINT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(500) NOT NULL,
  `variant_name` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `quantity` INT NOT NULL,
  `weight` DECIMAL(8,2) DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_idx` (`order_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── REVIEWS ────────────────────────────────────────────
CREATE TABLE `reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `order_id` BIGINT UNSIGNED DEFAULT NULL,
  `rating` INT NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `content` TEXT DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `is_approved` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reviews_product_idx` (`product_id`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── WISHLIST ───────────────────────────────────────────
CREATE TABLE `wishlist` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wishlist_user_product_idx` (`user_id`,`product_id`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── VOUCHERS ───────────────────────────────────────────
CREATE TABLE `vouchers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `type` ENUM('percentage','fixed','free_shipping') NOT NULL,
  `value` DECIMAL(12,2) NOT NULL,
  `min_purchase` DECIMAL(12,2) DEFAULT NULL,
  `max_discount` DECIMAL(12,2) DEFAULT NULL,
  `usage_limit` INT DEFAULT NULL,
  `used_count` INT DEFAULT 0,
  `start_date` TIMESTAMP NULL DEFAULT NULL,
  `end_date` TIMESTAMP NULL DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vouchers_code_idx` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── BANNERS ────────────────────────────────────────────
CREATE TABLE `banners` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) DEFAULT NULL,
  `subtitle` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `product_image` VARCHAR(500) DEFAULT NULL,
  `link` VARCHAR(500) DEFAULT NULL,
  `position` ENUM('hero','promo','category') DEFAULT 'hero',
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `start_date` TIMESTAMP NULL DEFAULT NULL,
  `end_date` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── ARTICLES ───────────────────────────────────────────
CREATE TABLE `articles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `featured_image` VARCHAR(500) DEFAULT NULL,
  `author_id` BIGINT UNSIGNED DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `status` ENUM('draft','published','archived') DEFAULT 'draft',
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `articles_slug_idx` (`slug`(191)),
  CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── ARTICLE COMMENTS ───────────────────────────────────
CREATE TABLE `article_comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `author_name` VARCHAR(255) DEFAULT NULL,
  `author_email` VARCHAR(255) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `is_approved` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_article_comments_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── DOWNLOADS ──────────────────────────────────────────
CREATE TABLE `downloads` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `download_count` INT DEFAULT 0,
  `max_downloads` INT DEFAULT 5,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `last_download_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_downloads_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_downloads_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_downloads_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── RECENTLY VIEWED ────────────────────────────────────
CREATE TABLE `recently_viewed` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `session_id` VARCHAR(255) DEFAULT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `viewed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rv_user_product_idx` (`user_id`,`product_id`),
  CONSTRAINT `fk_rv_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── COMPARE LIST ───────────────────────────────────────
CREATE TABLE `compare_list` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `session_id` VARCHAR(255) DEFAULT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_compare_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── CAMPAIGNS ──────────────────────────────────────────
CREATE TABLE `campaigns` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('email','whatsapp','push','voucher') NOT NULL,
  `status` ENUM('draft','scheduled','running','paused','completed') DEFAULT 'draft',
  `subject` VARCHAR(255) DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `target_segment` JSON DEFAULT NULL,
  `scheduled_at` TIMESTAMP NULL DEFAULT NULL,
  `sent_count` INT DEFAULT 0,
  `open_count` INT DEFAULT 0,
  `click_count` INT DEFAULT 0,
  `created_by` BIGINT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── CUSTOMER SEGMENTS ──────────────────────────────────
CREATE TABLE `customer_segments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `criteria` JSON NOT NULL,
  `member_count` INT DEFAULT 0,
  `last_sync_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PIXEL EVENTS ───────────────────────────────────────
CREATE TABLE `pixel_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_name` VARCHAR(100) NOT NULL,
  `platform` ENUM('meta','tiktok','ga4') NOT NULL,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `session_id` VARCHAR(255) DEFAULT NULL,
  `event_data` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pixel_events_name_idx` (`event_name`,`platform`),
  KEY `pixel_events_date_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── SITE STATS ─────────────────────────────────────────
CREATE TABLE `site_stats` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(100) NOT NULL,
  `value` BIGINT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_stats_key_idx` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── SETTINGS ───────────────────────────────────────────
CREATE TABLE `settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(100) NOT NULL,
  `value` LONGTEXT DEFAULT NULL,
  `group` VARCHAR(50) DEFAULT 'general',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_idx` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── AUDIT LOG ──────────────────────────────────────────
CREATE TABLE `audit_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity` VARCHAR(100) DEFAULT NULL,
  `entity_id` BIGINT UNSIGNED DEFAULT NULL,
  `old_data` JSON DEFAULT NULL,
  `new_data` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── NOTIFICATIONS ──────────────────────────────────────
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT DEFAULT NULL,
  `type` ENUM('order','promo','system','review') DEFAULT 'system',
  `link` VARCHAR(500) DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `notifications_user_idx` (`user_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── MEDIA ──────────────────────────────────────────────
CREATE TABLE `media` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `file_type` VARCHAR(50) DEFAULT NULL,
  `file_size` INT DEFAULT NULL,
  `alt` VARCHAR(255) DEFAULT NULL,
  `uploaded_by` BIGINT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin User (password: admin123 — hashed with bcrypt)
INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `display_name`, `phone`, `role`) VALUES
('admin@benihseribuan.co.id', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNgAWi', 'Admin', 'BSB', 'Admin BSB', '081211882', 'admin');

-- Categories
INSERT INTO `categories` (`name`, `slug`, `description`, `icon`, `sort_order`) VALUES
('Benih Tanaman', 'benih-tanaman', 'Koleksi benih tanaman sayuran, buah, bunga, dan herbal berkualitas tinggi', '🌱', 1),
('Pupuk & Nutrisi', 'pupuk-nutrisi', 'Pupuk organik cair, NPK booster, dan nutrisi tanaman lengkap', '🧪', 2),
('Media Tanam & Alat Kebun', 'media-tanam-alat-kebun', 'Cocopeat, polybag, alat berkebun, dan perlengkapan lainnya', '🪴', 3),
('Paket Benih Hemat', 'paket-benih-hemat', 'Paket bundling benih sayuran hemat untuk pemula dan profesional', '📦', 4),
('Hidroponik', 'hidroponik', 'Perlengkapan dan benih untuk berkebun hidroponik', '💧', 5),
('Tabulampot', 'tabulampot', 'Benih dan perlengkapan tanaman buah dalam pot', '🍊', 6),
('Peralatan Berkebun', 'peralatan-berkebun', 'Gunting, sarung tangan, label, dan alat kebun lainnya', '✂️', 7);

-- Site Stats
INSERT INTO `site_stats` (`key`, `value`) VALUES
('total_customers', 5601),
('total_seeds_sold', 35000),
('total_variants', 140),
('provinces_covered', 34);

-- Settings
INSERT INTO `settings` (`key`, `value`, `group`) VALUES
('site_name', 'Benih Seribuan', 'general'),
('site_tagline', 'Solusi Kebun Rumah Tangga', 'general'),
('company_name', 'PT. Mutiara Benih Nusantara', 'general'),
('company_address', 'Dk. Tegalsari, Tegal Sari, Tambak, Kec. Mojosongo, Kabupaten Boyolali, Jawa Tengah', 'general'),
('company_phone', '081-211-8822', 'general'),
('company_email', 'info@benihseribu.com', 'general'),
('company_whatsapp', '62812118822', 'general'),
('social_facebook', 'https://www.facebook.com/benihseribu.official/', 'social'),
('social_linkedin', 'https://www.linkedin.com/company/benih-seribuan/', 'social'),
('social_whatsapp', 'https://wa.me/62812118822', 'social'),
('social_tiktok', 'https://www.tiktok.com/@benihseribuan', 'social'),
('social_instagram', 'https://www.instagram.com/benih.seribuan', 'social'),
('free_shipping_min', '75000', 'shipping'),
('currency', 'IDR', 'general');

-- Sample Voucher
INSERT INTO `vouchers` (`code`, `type`, `value`, `min_purchase`, `is_active`) VALUES
('WELCOME10', 'percentage', 10.00, 50000.00, 1),
('FREEONGKIR', 'free_shipping', 0.00, 75000.00, 1);

SET FOREIGN_KEY_CHECKS = 1;
