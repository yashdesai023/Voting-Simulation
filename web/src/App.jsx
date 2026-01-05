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
import { smoothScrollTo } from './utils/scroll'; // Import custom scroll

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
  const [activeMachineId, setActiveMachineId] = useState(1); // Added missing state
  const [isProcessComplete, setIsProcessComplete] = useState(false);
  const [visibleUnitIndex, setVisibleUnitIndex] = useState(0); // Track visible section

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

  const activeCandidates = wardData?.candidates || {};

  // Logic to distinguish valid vs blocked sections
  // This definition is now correctly placed after activeCandidates
  const isSectionValid = (adminUnitIndex) => !!activeCandidates[adminUnitIndex];

  // Find first valid section on load/update
  useEffect(() => {
    if (!wardData) return;
    // If currentUnitIndex is pointing to an empty section, move to next valid
    if (!activeCandidates[currentUnitIndex]) {
      // Find next valid
      let nextValid = -1;
      for (let i = currentUnitIndex; i < SECTIONS_CONFIG.length; i++) {
        if (activeCandidates[i]) {
          nextValid = i;
          break;
        }
      }
      // If valid found, jump there
      if (nextValid !== -1 && nextValid !== currentUnitIndex) {
        setCurrentUnitIndex(nextValid);
        // Also ensure activeMachineId matches the new section
        const targetMachine = SECTIONS_CONFIG[nextValid].machineId;
        if (targetMachine !== activeMachineId) {
          setActiveMachineId(targetMachine);
        }
      }
    }
  }, [wardData, currentUnitIndex, activeCandidates, activeMachineId]);

  // Scroll to Top on Machine Change or Completion
  useEffect(() => {
    // Custom smooth scroll to top over 1500ms
    smoothScrollTo(0, 1500);
  }, [activeMachineId, isProcessComplete]);

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
      const isNOTA = i === 6; // 7th slot (0-indexed)

      if (isNOTA) {
        return {
          name: "None of the Above",
          marathiName: "नोटा",
          symbol: "",
          photo: "",
          hasPhoto: false,
          isDisabled: true, // Disable NOTA as requested
          isNOTA: true
        };
      }

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



  const handleVote = (serialNo, unitIdx) => {
    if (votedSerial !== null) return;

    console.log(`Voted for Serial No: ${serialNo} in Section Index ${unitIdx}`);
    setVotedSerial(serialNo);
    setCurrentUnitIndex(unitIdx);

    const assigned = activeCandidates[unitIdx];
    if (assigned && assigned.index === (serialNo)) {
      setVotedCandidate(assigned);
    }

    // Determine Next Step
    // Find next VALID section index
    let nextValidIndex = -1;
    for (let i = unitIdx + 1; i < SECTIONS_CONFIG.length; i++) {
      if (activeCandidates[i]) {
        nextValidIndex = i;
        break;
      }
    }

    const isLastValidSection = nextValidIndex === -1; // No more sections with candidates

    setTimeout(() => {
      if (isLastValidSection) {
        setVotedSerial(null);
        playSuccessBeep();
        setTimeout(() => {
          playVoteSuccessAudio(language);
        }, 1500);
        setIsProcessComplete(true);
      } else {
        // Move to next valid section
        setVotedSerial(null);
        setCurrentUnitIndex(nextValidIndex);

        // Switch machine if needed
        const nextMachineId = SECTIONS_CONFIG[nextValidIndex].machineId;
        if (nextMachineId !== activeMachineId) {
          // Delay slightly for effect or immediate?
          // User said "Active blocked... automatically scrolled"
          // Let's do it immediately after the vote delay
          setActiveMachineId(nextMachineId);
        }
      }
    }, 1000);
  };

  // --- SPLIT CANDIDATES INTO 4 SECTIONS (A, B, C, D) ---
  const SLOTS_PER_SECTION = 7;

  const SECTIONS_CONFIG = [
    { id: 'A', labelEn: 'A', labelMr: 'अ', color: '#ffffff', machineId: 1 },
    { id: 'B', labelEn: 'B', labelMr: 'ब', color: '#fca5a5', machineId: 1 },
    { id: 'C', labelEn: 'C', labelMr: 'क', color: '#fef08a', machineId: 2 },
    { id: 'D', labelEn: 'D', labelMr: 'ड', color: '#bae6fd', machineId: 2 }
  ];

  const renderContent = () => {
    console.log("Rendering Content. isProcessComplete:", isProcessComplete, "ActiveMachine:", activeMachineId);
    if (isProcessComplete) {
      return (
        <CompletionCard
          ward={wardData}
          language={language}
          votedCandidate={votedCandidate}
          allCandidates={activeCandidates}
          onShare={handleShare}
        />
      );
    }

    // Generate Data Logic
    console.log("Generating Sections Data...");
    const sectionsData = SECTIONS_CONFIG.map((section, secIdx) => {
      const adminUnitIndex = secIdx;
      const startSerial = 1;
      const candidates = generateCandidates(startSerial, SLOTS_PER_SECTION, adminUnitIndex);
      // Check if this section has an assigned candidate
      const isValid = !!activeCandidates[adminUnitIndex];
      return { ...section, adminUnitIndex, candidates, isValid };
    });

    const machine1Sections = sectionsData.filter(s => s.machineId === 1);
    const machine2Sections = sectionsData.filter(s => s.machineId === 2);

    console.log("Machine 1 Sections:", machine1Sections.length, machine1Sections);
    console.log("Machine 2 Sections:", machine2Sections.length);

    let activeSectionForHeader = activeMachineId === 1 ? machine1Sections[0] : machine2Sections[0];
    let displayCandidateName = null;

    // Logic to determine name to show in Header
    // 1. If voted, show voted candidate.
    // 2. If not voted, show the assigned candidate for the active section (default A or C).

    if (votedSerial !== null && votedCandidate) {
      if (sectionsData[currentUnitIndex]) {
        activeSectionForHeader = sectionsData[currentUnitIndex];
      }
      displayCandidateName = (language === 'mr' || language === 'hi') ? (votedCandidate.marathiName || votedCandidate.name) : votedCandidate.name;
    } else {
      // Fallback to assigned candidate for the currently visible section
      if (sectionsData[visibleUnitIndex]) {
        activeSectionForHeader = sectionsData[visibleUnitIndex];
      }

      const assignedForSection = activeCandidates[activeSectionForHeader.adminUnitIndex];
      if (assignedForSection) {
        displayCandidateName = (language === 'mr' || language === 'hi') ? (assignedForSection.marathiName || assignedForSection.name) : assignedForSection.name;
      }
    }

    const activeLabel = (language === 'mr' || language === 'hi') ? activeSectionForHeader.labelMr : activeSectionForHeader.labelEn;

    return (
      <>
        <ElectionInfoCard
          ward={wardData}
          candidateName={displayCandidateName}
          language={language}
          unitLetter={activeLabel}
        />

        {activeMachineId === 1 && (
          <div className="machine-container" id="machine-1">
            <BallotUnit
              key="machine-1"
              machineId={1}
              sections={machine1Sections}
              language={language}
              onVote={(serial, unitIdx) => {
                handleVote(serial, unitIdx);
                if (unitIdx === 1) {
                  setTimeout(() => { setActiveMachineId(2); }, 1000);
                }
              }}
              votedSerialNo={votedSerial}
              currentUnitIndex={currentUnitIndex}
              onSectionVisible={setVisibleUnitIndex}
            />
          </div>
        )}

        {activeMachineId === 2 && (
          <div className="machine-container" id="machine-2">
            <BallotUnit
              key="machine-2"
              machineId={2}
              sections={machine2Sections}
              language={language}
              onVote={(serial, unitIdx) => {
                handleVote(serial, unitIdx);
              }}
              votedSerialNo={votedSerial}
              currentUnitIndex={currentUnitIndex}
              onSectionVisible={setVisibleUnitIndex}
            />
          </div>
        )}
      </>
    );
  };

  const handleShare = async () => {
    const t = translations[language] || translations['en'];
    const isLocalLang = language === 'mr' || language === 'hi';
    const wardName = (isLocalLang && wardData?.name_marathi) ? wardData.name_marathi : (wardData?.name || "N/A");

    const isPrabhag = wardData.prabhag_ward === 'Prabhag';
    const locationLabel = isPrabhag ? t.sharePrabhagLabel : t.shareWardLabel;
    const unitTypeLabel = isPrabhag
      ? (isLocalLang ? 'प्रभाग क्र.' : 'Prabhag No.')
      : (isLocalLang ? 'वार्ड क्र.' : 'Ward No.');

    const padNum = (num) => num.toString().padStart(2, '0');
    const unitNum = wardData.prabhag_number ? padNum(wardData.prabhag_number) : '';
    const locationLine = `${locationLabel}: ${wardName} – ${unitTypeLabel} ${unitNum}`;

    const numberEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    let candidatesListText = "";
    if (activeCandidates) {
      candidatesListText = Object.entries(activeCandidates)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([idx, candidate]) => {
          const serial = parseInt(idx) + 1;
          const emoji = numberEmojis[serial] || `${serial}.`;
          const name = isLocalLang ? (candidate.marathiName || candidate.name) : candidate.name;
          return `${emoji} ${name}`;
        })
        .join('\n');
    }

    const shareText = `
${t.shareHeader}

${locationLine}
${t.shareDateLabel}: ${t.electionDateValue}
${t.shareTimeLabel}: ${t.votingTime}

${t.participatingCandidates}

${candidatesListText}

${t.shareSloganTitle}
${t.slogan}

${t.shareVoteHere}
${window.location.href}

${t.shareFooter}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Election - ${wardName}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
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
