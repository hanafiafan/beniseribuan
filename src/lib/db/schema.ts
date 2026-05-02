import {
  pgTable, serial, varchar, text, boolean, integer, decimal,
  timestamp, pgEnum, jsonb, index, uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── AUTH ENUMS ──────────────────────────────────────────
export const roleEnum = pgEnum('role', ['customer', 'admin', 'editor'])
export const providerEnum = pgEnum('provider', ['credentials', 'google'])

// ─── USERS (Better Auth compatible) ──────────────────────
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  // Custom fields
  role: roleEnum('role').default('customer'),
  phone: varchar('phone', { length: 20 }),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

// ─── ADDRESSES ──────────────────────────────────────────
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').default('shipping'), // shipping, billing
  label: varchar('label', { length: 100 }),
  recipientName: varchar('recipient_name', { length: 150 }),
  phone: varchar('phone', { length: 20 }),
  province: varchar('province', { length: 100 }),
  provinceId: integer('province_id'),
  city: varchar('city', { length: 100 }),
  cityId: integer('city_id'),
  district: varchar('district', { length: 100 }),
  village: varchar('village', { length: 100 }),
  postalCode: varchar('postal_code', { length: 10 }),
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ─── CATEGORIES ─────────────────────────────────────────
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  icon: varchar('icon', { length: 100 }),
  parentId: integer('parent_id'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// ─── PRODUCTS ───────────────────────────────────────────
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  description: text('description'),
  shortDescription: text('short_description'),
  sku: varchar('sku', { length: 100 }),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 12, scale: 2 }),
  stock: integer('stock').default(0),
  weight: decimal('weight', { precision: 8, scale: 2 }).default('0'),
  categoryId: integer('category_id').references(() => categories.id),
  brand: varchar('brand', { length: 150 }).default('Benih Seribuan'),
  isFeatured: boolean('is_featured').default(false),
  isActive: boolean('is_active').default(true),
  isDigital: boolean('is_digital').default(false),
  downloadFileUrl: varchar('download_file_url', { length: 500 }),
  compareAttributes: jsonb('compare_attributes'),
  ratingAvg: decimal('rating_avg', { precision: 3, scale: 2 }).default('0'),
  ratingCount: integer('rating_count').default(0),
  soldCount: integer('sold_count').default(0),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ─── ORDERS ─────────────────────────────────────────────
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'awaiting_payment', 'paid', 'processing',
  'shipped', 'delivered', 'completed', 'cancelled', 'refunded', 'failed', 'on_hold'
])

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: text('user_id').references(() => user.id),
  status: orderStatusEnum('status').default('pending'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  shippingCost: decimal('shipping_cost', { precision: 12, scale: 2 }).default('0'),
  discount: decimal('discount', { precision: 12, scale: 2 }).default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  voucherCode: varchar('voucher_code', { length: 50 }),
  shippingMethod: varchar('shipping_method', { length: 100 }),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  shippingAddress: jsonb('shipping_address'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentId: varchar('payment_id', { length: 255 }),
  paymentUrl: varchar('payment_url', { length: 500 }),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ─── ORDER ITEMS ────────────────────────────────────────
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('product_id').references(() => products.id),
  name: varchar('name', { length: 500 }).notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  image: varchar('image', { length: 500 }),
})

// ─── RELATIONS ──────────────────────────────────────────
export const userRelations = relations(user, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, { fields: [orders.userId], references: [user.id] }),
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}))
