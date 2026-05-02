import {
  mysqlTable, bigint, varchar, text, longtext, boolean, int, decimal,
  timestamp, mysqlEnum, json, index, uniqueIndex,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

// ─── USERS ──────────────────────────────────────────────
export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }),
  displayName: varchar('display_name', { length: 150 }),
  phone: varchar('phone', { length: 20 }),
  avatar: varchar('avatar', { length: 500 }),
  role: mysqlEnum('role', ['customer', 'admin', 'editor']).default('customer'),
  provider: mysqlEnum('provider', ['credentials', 'google']).default('credentials'),
  providerId: varchar('provider_id', { length: 255 }),
  emailVerified: timestamp('email_verified'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (t) => ({
  emailIdx: uniqueIndex('users_email_idx').on(t.email),
}))

// ─── ADDRESSES ──────────────────────────────────────────
export const addresses = mysqlTable('addresses', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: mysqlEnum('type', ['billing', 'shipping']).default('shipping'),
  label: varchar('label', { length: 100 }),
  recipientName: varchar('recipient_name', { length: 150 }),
  phone: varchar('phone', { length: 20 }),
  province: varchar('province', { length: 100 }),
  provinceId: int('province_id'),
  city: varchar('city', { length: 100 }),
  cityId: int('city_id'),
  district: varchar('district', { length: 100 }),
  postalCode: varchar('postal_code', { length: 10 }),
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

// ─── CATEGORIES ─────────────────────────────────────────
export const categories = mysqlTable('categories', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  icon: varchar('icon', { length: 100 }),
  parentId: bigint('parent_id', { mode: 'number', unsigned: true }),
  sortOrder: int('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  slugIdx: uniqueIndex('categories_slug_idx').on(t.slug),
}))

// ─── PRODUCTS ───────────────────────────────────────────
export const products = mysqlTable('products', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  name: varchar('name', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull(),
  description: longtext('description'),
  shortDescription: text('short_description'),
  sku: varchar('sku', { length: 100 }),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 12, scale: 2 }),
  stock: int('stock').default(0),
  weight: decimal('weight', { precision: 8, scale: 2 }).default('0'),
  categoryId: bigint('category_id', { mode: 'number', unsigned: true }).references(() => categories.id),
  brand: varchar('brand', { length: 150 }).default('Benih Seribuan'),
  isFeatured: boolean('is_featured').default(false),
  isActive: boolean('is_active').default(true),
  isDigital: boolean('is_digital').default(false),
  downloadFileUrl: varchar('download_file_url', { length: 500 }),
  estimatedDelivery: varchar('estimated_delivery', { length: 100 }),
  compareAttributes: json('compare_attributes'),
  ratingAvg: decimal('rating_avg', { precision: 3, scale: 2 }).default('0'),
  ratingCount: int('rating_count').default(0),
  viewCount: int('view_count').default(0),
  soldCount: int('sold_count').default(0),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (t) => ({
  slugIdx: uniqueIndex('products_slug_idx').on(t.slug),
  categoryIdx: index('products_category_idx').on(t.categoryId),
}))

// ─── PRODUCT IMAGES ─────────────────────────────────────
export const productImages = mysqlTable('product_images', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  productId: bigint('product_id', { mode: 'number', unsigned: true }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 500 }).notNull(),
  alt: varchar('alt', { length: 255 }),
  sortOrder: int('sort_order').default(0),
})

// ─── PRODUCT VARIANTS ───────────────────────────────────
export const productVariants = mysqlTable('product_variants', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  productId: bigint('product_id', { mode: 'number', unsigned: true }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 12, scale: 2 }),
  stock: int('stock').default(0),
  sku: varchar('sku', { length: 100 }),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  isActive: boolean('is_active').default(true),
})

