import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';

const WardContext = createContext();

export const useWard = () => useContext(WardContext);

export const WardProvider = ({ children }) => {
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all Wards
    const fetchWards = async () => {
        try {
            const records = await pb.collection('wards').getFullList({
                sort: '-created',
                requestKey: null // Disable auto-cancellation
            });

            // We need to fetch candidates for these wards to maintain our structure
            // Or we key by ward ID.
            // For simplicity in this demo, let's fetch candidates on-demand or mapping?
            // Let's attach a 'candidates' object to each ward for UI compat.

            setWards(records.map(r => ({ ...r, candidates: {} })));
        } catch (err) {
            if (err.isAbort) return; // Ignore cancellations
            console.error("Error fetching wards:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWards();
    }, []);

    // Get full Ward with Candidates by ID or Code
    const getWard = async (idOrCode) => {
        try {
            let ward = null;
            // Try fetching by ID first (Record IDs are 15 chars)
            if (idOrCode.length === 15) {
                try {
                    ward = await pb.collection('wards').getOne(idOrCode, { requestKey: null });
                } catch (e) { /* Ignore and try code */ }
            }

            // If not found by ID, try Code
            if (!ward) {
                const list = await pb.collection('wards').getList(1, 1, {
                    filter: `code="${idOrCode}"`,
                    requestKey: null
                });
                if (list.items.length > 0) ward = list.items[0];
            }

            if (!ward) return null;

            // Fetch candidates for this ward
            const candidatesList = await pb.collection('candidates').getFullList({
                filter: `ward="${ward.id}"`,
                requestKey: null // Disable auto-cancellation
            });

            const candidatesMap = {};
            candidatesList.forEach(c => {
                candidatesMap[c.unitIndex] = {
                    id: c.id,
                    index: c.serialIndex, // Visual index
                    name: c.name,
                    marathiName: c.marathi_name, // Map explicit field
                    symbol: c.symbol, // Filename
                    photo: c.photo, // Filename
                    hasPhoto: c.hasPhoto,
                    collectionId: c.collectionId,
                    recordId: c.id
                };
            });

            return { ...ward, candidates: candidatesMap };
        } catch (err) {
            console.error("Error fetching ward details:", err);
            return null;
        }
    };

    const addWard = async (wardData) => {
        try {
            // Do NOT manually set ID. Let PB generate it.
            await pb.collection('wards').create(wardData);
            await fetchWards(); // Refresh list
        } catch (err) {
            console.error("Error creating ward:", err);
            alert("Failed to create ward. Check console.");
        }
    };

    const updateWard = async (id, updatedData) => {
        try {
            await pb.collection('wards').update(id, updatedData);
            // Optimistic update or refresh? Refresh is safer.
            await fetchWards();
        } catch (err) {
            console.error("Error updating ward:", err);
            throw err; // Propagate error to component
        }
    };

    // Create or Update Candidate
    const saveCandidate = async (wardId, unitIndex, data) => {
        try {
            let recordId = null;
            let finalData = data;

            // Check if data is FormData
            if (data instanceof FormData) {
                recordId = data.get('id');
                // Ensure required fields are present in FormData
                if (!data.has('ward')) data.append('ward', wardId);
                if (!data.has('unitIndex')) data.append('unitIndex', unitIndex);
            } else {
                recordId = data.id;
                finalData = { ...data, ward: wardId, unitIndex };
            }

            if (recordId) {
                return await pb.collection('candidates').update(recordId, finalData);
            } else {
                return await pb.collection('candidates').create(finalData);
            }
        } catch (err) {
            console.error("Error saving candidate:", err);
            throw err;
        }
    };

    return (
        <WardContext.Provider value={{ wards, loading, addWard, updateWard, getWard, saveCandidate }}>
            {children}
        </WardContext.Provider>
    );
};
