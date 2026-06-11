import { pgTable, uuid, text, timestamp, numeric, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  monthlyIncome: numeric("monthly_income", { precision: 12, scale: 2 }).default("0"),
  existingLiability: numeric("existing_liability", { precision: 12, scale: 2 }).default("0"),
  allocationLiability: numeric("allocation_liability", { precision: 12, scale: 2 }).default("0"),
  allocationInvest: numeric("allocation_invest", { precision: 12, scale: 2 }).default("0"),
  allocationExpense: numeric("allocation_expense", { precision: 12, scale: 2 }).default("0"),
  isSetup: text("is_setup").default("false"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: varchar("date", { length: 10 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