// ─── ORDERS ─────────────────────────────────────────────
export const orders = mysqlTable('orders', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => users.id),
  status: mysqlEnum('status', [
    'pending', 'awaiting_payment', 'paid', 'processing',
    'shipped', 'delivered', 'completed', 'cancelled', 'refunded', 'failed', 'on_hold'
  ]).default('pending'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  shippingCost: decimal('shipping_cost', { precision: 12, scale: 2 }).default('0'),
  discount: decimal('discount', { precision: 12, scale: 2 }).default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  voucherCode: varchar('voucher_code', { length: 50 }),
  shippingMethod: varchar('shipping_method', { length: 100 }),
  shippingService: varchar('shipping_service', { length: 100 }),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  estimatedDelivery: varchar('estimated_delivery', { length: 100 }),
  billingAddress: json('billing_address'),
  shippingAddress: json('shipping_address'),
  notes: text('notes'),
  billingEmail: varchar('billing_email', { length: 255 }),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentId: varchar('payment_id', { length: 255 }),
  paymentUrl: varchar('payment_url', { length: 500 }),
  paidAt: timestamp('paid_at'),
  shippedAt: timestamp('shipped_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (t) => ({
  orderNumberIdx: uniqueIndex('orders_number_idx').on(t.orderNumber),
  userIdx: index('orders_user_idx').on(t.userId),
}))

// ─── ORDER ITEMS ────────────────────────────────────────
export const orderItems = mysqlTable('order_items', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  orderId: bigint('order_id', { mode: 'number', unsigned: true }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: bigint('product_id', { mode: 'number', unsigned: true }).references(() => products.id),
  variantId: bigint('variant_id', { mode: 'number', unsigned: true }),
  name: varchar('name', { length: 500 }).notNull(),
  variantName: varchar('variant_name', { length: 255 }),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  quantity: int('quantity').notNull(),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  image: varchar('image', { length: 500 }),
})

// ─── REVIEWS ────────────────────────────────────────────
export const reviews = mysqlTable('reviews', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  productId: bigint('product_id', { mode: 'number', unsigned: true }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => users.id),
  orderId: bigint('order_id', { mode: 'number', unsigned: true }),
  rating: int('rating').notNull(),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  images: json('images'),
  isApproved: boolean('is_approved').default(false),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// ─── WISHLIST ───────────────────────────────────────────
export const wishlist = mysqlTable('wishlist', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: bigint('product_id', { mode: 'number', unsigned: true }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  userProductIdx: uniqueIndex('wishlist_user_product_idx').on(t.userId, t.productId),
}))

// ─── VOUCHERS ───────────────────────────────────────────
export const vouchers = mysqlTable('vouchers', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  code: varchar('code', { length: 50 }).notNull(),
  type: mysqlEnum('type', ['percentage', 'fixed', 'free_shipping']).notNull(),
  value: decimal('value', { precision: 12, scale: 2 }).notNull(),
  minPurchase: decimal('min_purchase', { precision: 12, scale: 2 }),
  maxDiscount: decimal('max_discount', { precision: 12, scale: 2 }),
  usageLimit: int('usage_limit'),
  usedCount: int('used_count').default(0),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  codeIdx: uniqueIndex('vouchers_code_idx').on(t.code),
}))

