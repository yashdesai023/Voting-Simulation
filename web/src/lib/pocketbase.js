import PocketBase from 'pocketbase';

// Connect to PocketBase
// We ALWAYS use '/' (relative path) to leverage the Proxy (Vite in Dev, Netlify in Prod)
// This avoids Mixed Content errors (HTTPS -> HTTP) by routing everything through the same origin.
const url = '/';
export const pb = new PocketBase(url);

// Helper to get full image URL
export const getImageUrl = (collectionId, recordId, filename, options = {}) => {
    if (!filename) return null;
    let base = pb.baseUrl;
    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }
    let url = `${base}/api/files/${collectionId}/${recordId}/${filename}`;
    // Add Thumb parameter if provided (e.g., '100x100')
    if (options.thumb) {
        url += `?thumb=${options.thumb}`;
    }
    return url;
};
