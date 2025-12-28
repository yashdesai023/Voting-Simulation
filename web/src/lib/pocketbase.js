import PocketBase from 'pocketbase';

// Connect to your local PocketBase instance
// If hosted remotely, replace this URL
export const pb = new PocketBase('http://3.149.240.100');

// Helper to get full image URL
export const getImageUrl = (collectionId, recordId, filename) => {
    if (!filename) return null;
    return `${pb.baseUrl}/api/files/${collectionId}/${recordId}/${filename}`;
};
