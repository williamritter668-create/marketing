const { pgTable, serial, text, integer, timestamp, boolean, json } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(), // Made nullable for phone-only users
  phone: text('phone').unique(), // Added phone support
  password: text('password'), // Nullable for Google Auth users
  role: text('role').default('CLIENT'), // 'CLIENT' or 'ADMIN'
  credits: integer('credits').default(0), // Image Credits
  postCredits: integer('post_credits').default(0), // Post/Copywriting Credits
  currentPlan: text('current_plan').default('Free'), // Free, Basic, Pro, Elite
  planExpiresAt: timestamp('plan_expires_at'), // Expiration date for the plan
  createdAt: timestamp('created_at').defaultNow(),
});

const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  plan: text('plan').notNull(),
  amount: integer('amount').notNull(),
  receiptImage: text('receipt_image'),
  status: text('status').default('PENDING'), // 'PENDING', 'APPROVED', 'REJECTED'
  createdAt: timestamp('created_at').defaultNow(),
});

const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  prompt: text('prompt'),
  platform: text('platform'),
  status: text('status').default('COMPLETED'),
  createdAt: timestamp('created_at').defaultNow(),
});

const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Recipient
  type: text('type').notNull(), // 'INFO', 'SUCCESS', 'WARNING', 'ADMIN_ALERT'
  title: text('title'),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

const user_sessions = pgTable('user_sessions', {
  sid: text('sid').primaryKey(),
  sess: json('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

module.exports = { users, subscriptions, projects, notifications, user_sessions };


