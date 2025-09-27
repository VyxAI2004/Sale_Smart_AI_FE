/**
 * Utility functions for avatar handling
 */

// Predefined colors for avatar backgrounds
const AVATAR_COLORS = [
  'bg-red-100 text-red-800',
  'bg-blue-100 text-blue-800', 
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
  'bg-cyan-100 text-cyan-800',
];

/**
 * Get avatar initials from a name
 * Takes the last character of the name for a cleaner look
 */
export function getAvatarInitials(name: string): string {
  if (!name) return '?';
  
  const trimmedName = name.trim();
  if (!trimmedName) return '?';
  
  // Get the last character of the name
  return trimmedName.charAt(trimmedName.length - 1).toUpperCase();
}

/**
 * Get consistent color class for avatar based on name
 * Uses a simple hash function to ensure same name always gets same color
 */
export function getAvatarColorClass(name: string): string {
  if (!name) return AVATAR_COLORS[0];
  
  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Combined utility to get both initials and color class
 */
export function getAvatarProps(name: string) {
  return {
    initials: getAvatarInitials(name),
    colorClass: getAvatarColorClass(name),
  };
}