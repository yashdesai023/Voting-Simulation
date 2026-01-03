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
    votingTime: "7:30 AM to 5:30 PM",
    share: "Share",
    candidateNamePlaceholder: "Candidate Name",
    slogan: "Press the button opposite the candidate’s name and symbol to support them and help make them victorious with a huge majority.",
    wardLabel: "Ward",
    prabhagLabel: "Prabhag",
    votedCandidateTitle: "Candidates you voted for",
    participatingCandidates: "👥 Participating Candidates",
    // Share Message
    shareHeader: "🗳️ VOTING APPEAL | PLEASE VOTE & SHARE 🇮🇳",
    shareCandidateLabel: "👤 Candidate", // Not used in new format but keeping for safety
    shareWardLabel: "📍 Ward",
    sharePrabhagLabel: "📍 Prabhag",
    shareDateLabel: "🗓️ Date",
    shareTimeLabel: "⏰ Time",
    shareSloganTitle: "👉 Your vote is your power!",
    shareVoteHere: "🔗 Vote Here:",
    shareFooter: "🙏 Please vote responsibly and share this message with your family & friends to encourage maximum participation."
  }
};

// Add Marathi translations specifically (since they are custom requested)
translations.mr = {
  ...translations.mr,
  ward: "प्रभाग / वार्ड",
  electionDate: "निवडणूक दिनांक",
  electionDateValue: "१५ जानेवारी २०२६",
  votingTime: "सकाळी ७:३० ते सायंकाळी ५:३०",
  share: "शेअर करा",
  candidateNamePlaceholder: "उमेदवाराचे नाव",
  slogan: "उमेदवाराच्या नाव व चिन्हासमोरील बटन दाबून त्यांना प्रचंड मतांनी विजयी करा.",
  wardLabel: "वार्ड",
  prabhagLabel: "प्रभाग",
  votedCandidateTitle: "तुमचे मत दिलेले उमेदवार",
  participatingCandidates: "👥 सहभागी उमेदवार",
  // Share Message
  shareHeader: "🗳️ मतदान आवाहन | कृपया मतदान करा व शेअर करा 🇮🇳",
  shareWardLabel: "📍 प्रभाग",
  sharePrabhagLabel: "📍 प्रभाग", // User used "Prabhag" for Marathi Ward line
  shareDateLabel: "🗓️ तारीख",
  shareTimeLabel: "⏰ वेळ",
  shareSloganTitle: "👉 आपले मत, आपली ताकद!",
  shareVoteHere: "🔗 मतदानासाठी लिंक:",
  shareFooter: "🙏 कृपया जबाबदारीने मतदान करा व हा संदेश जास्तीत जास्त लोकांपर्यंत पोहोचवा."
};

translations.hi = {
  ...translations.hi,
  ward: "वार्ड / प्रभाग",
  electionDate: "चुनाव तारीख",
  electionDateValue: "15 जनवरी 2026",
  votingTime: "सुबह 7:30 बजे से शाम 5:30 बजे तक",
  share: "शेयर करें",
  candidateNamePlaceholder: "उमेदवार का नाम",
  slogan: "उम्मीदवार के नाम और चिन्ह के सामने दिए गए बटन को दबाकर उन्हें भारी बहुमत से विजयी बनाएं।",
  wardLabel: "वार्ड",
  prabhagLabel: "प्रभाग",
  votedCandidateTitle: "आपके द्वारा वोट किए गए उम्मीदवार",
  participatingCandidates: "👥 प्रतिभागी उम्मीदवार",
  // Share Message
  shareHeader: "🗳️ मतदान अपील | कृपया वोट करें और शेयर करें 🇮🇳",
  shareWardLabel: "📍 वार्ड",
  sharePrabhagLabel: "📍 प्रभाग",
  shareDateLabel: "🗓️ तारीख",
  shareTimeLabel: "⏰ समय",
  shareSloganTitle: "👉 आपका वोट, आपकी शक्ति!",
  shareVoteHere: "🔗 वोट करने के लिए लिंक:",
  shareFooter: "🙏 कृपया जिम्मेदारी से मतदान करें और इस संदेश को अधिक से अधिक लोगों तक साझा करें।"
};
