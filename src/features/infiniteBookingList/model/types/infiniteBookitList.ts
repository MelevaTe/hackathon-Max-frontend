import type { BookingActive } from "@/entities/BookingActive";
import type { BookingHistory } from "@/entities/BookingHistory";

export type BookingType = "active" | "history";

export type BookingItem = BookingActive | BookingHistory;
