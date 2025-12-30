export const translations = {
  mr: {
    title: "भारत निवडणूक आयोग", // Election Commission of India
    subtitle: "लोकसभा सार्वत्रिक निवडणूक - 2024", // Lok Sabha General Election - 2024
    headerSrNo: "अ.क्र.", // Sr. No.
    headerName: "उमेदवाराचे नाव", // Name of Candidate
    headerSymbol: "चिन्ह", // Symbol
    headerButton: "बटन", // Button
    ready: "तयार", // Ready
    ballotUnit: "बॅलेट युनिट", // Ballot Unit
    voteRecorded: "आपले मत नोंदवले गेले आहे!", // Your vote has been recorded!
    pressButton: "बटन दाबा" // Press Button
  },
  hi: {
    title: "भारत निर्वाचन आयोग",
    subtitle: "लोकसभा आम चुनाव - 2024",
    headerSrNo: "क्र.सं.",
    headerName: "अभ्यर्थी का नाम",
    headerSymbol: "प्रतीक",
    headerButton: "बटन",
    ready: "तैयार",
    ballotUnit: "बैलेट यूनिट",
    voteRecorded: "आपका वोट दर्ज कर लिया गया है!",
    pressButton: "बटन दबाएं"
  },
  en: {
    title: "Election Commission of India",
    subtitle: "General Election to Lok Sabha - 2024",
    headerSrNo: "Sr. No.",
    headerName: "Name of Candidate",
    headerSymbol: "Symbol",
    headerButton: "Button",
    ready: "READY",
    ballotUnit: "Ballot Unit",
    voteRecorded: "Your vote has been recorded!",
    pressButton: "PRESS",
    // Info Card
    ward: "Ward / Prabhag",
    // English
    electionDate: "Election Date",
    electionDateValue: "15 January 2026",
    votingTime: "Time: 7:00 AM to 6:00 PM",
    share: "Share",
    candidateNamePlaceholder: "Candidate Name",
    slogan: "Press the button opposite their name and symbol to make them victorious with a huge majority!",
    wardLabel: "Ward",
    prabhagLabel: "Prabhag",
    votedCandidateTitle: "Candidates you voted for",
    participatingCandidates: "Participating Candidates",
    // Share Message
    shareHeader: "🚨 Voting Appeal 🚨",
    shareCandidateLabel: "👤 Candidate",
    shareWardLabel: "📍 Ward",
    shareDateLabel: "🗓️ Date",
    shareTimeLabel: "⏰ Time"
  }
};

// Add Marathi translations specifically (since they are custom requested)
translations.mr = {
  ...translations.mr,
  ward: "प्रभाग / वार्ड",
  electionDate: "निवडणूक दिनांक",
  electionDateValue: "१५ जानेवारी २०२६",
  votingTime: "वेळ: सकाळी ७:०० ते सायंकाळी ६:००",
  share: "शेअर करा",
  candidateNamePlaceholder: "उमेदवाराचे नाव",
  slogan: "यांना त्यांच्या नाव व चिन्हासमोरील बटन दाबून प्रचंड मताने विजयी करा!",
  wardLabel: "वार्ड",
  prabhagLabel: "प्रभाग",
  votedCandidateTitle: "तुमचे मत दिलेले उमेदवार",
  participatingCandidates: "सहभागी उमेदवार",
  // Share Message
  shareHeader: "🚨 मतदान आवाहन 🚨",
  shareCandidateLabel: "👤 उमेदवार",
  shareWardLabel: "📍 प्रभाग",
  shareDateLabel: "🗓️ तारीख",
  shareTimeLabel: "⏰ वेळ"
};

translations.hi = {
  ...translations.hi,
  ward: "वार्ड / प्रभाग",
  electionDate: "चुनाव तारीख",
  electionDateValue: "१५ जनवरी २०२६",
  votingTime: "समय: सुबह ७:०० से शाम ६:००",
  share: "शेयर करें",
  candidateNamePlaceholder: "उमेदवार का नाम",
  slogan: "इनके नाम और चुनाव चिन्ह के सामने वाला बटन दबाकर भारी मतों से विजयी बनाएं!",
  wardLabel: "वार्ड",
  prabhagLabel: "प्रभाग",
  votedCandidateTitle: "आपके द्वारा वोट किए गए उम्मीदवार",
  participatingCandidates: "प्रतिभागी उम्मीदवार",
  // Share Message
  shareHeader: "🚨 मतदान अपील 🚨",
  shareCandidateLabel: "👤 उम्मीदवार",
  shareWardLabel: "📍 वार्ड",
  shareDateLabel: "🗓️ तारीख",
  shareTimeLabel: "⏰ समय"
};