// ─── BANNERS ────────────────────────────────────────────
export const banners = mysqlTable('banners', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }),
  subtitle: text('subtitle'),
  image: varchar('image', { length: 500 }),
  productImage: varchar('product_image', { length: 500 }),
  link: varchar('link', { length: 500 }),
  position: mysqlEnum('position', ['hero', 'promo', 'category']).default('hero'),
  sortOrder: int('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ─── ARTICLES ───────────────────────────────────────────
export const articles = mysqlTable('articles', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull(),
  content: longtext('content'),
  excerpt: text('excerpt'),
  featuredImage: varchar('featured_image', { length: 500 }),
  authorId: bigint('author_id', { mode: 'number', unsigned: true }).references(() => users.id),
  tags: json('tags'),
  status: mysqlEnum('status', ['draft', 'published', 'archived']).default('draft'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (t) => ({
  slugIdx: uniqueIndex('articles_slug_idx').on(t.slug),
}))

// ─── ARTICLE COMMENTS ───────────────────────────────────
export const articleComments = mysqlTable('article_comments', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  articleId: bigint('article_id', { mode: 'number', unsigned: true }).notNull().references(() => articles.id, { onDelete: 'cascade' }),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => users.id),
  authorName: varchar('author_name', { length: 255 }),
  authorEmail: varchar('author_email', { length: 255 }),
  content: text('content').notNull(),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// ─── DOWNLOADS ──────────────────────────────────────────
export const downloads = mysqlTable('downloads', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  productId: bigint('product_id', { mode: 'number', unsigned: true }).notNull().references(() => products.id),
  orderId: bigint('order_id', { mode: 'number', unsigned: true }).notNull().references(() => orders.id),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull().references(() => users.id),
  fileUrl: varchar('file_url', { length: 500 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  downloadCount: int('download_count').default(0),
  maxDownloads: int('max_downloads').default(5),
  expiresAt: timestamp('expires_at'),
  lastDownloadAt: timestamp('last_download_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ─── RECENTLY VIEWED ────────────────────────────────────
export const recentlyViewed = mysqlTable('recently_viewed', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 255 }),
  productId: bigint('product_id', { mode: 'number', unsigned: true }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at').defaultNow(),
}, (t) => ({
  userProductIdx: index('rv_user_product_idx').on(t.userId, t.productId),
}))

// ─── COMPARE LIST ───────────────────────────────────────
export const compareList = mysqlTable('compare_list', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 255 }),
  productId: bigint('product_id', { mode: 'number', unsigned: true }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow(),
})

// ─── CAMPAIGNS ──────────────────────────────────────────
export const campaigns = mysqlTable('campaigns', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['email', 'whatsapp', 'push', 'voucher']).notNull(),
  status: mysqlEnum('status', ['draft', 'scheduled', 'running', 'paused', 'completed']).default('draft'),
  subject: varchar('subject', { length: 255 }),
  content: longtext('content').notNull(),
  targetSegment: json('target_segment'),
  scheduledAt: timestamp('scheduled_at'),
  sentCount: int('sent_count').default(0),
  openCount: int('open_count').default(0),
  clickCount: int('click_count').default(0),
  createdBy: bigint('created_by', { mode: 'number', unsigned: true }).references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

// ─── CUSTOMER SEGMENTS ──────────────────────────────────
export const customerSegments = mysqlTable('customer_segments', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  criteria: json('criteria').notNull(),
  memberCount: int('member_count').default(0),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

// ─── PIXEL EVENTS ───────────────────────────────────────
export const pixelEvents = mysqlTable('pixel_events', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  eventName: varchar('event_name', { length: 100 }).notNull(),
  platform: mysqlEnum('platform', ['meta', 'tiktok', 'ga4']).notNull(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }),
  sessionId: varchar('session_id', { length: 255 }),
  eventData: json('event_data'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  eventIdx: index('pixel_events_name_idx').on(t.eventName, t.platform),
  dateIdx: index('pixel_events_date_idx').on(t.createdAt),
}))

// ─── SITE STATS ─────────────────────────────────────────
export const siteStats = mysqlTable('site_stats', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  key: varchar('key', { length: 100 }).notNull(),
  value: bigint('value', { mode: 'number' }).default(0),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (t) => ({
  keyIdx: uniqueIndex('site_stats_key_idx').on(t.key),
}))

// ─── SETTINGS ───────────────────────────────────────────
export const settings = mysqlTable('settings', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  key: varchar('key', { length: 100 }).notNull(),
  value: longtext('value'),
  group: varchar('group', { length: 50 }).default('general'),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (t) => ({
  keyIdx: uniqueIndex('settings_key_idx').on(t.key),
}))

// ─── AUDIT LOG ──────────────────────────────────────────
export const auditLog = mysqlTable('audit_log', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entity: varchar('entity', { length: 100 }),
  entityId: bigint('entity_id', { mode: 'number', unsigned: true }),
  oldData: json('old_data'),
  newData: json('new_data'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow(),
})

// ─── NOTIFICATIONS ──────────────────────────────────────
export const notifications = mysqlTable('notifications', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  type: mysqlEnum('type', ['order', 'promo', 'system', 'review']).default('system'),
  link: varchar('link', { length: 500 }),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// ─── MEDIA ──────────────────────────────────────────────
export const media = mysqlTable('media', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: varchar('file_url', { length: 500 }).notNull(),
  fileType: varchar('file_type', { length: 50 }),
  fileSize: int('file_size'),
  alt: varchar('alt', { length: 255 }),
  uploadedBy: bigint('uploaded_by', { mode: 'number', unsigned: true }).references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
})

// ─── RELATIONS ──────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  wishlistItems: many(wishlist),
  notifications: many(notifications),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  variants: many(productVariants),
  reviews: many(reviews),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}))

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
  comments: many(articleComments),
}))
