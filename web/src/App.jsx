import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { getImageUrl } from './lib/pocketbase';
import './App.css';
import Header from './components/Header';
import BallotUnit from './components/BallotUnit';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import AddWard from './admin/pages/AddWard';
import ManageWard from './admin/pages/ManageWard';
import Login from './admin/pages/Login';
import { WardProvider, useWard } from './context/WardContext';
import { translations } from './utils/translations';
import { playSuccessBeep, playVoteSuccessAudio } from './utils/audio';

import ElectionInfoCard from './components/ElectionInfoCard';
import CompletionCard from './components/CompletionCard';

// Logic for the Voting Interface (Consumer View)
const VotingApp = () => {
  const { wardId } = useParams(); // Changed from wardCode
  const { getWard } = useWard();
  const [wardData, setWardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState('mr');
  const [votedSerial, setVotedSerial] = useState(null);
  const [votedCandidate, setVotedCandidate] = useState(null); // Track who was voted for
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [isProcessComplete, setIsProcessComplete] = useState(false);

  useEffect(() => {
    if (wardId) {
      // Fetch by ID directly
      // Note: consume the promise properly in useEffect or use IIFE
      const load = async () => {
        try {
          const data = await getWard(wardId);
          if (data) {
            console.log("Ward Data Loaded:", data); // Debugging
            if (data.status === 'Active') {
              setWardData(data);
            }
          }
        } catch (error) {
          console.error("Failed to load ward:", error);
        } finally {
          setLoading(false);
        }
      };
      load();
    } else {
      setLoading(false);
    }
  }, [wardId, getWard]);

  // Preload Images for Instant Display
  useEffect(() => {
    if (wardData && wardData.candidates) {
      Object.values(wardData.candidates).forEach(c => {
        if (c.symbol) {
          const img = new Image();
          img.src = getImageUrl(c.collectionId, c.recordId, c.symbol);
        }
        if (c.photo) {
          const img = new Image();
          img.src = getImageUrl(c.collectionId, c.recordId, c.photo);
        }
      });
      // Also preload branding
      if (wardData.last_photo) {
        const img = new Image();
        img.src = getImageUrl(wardData.collectionId, wardData.id, wardData.last_photo);
      }
    }
  }, [wardData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f3f4f6' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading Ballot Unit...</div>
      </div>
    );
  }

  // If no ward found or inactive
  if (!wardData && wardId) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
        <h2>Voting not available</h2>
        <p>The ward ID "{wardId}" is either invalid or not currently active.</p>
      </div>
    );
  }



  if (!wardId) return <Navigate to="/admin" />;

  const activeCandidates = wardData.candidates || {};

  // Custom Generator using Admin Data
  const generateCandidates = (startId, count, unitIndex) => {
    // Check if this unit has an assigned candidate from Admin
    const assigned = activeCandidates[unitIndex];

    let activeRowIndex = -1;
    if (assigned && assigned.index) {
      activeRowIndex = assigned.index - 1;
    }

    return Array.from({ length: count }, (_, i) => {
      const isVisible = i === activeRowIndex;

      let symbolUrl = "";
      let photoUrl = "";

      if (isVisible && assigned) {
        symbolUrl = getImageUrl(assigned.collectionId, assigned.recordId, assigned.symbol);
        photoUrl = getImageUrl(assigned.collectionId, assigned.recordId, assigned.photo);
      }

      return {
        name: isVisible ? assigned.name : "",
        marathiName: isVisible ? (assigned.name_marathi || assigned.marathiName) : "",
        symbol: symbolUrl,
        photo: photoUrl,
        hasPhoto: isVisible ? assigned.hasPhoto : false
      };
    });
  };

  const handleVote = (serialNo) => {
    if (votedSerial !== null) return;

    // SerialNo is now always 1-16 (relative to unit). 
    // We don't need absolute serial for logic here, just for logging/tracking.
    console.log(`Voted for Serial No: ${serialNo} in Unit ${currentUnitIndex + 1}`);
    setVotedSerial(serialNo);

    // Track voted candidate details for summary
    const assigned = activeCandidates[currentUnitIndex];
    if (assigned && assigned.index === (serialNo)) { // SerialNo matches index directly (1-based)
      setVotedCandidate(assigned);
    }

    // Beep timing adjustments
    const totalUnits = parseInt(wardData.ballotCount);
    const isLastUnit = currentUnitIndex >= totalUnits - 1;

    setTimeout(() => {
      setVotedSerial(null);

      if (isLastUnit) {
        playSuccessBeep(); // Play Beep Sound

        // Play Voice Message after a short delay (e.g. 1.5s after beep starts)
        setTimeout(() => {
          playVoteSuccessAudio(language);
        }, 1500);

        setIsProcessComplete(true);
      } else {
        setCurrentUnitIndex(prev => prev + 1);
      }
    }, isLastUnit ? 800 : 2000); // Faster finish (800ms instead of 2000ms) for last unit to make beep 'early'
  };

  const renderContent = () => {
    if (isProcessComplete) {
      return (
        <CompletionCard
          ward={wardData}
          language={language}
          votedCandidate={votedCandidate}
          allCandidates={activeCandidates} // Pass all candidates
        />
      );
    }

    const candidatesPerUnit = 16;
    // Always start serial from 1 for every unit
    const startSerial = 1;
    const candidates = generateCandidates(startSerial, candidatesPerUnit, currentUnitIndex);

    // Determine candidate name to show in Promo Card
    const assigned = activeCandidates[currentUnitIndex];
    const displayCandidateName = assigned ? (language === 'mr' || language === 'hi' ? (assigned.marathiName || assigned.name) : assigned.name) : null;

    // Determine Unit Branding (Color & Label)
    const getUnitBranding = (index) => {
      const brands = [
        { en: 'A', mr: 'अ', color: '#e5e7eb' }, // Default Grey/White
        { en: 'B', mr: 'ब', color: '#fca5a5' }, // Pinkish (Red 300)
        { en: 'C', mr: 'क', color: '#fef08a' }, // Yellowish (Yellow 200)
        { en: 'D', mr: 'ड', color: '#bae6fd' }  // Blueish (Sky 200)
      ];
      const brand = brands[index] || brands[0];
      const label = (language === 'mr' || language === 'hi') ? brand.mr : brand.en;
      return { label, color: brand.color };
    };

    const { label: unitLabel, color: headerColor } = getUnitBranding(currentUnitIndex);

    return (
      <>
        <ElectionInfoCard
          ward={wardData}
          candidateName={displayCandidateName}
          language={language}
        />
        <BallotUnit
          key={currentUnitIndex}
          unitIndex={currentUnitIndex}
          startSerialNo={startSerial}
          language={language}
          candidates={candidates}
          onVote={handleVote}
          votedSerialNo={votedSerial}
          unitLabel={unitLabel}
          headerColor={headerColor}
        />
      </>
    );
  };

  const handleShare = async () => {
    const t = translations[language] || translations['en'];
    // Determine Name (English vs Marathi)
    const isLocalLang = language === 'mr' || language === 'hi';
    const wardDisplayName = (isLocalLang && wardData?.name_marathi) ? wardData.name_marathi : (wardData?.name || "N/A");

    // Determine candidate name to show (copied logic)
    const assigned = activeCandidates[currentUnitIndex];
    const displayCandidateName = assigned ? (isLocalLang ? (assigned.marathiName || assigned.name) : assigned.name) : t.candidateNamePlaceholder;

    const shareText = `
${t.shareHeader}

${t.shareCandidateLabel}: ${displayCandidateName}
${t.shareWardLabel}: ${wardDisplayName}

${t.shareDateLabel}: ${t.electionDateValue}
${t.shareTimeLabel}: ${t.votingTime}

${t.slogan}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Election - ${wardDisplayName}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <Header
        language={language}
        setLanguage={setLanguage}
        ward={wardData}
        onShare={handleShare}
      />
      <div className="app-container">
        <main className="units-container">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

function App() {
  return (
    <WardProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Auth */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-ward" element={<AddWard />} />
            <Route path="manage/:wardId" element={<ManageWard />} />
          </Route>

          {/* Public Voting Route */}
          <Route path="/:wardId" element={<VotingApp />} />

          {/* Default Redirect: Go to Admin if root is accessed without code */}
          <Route path="/" element={<Navigate to="/admin" />} />
        </Routes>
      </BrowserRouter>
    </WardProvider>
  );
}

export default App;
