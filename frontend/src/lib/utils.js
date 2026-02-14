import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatChips(amount) {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
}

export function getCardSymbol(suit) {
  const symbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };
  return symbols[suit] || "";
}

export function getCardColor(suit) {
  return suit === "hearts" || suit === "diamonds"
    ? "text-red-600"
    : "text-gray-900";
}

/**
 * Extract a short, shareable code from a blockchain room ID
 * Takes the first 6 non-zero hex characters after 0x prefix
 * @param {string} roomId - The full room ID (bytes32 with 0x prefix)
 * @returns {string} - Short code like "a399e5"
 */
export function getShortRoomCode(roomId) {
  if (!roomId) return "";

  // Remove 0x prefix and get just the hex string
  const hex = roomId.startsWith("0x") ? roomId.slice(2) : roomId;

  // Find first non-zero character
  let chars = "";
  for (let i = 0; i < hex.length && chars.length < 6; i++) {
    if (hex[i] !== "0" || chars.length > 0) {
      chars += hex[i];
    }
  }

  // If we have at least 6 characters, return them uppercase
  if (chars.length >= 6) {
    return chars.slice(0, 6).toUpperCase();
  }

  // Fallback: if roomId is all zeros or very short, use last 6 chars
  return hex.slice(-6).toUpperCase();
}

/**
 * Format a long blockchain room ID to show the short code
 * @param {string} roomId - The full room ID (typically 32 bytes/66 characters with 0x prefix)
 * @returns {string} - Formatted room ID like "A399E5"
 */
export function formatRoomId(roomId) {
  if (!roomId) return "";
  if (roomId.length <= 10) return roomId;
  return getShortRoomCode(roomId);
}

/**
 * Expand a short room code to search pattern for matching full room IDs
 * @param {string} shortCode - Short code like "a399e5"
 * @returns {string} - Search pattern
 */
export function expandShortCode(shortCode) {
  if (!shortCode) return "";
  // Remove any spaces or special characters
  const clean = shortCode.replace(/[^a-fA-F0-9]/g, "").toLowerCase();
  return clean;
}
