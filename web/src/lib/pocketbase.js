import PocketBase from 'pocketbase';

// Connect to your local PocketBase instance
// If hosted remotely, replace this URL or use VITE_POCKETBASE_URL in .env
const url = import.meta.env.VITE_POCKETBASE_URL || '/';
export const pb = new PocketBase(url);

// Helper to get full image URL
export const getImageUrl = (collectionId, recordId, filename) => {
    if (!filename) return null;
    let base = pb.baseUrl;
    if (base.endsWith('/')) {
        base = base.slice(0, -1); // Remove trailing slash
    }
    return `${base}/api/files/${collectionId}/${recordId}/${filename}`;
};
