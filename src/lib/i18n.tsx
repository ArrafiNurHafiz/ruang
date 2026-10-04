import React, { createContext, useContext, useState, useEffect } from "react";
import { ReportCategory, ReportStatus, AppUserRole } from "../types";

export type Language = "en" | "id";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Navigation
    "brand.name": "Ruang Aman",
    "brand.tagline": "Safe Space • Student Voice",
    "brand.satgas": "PPKSP Task Force",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.howItWorks": "How to Report",
    "nav.track": "Track Ticket",
    "nav.help": "Help Center",
    "nav.contact": "Contact",
    "nav.transparency": "Transparency",
    "nav.reportAnonymous": "Report Anonymously",
    "nav.staffLogin": "Staff Login",
    "nav.logout": "Log Out",
    "nav.disguiseTooltip": "Disguise Mode: Instantly switch screen to study material (ESC 2x)",

    // Roles & Badges
    "role.student": "Student / Reporter",
    "role.counselor": "BK Counselor / School Task Force Workspace",
    "role.admin": "System Admin Console (IT & Security)",
    "role.dinasPendidikan": "Education Agency Regional Oversight Portal",
    "role.dinasPerlindungan": "Child Protection Agency (UPTD PPA) Portal",

    // Hero Section
    "hero.badge": "National School Safety Platform",
    "hero.badgeSub": "In Compliance with Permendikbudristek No. 46/2023",
    "hero.title1": "Your Voice Matters.",
    "hero.title2": "We Are Ready to Listen & Protect.",
    "hero.copy":
      "Official prevention and handling channel for all students, educators, and school members across 38 Indonesian Provinces. Your identity is 100% safeguarded with zero-trace cryptographic privacy technology.",
    "hero.stat1": "38 Provinces Connected",
    "hero.stat2": "PPKSP 46/2023 Compliant",
    "hero.stat3": "Managed by Schools & Agencies",
    "hero.createReport": "Create New Report",
    "hero.createReportSub": "Tell us what happened. 100% anonymous, no account or login needed.",
    "hero.trackTicket": "Track Ticket & Reply Chat",
    "hero.trackTicketSub": "Already filed a report? Check updates and talk secretly without revealing identity.",
    "hero.ticketPlaceholder": "Example: TMG-2026-XXXX",
    "hero.trackBtn": "Track",
    "hero.trustChip1": "Safe",
    "hero.trustChip1Sub": "Anonymous\nEncrypted",
    "hero.trustChip2": "Heard",
    "hero.trustChip2Sub": "Action Taken\nProtected",

    // Protection Pillars
    "prot.title": "Comprehensive Protection Ecosystem",
    "prot.sub": "Engineered to keep students safe, heard, and supported at every stage of reporting.",
    "prot.oneTitle": "Absolute Secret Identity",
    "prot.oneText": "Names, phone numbers, and personal details are automatically sanitized. No digital record tracks your device.",
    "prot.twoTitle": "Confidential 2-Way Chat",
    "prot.twoText": "Communicate directly with school counselors through encrypted chat to receive assistance and updates.",
    "prot.threeTitle": "School Task Force Assistance",
    "prot.threeText": "Reports are handled professionally by the school PPKSP task force and escalated to protection agencies when needed.",

    // Steps
    "steps.title": "How Ruang Aman Protects You",
    "steps.sub": "Three simple, secure steps to ensure your voice is heard safely.",
    "steps.oneTitle": "1. Submit Report",
    "steps.oneText": "Select the issue category and describe what occurred. Attach photos or audio proof if available.",
    "steps.twoTitle": "2. Save Secret Ticket Key",
    "steps.twoText": "The system issues a cryptographic ticket code and PIN. Store them to monitor case progress.",
    "steps.threeTitle": "3. Receive Resolution & Care",
    "steps.threeText": "Counselors investigate and act on the case, and you confirm resolution once you feel completely safe.",

    // FAQs
    "faq.title": "Frequently Asked Questions",
    "faq.q1": "Is my identity genuinely hidden from everyone?",
    "faq.a1": "Yes, 100% guaranteed. Ruang Aman does not record names, student IDs, IP addresses, or device info. Counselors only receive the incident chronology and redacted attachments.",
    "faq.q2": "How do I read responses from the counselor?",
    "faq.a2": "After reporting, you will receive a unique Ticket Number and Recovery Key. Save it. You can check status and chat secretly under the 'Track Ticket' menu at any time.",
    "faq.q3": "Do I need a school access token to report?",
    "faq.a3": "School tokens verify that you belong to the student body without asking for your name. If you don't have one, you can still proceed with general school reporting.",
    "faq.q4": "What types of incidents can be reported?",
    "faq.a4": "Physical violence, bullying, sexual harassment, online terror, extortion, discrimination, and any emotional distress occurring within the educational environment.",

    // Emergency Bar & Modal
    "emergency.barText": "In immediate danger or feeling unsafe? Contact",
    "emergency.sapa": "SAPA 129",
    "emergency.police": "Police 110",
    "emergency.btn": "Emergency Hotlines",
    "emergency.modalTitle": "24/7 Crisis & Emergency Contacts",
    "emergency.modalSubtitle": "Use immediately in life-threatening situations or physical danger",
    "emergency.quickExit": "Quick Distress Exit",

    // Anonymous Report Form
    "report.badge": "Zero-Knowledge Anonymous Gate",
    "report.heading": "Safe & Protected Report Form",
    "report.subheading": "Your identity is never requested or stored. All data is sanitized on your device.",
    "report.step1": "1. Incident Chronology",
    "report.step2": "2. Review & Encryption",
    "report.tokenLabel": "School Access Code (Optional)",
    "report.tokenPlaceholder": "e.g., SCH-X1-8831",
    "report.verifyTokenBtn": "Verify Code",
    "report.tokenSuccess": "School Code Verified (Active Student)",
    "report.schoolSelectLabel": "Origin School / Educational Institution",
    "report.categoryLabel": "Select Incident Category",
    "report.urgencyLabel": "Urgency Level",
    "report.urgencyLow": "Low (Consultation)",
    "report.urgencyMedium": "Medium (Intimidation/Discomfort)",
    "report.urgencyHigh": "High (Physical Violence/Extortion)",
    "report.urgencyCritical": "Critical (Severe Danger/Harassment)",
    "report.locationLabel": "Incident Location (e.g., Canteen, Hallway, Online)",
    "report.dateLabel": "Date & Time of Incident",
    "report.storyLabel": "Chronology of Events",
    "report.storyPlaceholder": "Describe what happened clearly. Don't worry if you accidentally type names or phone numbers, our AI PII Stripper will sanitize them.",
    "report.piiDetected": "Sensitive personal info detected (names, phone numbers, or classes).",
    "report.piiClean": "Your story is clean of personal identifiers.",
    "report.piiRedactBtn": "Sanitize Personal Info Instantly",
    "report.attachLabel": "Proof Attachment (Photo, Screenshot, or Audio)",
    "report.nextBtn": "Next: Review & Encrypt",
    "report.backBtn": "Back to Edit",
    "report.pinLabel": "Create 4-Digit Emergency PIN (For ticket recovery)",
    "report.pinPlaceholder": "4 digits (e.g. 7890)",
    "report.consent": "I confirm this report is truthful and intended for student safety and resolution.",
    "report.submitBtn": "Encrypt & Submit with Zero-Knowledge Proof",
    "report.zkpComputing": "Computing Zero-Knowledge Proof (Poseidon Hash)...",
    "report.successTitle": "Report Successfully Submitted & Encrypted!",
    "report.successSubtitle": "Your identity is 100% hidden. Save your ticket code below to monitor updates and chat with counselors.",
    "report.ticketCodeLabel": "Your Secret Ticket Code",
    "report.recoveryKeyLabel": "Secret Recovery Passphrase",
    "report.copySuccess": "Copied to clipboard!",
    "report.openChatBtn": "Open Confidential Chat Room",

    // Ticket Status & Chat
    "track.title": "Track Ticket & Counselor Chat",
    "track.subtitle": "Check case status, read counselor advice, and exchange messages safely.",
    "track.inputLabel": "Enter Ticket Number",
    "track.inputPlaceholder": "e.g., TMG-2026-78A1",
    "track.btn": "Check Status",
    "track.orPin": "Or recover with School Code + 4-digit PIN",
    "track.timelineTitle": "Case Progress Timeline",
    "track.chatTitle": "Confidential Two-Way Counseling Chat",
    "track.chatEmpty": "No messages yet. Send a message to speak directly with your assigned counselor.",
    "track.sendPlaceholder": "Type your message or follow-up question here...",
    "track.sendBtn": "Send Message",
    "track.evidenceTitle": "School Resolution Proof",
    "track.evidenceDesc": "The school task force has uploaded resolution proof. Please review and confirm your safety.",
    "track.confirmSafeBtn": "Confirm Case Resolved & I Feel Safe",
    "track.confirmedBadge": "Case Successfully Closed by Student",

    // Unified Login
    "login.title": "Ruang Aman Staff Portal",
    "login.subtitle": "Single sign-on for BK Counselors, School Task Force, Education Agency, and Child Protection (UPTD PPA).",
    "login.email": "Official Email",
    "login.password": "Password",
    "login.submit": "Sign In",
    "login.verifying": "Verifying credentials...",
    "login.quickTitle": "Demo Quick Login (Click to fill):",

    // Disguise Mode (Camouflage)
    "disguise.title": "National High School Physics & Mathematics Quiz",
    "disguise.timer": "Remaining Time: 42:15",
    "disguise.question": "Question 14: A 2 kg object moves along a frictionless surface at 6 m/s. What is its kinetic energy?",
    "disguise.exitHint": "Press ESC twice or click the small exit icon to return to Ruang Aman.",
    "disguise.exitBtn": "Exit Quiz Module",

    // About Page
    "about.badge": "About Ruang Aman & PPKSP",
    "about.title": "Creating Safe, Inclusive, and Violence-Free Educational Spaces",
    "about.lead": "Ruang Aman is a zero-knowledge digital platform engineered to uphold Permendikbudristek No. 46/2023 on the Prevention and Handling of Violence in Educational Units.",
    "about.pillar1": "Mathematical Privacy",
    "about.pillar1Desc": "Semaphore ZKP cryptography guarantees membership verification without storing identity.",
    "about.pillar2": "Multi-Agency Coordination",
    "about.pillar2Desc": "Seamless escalation between school counselors, provincial education boards, and child protection services.",
    "about.pillar3": "Evidence-Based Accountability",
    "about.pillar3Desc": "Immutable cryptographic audit trails and standard digital reporting dossiers (BAP).",

    // App & Common
    "app.quickExitTitle": "Quick Exit: Instantly clear traces (ESC 2x)",
    "app.quickExit": "Quick Exit",
    "nav.report": "Report",
    "nav.status": "Status",
    "footer.nationalPlatform": "National PPKSP Platform",
    "footer.regulation": "In Accordance with Permendikbudristek No. 46/2023",

    // Help Center
    "help.badge": "Help Center & Student Guide",
    "help.title": "How Can We Help You?",
    "help.sub": "Find step-by-step reporting guides, cryptographic privacy guarantees, and student protection laws.",
    "help.searchPlaceholder": "Search help articles, FAQs, or keywords...",
    "help.bannerBadge": "Child-Friendly Support & School Counselors",
    "help.bannerTitle": "Don't Hesitate, You Are Not Alone",
    "help.bannerSub": "All counseling and follow-up processes are free from intimidation, guided by certified counselors, and your privacy is legally protected.",
    "help.catAll": "All",
    "help.catReport": "How to Report",
    "help.catPrivacy": "Privacy & Security",
    "help.catTracking": "Ticket Tracking",
    "help.catTokens": "Tokens & Accounts",
    "help.catPolicy": "School Policies",
    "help.closeArticle": "Close Article",
    "help.startReport": "Start Making a Report",
    "help.keyGuides": "Key Guides & Help Topics",
    "help.readFull": "Read Full Guide",
    "help.faqTitle": "Frequently Asked Questions (FAQ)",
    "help.faqSub": "Direct answers about identity privacy, case progress, and platform operations.",
    "help.moreQuestions": "Still Have Questions?",
    "help.moreQuestionsSub": "Contact our official support channel or send a confidential message directly to counselors.",
    "help.sendOfficial": "Send Official Message",

    // Contact Page
    "contact.bannerBadge": "Contact Ruang Aman & School Task Force",
    "contact.bannerTitle": "Support & Inquiries Contact",
    "contact.bannerSub": "Send suggestions, outreach requests, or official questions to the platform administration and school counselors.",
    "contact.formTitle": "Official Message Form",
    "contact.formNotice": "If you are experiencing direct bullying, please use the Report Anonymously form for complete cryptographic protection.",
    "contact.sentTitle": "Your Message Has Been Sent Successfully!",
    "contact.sentSub": "Our team will review and respond to your inquiry within 24 business hours.",
    "contact.sendAnother": "Send Another Message",
    "contact.nameLabel": "Name / Initials (Optional):",
    "contact.namePlaceholder": "Can be left empty for anonymity",
    "contact.emailLabel": "Contact / Reply Email:",
    "contact.emailPlaceholder": "your.email@example.com",
    "contact.categoryLabel": "Message Category:",
    "contact.catService": "Service Inquiries",
    "contact.catToken": "Token Card Issues",
    "contact.catFeedback": "Feedback & Suggestions",
    "contact.catConsult": "Teacher / Parent Consultation",
    "contact.catOther": "Other",
    "contact.subjectLabel": "Subject / Topic:",
    "contact.subjectPlaceholder": "Topic of your message",
    "contact.messageLabel": "Message Content:",
    "contact.messagePlaceholder": "Write your question or details here...",
    "contact.sendError": "Failed to send message. Please ensure the backend is running and try again.",
    "contact.sending": "Sending...",
    "contact.submitBtn": "Send Support Message",
    "contact.dirHeader": "OFFICIAL DIRECTORY",
    "contact.dirTitle": "Counseling & PPKSP Secretariat",
    "contact.dirSubtitle": "Integrated Student Protection Center",
    "contact.emailTitle": "Official Email:",
    "contact.phoneTitle": "Counselor Hotline (WA):",
    "contact.phoneNote": "(Dedicated Chat)",
    "contact.hoursTitle": "Counseling Service Hours:",
    "contact.hoursValue": "Monday – Friday: 07:00 – 17:00 (Local Time)",
    "contact.hoursNote": "24/7 online anonymous reporting active",
    "contact.locationTitle": "Safe Room Physical Location:",
    "contact.locationValue": "Counseling Department (Main Building, East Wing 2nd Floor)",
    "contact.dirFooter": "All physical and online counseling sessions are strictly confidential under the professional code of ethics.",

    // Transparency Page
    "transparency.badge": "Transparency & Cryptographic Security Standards",
    "transparency.title": "Transparency & Zero-Trace Privacy Guarantees",
    "transparency.sub": "We believe true safety begins with transparency. Understand how Ruang Aman safeguards your identity and the technical boundaries of the platform.",
    "transparency.bannerBadge": "Open Semaphore Cryptographic Protocol",
    "transparency.bannerTitle": "The Server Is Mathematically Incapable of Knowing Your Identity",
    "transparency.bannerSub": "Not merely a policy promise, but mathematically enforced. Zero-Knowledge Proofs are computed entirely on your device browser before any payload leaves your machine.",
    "transparency.p1Title": "1. Cryptographic Anonymity",
    "transparency.p1Desc": "Powered by Zero-Knowledge Proof (ZKP) architecture. The server verifies legitimate student status without ever learning the student's identity.",
    "transparency.p2Title": "2. Zero Digital Footprint (Zero Log)",
    "transparency.p2Desc": "Our servers never log IP addresses, do not store device User-Agents, and automatically strip GPS location data from uploaded files.",
    "transparency.p3Title": "3. Cryptographic Anti-Spam",
    "transparency.p3Desc": "Lightweight client-side Proof-of-Work prevents automated spam floods without restricting student reporting access.",
    "transparency.limitsTitle": "Essential System Limitations to Know",
    "transparency.limitsSub": "Ruang Aman is an intake and counseling tool, not an instantaneous armed emergency response.",
    "transparency.limit1Title": "Not a Split-Second Rapid Emergency Response:",
    "transparency.limit1Desc": "If you are in immediate life-threatening physical danger, contact SAPA 129 or Police 110, or seek direct in-person protection at the nearest teacher's office immediately.",
    "transparency.limit2Title": "Story Narrative Can Inadvertently Leak Identity:",
    "transparency.limit2Desc": "While automated PII sanitization strips direct identifiers, recounting highly unique private details known only to a single person may allow contextual identification. Keep narratives focused on the incident facts.",
    "transparency.sopStudentTitle": "Guidelines for Students",
    "transparency.sopStudent1": "Describe the incident location and form of bullying clearly and factually.",
    "transparency.sopStudent2": "Use the Auto-Sanitize button to remove inadvertent names, phone numbers, or class info.",
    "transparency.sopStudent3": "Store your secret Ticket Number and recovery PIN securely, never sharing them.",
    "transparency.sopStudent4": "Press ESC twice or use Quick Exit if anyone approaches your screen.",
    "transparency.sopCounselorTitle": "School Task Force & Counselor SOP",
    "transparency.sopCounselor1": "Counselors are strictly forbidden from asking or probing for the reporter's real identity in chat.",
    "transparency.sopCounselor2": "Conduct interventions through general mediation and supervision rather than conspicuous singling-out.",
    "transparency.sopCounselor3": "Provide initial encrypted chat responses within a maximum of 24 business hours.",
    "transparency.sopCounselor4": "Maintain total confidentiality of internal counseling records under ethical oaths.",
    "transparency.ctaTitle": "Ready to Use Ruang Aman?",
    "transparency.ctaSub": "Report incidents now with unconditional cryptographic privacy guarantees.",
    "transparency.ctaBtn": "Submit Anonymous Report Now",

    // News Section
    "news.bannerBadge": "Ruang Aman News & Education Channel",
    "news.bannerTitle": "News & Student Protection Insights",
    "news.bannerSub": "Official updates, anti-bullying prevention guides, PPKSP policies, and mental health education to foster safe, inclusive schools.",
    "news.featured": "Featured Spotlight",
    "news.readMore": "Read Full Article",
    "news.searchPlaceholder": "Search articles, topics, regulations...",
    "news.emptyTitle": "No articles found",
    "news.emptySub": "Try different search terms or select the 'All' category to display all articles.",
    "news.calloutTitle": "Experiencing or Witnessing a Similar Situation?",
    "news.calloutSub": "Don't carry it alone. Your voice is safeguarded by full encryption. File an anonymous report now to receive support from counselors.",
    "news.calloutBtn": "Submit Report Now",
    "news.catAll": "All",
    "news.catReg": "Regulations & PPKSP",
    "news.catAntiBullying": "Anti-Bullying Education",
    "news.catMentalHealth": "Mental Health",
    "news.catDigital": "Digital & Cyber Safety",

    // Kiosk Mode & Session
    "kiosk.activeBadge": "Kiosk Mode Active",
    "kiosk.sharedDeviceNotice": "Shared Device (Zero Traces / Auto-Purge in 3 Minutes)",
    "kiosk.timeLeft": "Time Left:",
    "kiosk.extend": "+3 Min",
    "kiosk.extendTitle": "Extend Session Time (+3 Minutes)",
    "kiosk.endAndWipe": "Finish & Wipe",
    "kiosk.endTitle": "End Session Now & Wipe All Cache",
    "kiosk.sessionActive": "ACTIVE SHARED DEVICE SESSION",
    "kiosk.title": "School Kiosk Mode Running",
    "kiosk.desc": "The system will automatically clear all on-screen and stored memory if there is no activity for 3 minutes.",
    "kiosk.quickReportTitle": "1. Quick Anonymous Report",
    "kiosk.quickReportDesc": "Submit bullying or violence reports instantly without leaving any digital trace on this computer.",
    "kiosk.checkStatusTitle": "2. Check Ticket Status",
    "kiosk.checkStatusDesc": "Track previous reports and chat with counselors secretly using your Ticket Code.",
    "kiosk.safetyTitle": "Zero-Trace Privacy Rules in Kiosk Mode",
    "kiosk.rule1": "Browser cache, cookies, and local session memory are destroyed immediately when exiting or after timeout.",
    "kiosk.rule2": "Input fields do not remember autocomplete history or keystrokes.",
    "kiosk.rule3": "Press ESC twice or click 'Finish & Wipe' at any time if someone approaches.",
    "kiosk.endSessionBtn": "End Kiosk Session & Wipe History",

    // Token Activation
    "tokenAct.title": "School Access Code Activation",
    "tokenAct.subtitle": "Activate your school code and set a personal PIN to report securely.",
    "tokenAct.step1": "1. Enter School Code",
    "tokenAct.step2": "2. Set 6-Digit PIN",
    "tokenAct.step3": "3. Save Recovery Key",
    "tokenAct.inputLabel": "School Access Code",
    "tokenAct.inputPlaceholder": "e.g., SCH-X1-8831",
    "tokenAct.verifyBtn": "Verify Code",
    "tokenAct.pinLabel": "Create 6-Digit Secret PIN",
    "tokenAct.pinConfirmLabel": "Confirm 6-Digit Secret PIN",
    "tokenAct.pinHint": "Remember this PIN. It is needed to log in or track reports.",
    "tokenAct.savePinBtn": "Save PIN & Complete Activation",
    "tokenAct.successTitle": "Activation Successful!",
    "tokenAct.successSubtitle": "Your school code is now active and protected with your secret PIN.",
    "tokenAct.recoveryKeyTitle": "Your Emergency Recovery Key",
    "tokenAct.recoveryKeyDesc": "Save this passphrase in a safe place. If you ever forget your PIN, this is the ONLY way to recover access.",
    "tokenAct.copyBtn": "Copy Recovery Key",
    "tokenAct.proceedBtn": "Proceed to Anonymous Report",

    // Kiosk Mode additional
    "kiosk.headerBadge": "Lab Computer / School Tablet",
    "kiosk.headerTitle": "Kiosk Mode (Shared Device)",
    "kiosk.headerSubtitle": "Designed specifically for students using library or school lab computers without leaving any browsing history.",
    "kiosk.feat1Title": "3-Minute Time Limit",
    "kiosk.feat1Desc": "Session disconnects automatically if left idle.",
    "kiosk.feat2Title": "Zero-Storage Cache",
    "kiosk.feat2Desc": "Does not store cookies, passwords, or browser history.",
    "kiosk.feat3Title": "Ephemeral Session Encryption",
    "kiosk.feat3Desc": "Encryption keys are destroyed immediately when the session ends.",
    "kiosk.inputLabel": "Enter TU Staff Session Code or Ticket Recovery Code:",
    "kiosk.inputPlaceholder": "e.g., TU-SMAN1-2025 or your-recovery-keyword",
    "kiosk.demoCodesLabel": "Use Demo TU Session Codes:",
    "kiosk.startBtn": "Start Clean Session (3 Minutes)",
    "kiosk.errEmpty": "Please enter a TU session code or your recovery code.",
    "kiosk.errInvalid": "Invalid session code. Use a staff TU code or your ticket recovery code.",
    "kiosk.warnTitle": "Shared Computer Security Warning:",
    "kiosk.warnDesc": "Make sure no one behind you can look at the screen. Click 'Finish & Wipe' when you leave the computer.",
    "kiosk.endWipeBtn": "End Session & Wipe All Memory",

    // Token Activation additional
    "tokenAct.badge": "Physical / Digital School Card",
    "tokenAct.headerDesc": "Activate your school verification token in 3 simple steps to ensure local security without transmitting personal identity to the server.",
    "tokenAct.step1Card": "Step 1: Enter School Token Code",
    "tokenAct.step1CardDesc": "The token is a random combination printed on the physical privacy card distributed by the school.",
    "tokenAct.tokenCardLabel": "Student Card Token Number:",
    "tokenAct.tokenPlaceholder": "e.g., TMG-SCH-8831",
    "tokenAct.nextToPin": "Proceed to Create PIN",
    "tokenAct.step2Card": "Step 2: Create Local 6-Digit PIN",
    "tokenAct.step2CardDesc": "This PIN is only stored in your device's browser memory and never transmitted to the server.",
    "tokenAct.pinGuarantee": "Absolute PIN Privacy:",
    "tokenAct.pinGuaranteeDesc": "Teachers, school staff, and Ruang Aman developers have zero access to this PIN.",
    "tokenAct.createPinLabel": "Create 6-Digit PIN:",
    "tokenAct.confirmPinLabel": "Confirm PIN:",
    "tokenAct.backBtn": "Back",
    "tokenAct.activateSaveBtn": "Activate & Save Recovery",
    "tokenAct.successMsg": "Token Successfully Activated!",
    "tokenAct.successDesc": "Save the recovery code below if you need to access your account from another device or if you forget your PIN.",
    "tokenAct.recoveryKeyHeader": "RECOVERY KEY",
    "tokenAct.secretChars": "16 Secret Characters",
    "tokenAct.copied": "Copied!",
    "tokenAct.copy": "Copy",
    "tokenAct.recoveryNotice": "Write this code in a private notebook or save it in your password manager.",
    "tokenAct.startReportNow": "Start Anonymous Report Now",
    "tokenAct.activateAnother": "Activate Another Token",
    "tokenAct.errAlreadyActive": "Token is already activated. Use your Recovery Code to sign in.",
    "tokenAct.errNotFound": "Student Access Code is invalid or not found.",
    "tokenAct.errPinDigits": "PIN must be 6 secret numeric digits.",
    "tokenAct.errPinMismatch": "PIN confirmation does not match the first PIN.",
    "tokenAct.errFailed": "Failed to activate token. Please try again.",

    // Student Access Gate Modal
    "gate.badge": "Protected Student Verification",
    "gate.title": "School Student Verification",
    "gate.subtitle": "Choose a verification method: School Access Code OR encrypted Personal Student Password.",
    "gate.tabCode": "1. Access Code",
    "gate.tabPassword": "2. Forgot Code? Use Password",
    "gate.codeLabel": "Step 1: Enter Student Access Code",
    "gate.codePlaceholder": "e.g., SCH-X1-8831",
    "gate.verifyCodeChecking": "Checking Access Code...",
    "gate.verifyCodeBtn": "Verify Code & Proceed to Step 2",
    "gate.twoStepNotice": "The system enforces 2-Step Verification: You must pair a personal password in Step 2 so your code slip cannot be misused by others.",
    "gate.passLabel": "Enter Personal Student Password",
    "gate.passPlaceholder": "Enter your secret password...",
    "gate.verifyPassChecking": "Checking Password...",
    "gate.verifyPassBtn": "Verify Password & Continue",
    "gate.passHint": "Personal password protects your access without carrying the physical code slip. If your password collides with another student, a secondary identifier is prompted.",
    "gate.collisionTitle": "Privacy Protected: Password Collision Detected",
    "gate.collisionDesc": "Multiple accounts in the system share this password. To protect your privacy, please enter a secondary verification:",
    "gate.collisionPlaceholder": "School Access Code OR Recovery Key (key-xxxx)",
    "gate.collisionBtn": "Verify with Additional Security",
    "gate.stepValidCode": "1. Valid Code",
    "gate.stepCreatePass": "2. Create Password (Required)",
    "gate.createPassTitle": "Create Personal Student Password",
    "gate.createPassDesc": "For 2-step verification security, you must set a password before accessing the report.",
    "gate.newPass": "New Password *",
    "gate.confirmPass": "Confirm Password *",
    "gate.minChars": "Min 4 characters",
    "gate.repeatPass": "Repeat password",
    "gate.savingPass": "Saving password...",
    "gate.savePassBtn": "Save Password & Continue",
    "gate.changeCode": "Change Code",
    "gate.passSaved": "Password successfully saved! Opening session...",
    "gate.stepEnterPass": "2. Enter Password",
    "gate.enterPassTitle": "Enter Personal Student Password",
    "gate.enterPassDesc": "This access code is protected by your password. Enter password to open access.",
    "gate.successTitle": "Student Verification Successful!",
    "gate.successDesc": "Your report is authenticated from an internal student, and your identity remains 100% anonymous.",
    "gate.validationStatus": "Validation Status:",
    "gate.verifiedStudent": "Verified School Student",
    "gate.encryptedPass": "Encrypted Password:",
    "gate.startReportBtn": "Start Writing Report Now",
    "gate.closeBtn": "Close",
    "gate.footer": "PPKSP Task Force Indonesian Educational Units",
    "footer.subtitle": "PPKSP • Student Voice",
  },
  id: {
    // Brand & Navigation
    "brand.name": "Ruang Aman",
    "brand.tagline": "PPKSP • Suara Siswa",
    "brand.satgas": "Satgas PPKSP",
    "nav.home": "Beranda",
    "nav.about": "Tentang",
    "nav.howItWorks": "Cara Melapor",
    "nav.track": "Pantau Tiket",
    "nav.help": "Pusat Bantuan",
    "nav.contact": "Kontak",
    "nav.transparency": "Transparansi",
    "nav.reportAnonymous": "Lapor Anonim",
    "nav.staffLogin": "Masuk Petugas",
    "nav.logout": "Keluar",
    "nav.disguiseTooltip": "Mode Samaran: Tutupi layar seketika jadi materi pelajaran (ESC 2x)",

    // Roles & Badges
    "role.student": "Siswa / Pelapor",
    "role.counselor": "Ruang Kerja Guru BK / Satgas Sekolah",
    "role.admin": "Konsol Admin Sistem (Manajemen User & IT)",
    "role.dinasPendidikan": "Portal Pengawasan Dinas Pendidikan",
    "role.dinasPerlindungan": "Portal Intervensi UPTD PPA",

    // Hero Section
    "hero.badge": "Platform Nasional PPKSP",
    "hero.badgeSub": "Sesuai Permendikbudristek No. 46/2023",
    "hero.title1": "Suaramu Berarti.",
    "hero.title2": "Kami Siap Mendengarkan & Melindungi.",
    "hero.copy":
      "Kanal resmi pencegahan dan penanganan kekerasan untuk seluruh siswa, pendidik, dan warga sekolah di 38 Provinsi Indonesia. Identitasmu sepenuhnya terlindungi dengan teknologi privasi tanpa pelacakan jejak.",
    "hero.stat1": "38 Provinsi Terkoneksi",
    "hero.stat2": "Sesuai Regulasi PPKSP 46/2023",
    "hero.stat3": "Dikelola Sekolah, Dinas & Mitra",
    "hero.createReport": "Buat Laporan Baru",
    "hero.createReportSub": "Ceritakan apa yang kamu alami atau saksikan. 100% anonim, tanpa perlu login akun.",
    "hero.trackTicket": "Pantau Tiket & Balas Chat",
    "hero.trackTicketSub": "Sudah pernah melapor? Cek tanggapan dan update tanpa mengungkapkan identitas.",
    "hero.ticketPlaceholder": "Contoh: TMG-2026-XXXX",
    "hero.trackBtn": "Periksa",
    "hero.trustChip1": "Aman",
    "hero.trustChip1Sub": "Anonim\nTerenkripsi",
    "hero.trustChip2": "Didengar",
    "hero.trustChip2Sub": "Ditindaklanjuti\nDilindungi",

    // Protection Pillars
    "prot.title": "Ekosistem Perlindungan Terpadu",
    "prot.sub": "Dirancang untuk memastikan siswa merasa aman, didengar, dan didampingi di setiap langkah.",
    "prot.oneTitle": "Identitas Rahasia Mutlak",
    "prot.oneText": "Nama, nomor HP, dan informasi pribadi disaring otomatis. Tidak ada catatan digital yang bisa melacak perangkat Anda.",
    "prot.twoTitle": "Konseling Rahasia 2-Arah",
    "prot.twoText": "Dapat berkomunikasi langsung dengan Guru BK melalui ruang chat terenkripsi untuk mendapatkan bantuan dan tindak lanjut.",
    "prot.threeTitle": "Pendampingan Satgas PPKSP",
    "prot.threeText": "Laporan ditangani secara profesional oleh Satgas PPKSP sekolah dan berkoordinasi dengan pihak terkait jika diperlukan.",

    // Steps
    "steps.title": "Cara Kerja Perlindungan Ruang Aman",
    "steps.sub": "Tiga langkah sederhana dan aman agar suaramu didengar tanpa rasa takut.",
    "steps.oneTitle": "1. Tulis Laporan",
    "steps.oneText": "Pilih jenis masalah dan ceritakan peristiwa yang dialami. Tambahkan bukti jika ada.",
    "steps.twoTitle": "2. Simpan Kode Tiket",
    "steps.twoText": "Sistem memberikan nomor tiket rahasia. Simpan baik-baik untuk memantau perkembangan laporan.",
    "steps.threeTitle": "3. Terima Perlindungan",
    "steps.threeText": "Laporan akan ditindaklanjuti oleh sekolah dan instansi terkait sesuai prosedur yang berlaku.",

    // FAQs
    "faq.title": "Pertanyaan yang Sering Diajukan",
    "faq.q1": "Apakah identitas saya benar-benar tidak diketahui siapa pun?",
    "faq.a1": "Ya, 100% aman. Sistem Ruang Aman tidak mencatat nama, NISN, alamat IP, ataupun perangkat Anda. Data yang diterima Guru BK hanya kronologi kejadian dan bukti yang Anda lampirkan.",
    "faq.q2": "Bagaimana cara saya membaca tanggapan dari Guru BK?",
    "faq.a2": "Setelah melapor, Anda akan menerima Nomor Tiket unik. Simpan nomor tersebut. Anda dapat memasukkannya di menu 'Pantau Tiket' kapan saja untuk melihat status dan melakukan chat 2-arah secara rahasia.",
    "faq.q3": "Apakah saya harus punya kode akses sekolah untuk melapor?",
    "faq.a3": "Kode sekolah digunakan untuk membuktikan keabsahan siswa tanpa meminta nama. Jika belum punya, Anda tetap dapat memasukkan kode wilayah sekolah.",
    "faq.q4": "Jenis kasus apa saja yang bisa dilaporkan?",
    "faq.a4": "Kekerasan fisik, perundungan (bullying), kekerasan seksual, diskriminasi/intoleransi, pemerasan, kebijakan diskriminatif, dan segala bentuk ketidaknyamanan di lingkungan sekolah sesuai Permendikbudristek No. 46/2023.",

    // Emergency Bar & Modal
    "emergency.barText": "Situasi darurat atau merasa tidak aman? Segera hubungi",
    "emergency.sapa": "SAPA 129",
    "emergency.police": "Polisi 110",
    "emergency.btn": "Kontak Darurat",
    "emergency.modalTitle": "Kontak Bantuan Darurat 24 Jam",
    "emergency.modalSubtitle": "Gunakan saat ada ancaman fisik langsung atau krisis keselamatan",
    "emergency.quickExit": "Tutup Cepat Darurat",

    // Anonymous Report Form
    "report.badge": "Gerbang Anonim Zero-Knowledge",
    "report.heading": "Formulir Laporan Aman & Terlindungi",
    "report.subheading": "Identitas Anda tidak pernah diminta atau disimpan. Seluruh data disensor di perangkat Anda.",
    "report.step1": "1. Kronologi Peristiwa",
    "report.step2": "2. Tinjauan & Enkripsi",
    "report.tokenLabel": "Kode Akses Sekolah (Opsional)",
    "report.tokenPlaceholder": "Contoh: SCH-X1-8831",
    "report.verifyTokenBtn": "Verifikasi Kode",
    "report.tokenSuccess": "Kode Sekolah Tervalidasi (Siswa Sah)",
    "report.schoolSelectLabel": "Pilih Satuan Pendidikan / Asal Sekolah",
    "report.categoryLabel": "Pilih Kategori Peristiwa",
    "report.urgencyLabel": "Tingkat Urgensi Laporan",
    "report.urgencyLow": "Rendah (Konsultasi Santai)",
    "report.urgencyMedium": "Sedang (Ketidaknyamanan / Intimidasi)",
    "report.urgencyHigh": "Tinggi (Kekerasan Fisik / Pemalakan)",
    "report.urgencyCritical": "Kritis (Ancaman Berat / Pelecehan)",
    "report.locationLabel": "Lokasi Kejadian (Kantin, Kelas, Medsos, dll.)",
    "report.dateLabel": "Waktu Perkiraan Kejadian",
    "report.storyLabel": "Ceritakan Kronologi Kejadian",
    "report.storyPlaceholder": "Tuliskan apa yang terjadi secara jelas. Jangan khawatir jika tak sengaja menyebut nama atau nomor telepon, sistem AI PII Stripper akan menyamarkannya.",
    "report.piiDetected": "Terdeteksi data identitas pribadi (nama, nomor HP, atau kelas).",
    "report.piiClean": "Teks bersih dari data pengenal pribadi.",
    "report.piiRedactBtn": "Samarkan PII Otomatis",
    "report.attachLabel": "Lampiran Bukti (Foto, Tangkapan Layar, atau Audio)",
    "report.nextBtn": "Lanjut: Tinjau & Enkripsi",
    "report.backBtn": "Kembali Edit",
    "report.pinLabel": "Buat 4-Digit PIN Darurat (Untuk pemulihan tiket)",
    "report.pinPlaceholder": "4 digit angka (misal: 7890)",
    "report.consent": "Saya menyatakan laporan ini benar dan dibuat untuk perlindungan serta penanganan bersama.",
    "report.submitBtn": "Kirim Laporan Terenkripsi ZKP",
    "report.zkpComputing": "Menghitung Bukti Zero-Knowledge (Poseidon Hash)...",
    "report.successTitle": "Laporan Berhasil Terkirim & Terenkripsi!",
    "report.successSubtitle": "Identitas Anda 100% terlindungi. Simpan kode tiket berikut untuk memantau tanggapan Guru BK.",
    "report.ticketCodeLabel": "Nomor Tiket Rahasia Anda",
    "report.recoveryKeyLabel": "Kunci Pemulihan Kata Sandi",
    "report.copySuccess": "Berhasil disalin!",
    "report.openChatBtn": "Buka Ruang Chat Rahasia",

    // Ticket Status & Chat
    "track.title": "Pantau Tiket & Chat Konselor",
    "track.subtitle": "Periksa perkembangan kasus, baca saran Guru BK, dan kirim pesan secara aman.",
    "track.inputLabel": "Masukkan Nomor Tiket",
    "track.inputPlaceholder": "Contoh: TMG-2026-78A1",
    "track.btn": "Periksa Status",
    "track.orPin": "Atau pulihkan dengan Kode Sekolah + PIN 4-digit",
    "track.timelineTitle": "Tahapan Investigasi Kasus",
    "track.chatTitle": "Ruang Konseling & Chat Rahasia 2-Arah",
    "track.chatEmpty": "Belum ada pesan. Ketik pesan di bawah untuk berdiskusi dengan Guru BK yang bertugas.",
    "track.sendPlaceholder": "Tulis pesan balasan atau pertanyaan Anda di sini...",
    "track.sendBtn": "Kirim Pesan",
    "track.evidenceTitle": "Bukti Penanganan dari Sekolah",
    "track.evidenceDesc": "Satgas sekolah telah mengunggah bukti penanganan kasus. Silakan tinjau dan konfirmasi keselamatan Anda.",
    "track.confirmSafeBtn": "Konfirmasi Kasus Selesai & Saya Merasa Aman",
    "track.confirmedBadge": "Kasus Telah Dinyatakan Tuntas oleh Siswa",

    // Unified Login
    "login.title": "Masuk ke Ruang Aman",
    "login.subtitle": "Satu portal akses untuk Guru BK, Satgas Sekolah, Dinas Pendidikan, dan UPTD PPA.",
    "login.email": "Email Resmi",
    "login.password": "Kata Sandi",
    "login.submit": "Masuk",
    "login.verifying": "Memverifikasi kredensial...",
    "login.quickTitle": "Akun Uji Coba Cepat (Klik untuk mengisi):",

    // Disguise Mode (Camouflage)
    "disguise.title": "Simulasi Ujian Nasional Fisika & Matematika SMA",
    "disguise.timer": "Sisa Waktu: 42:15",
    "disguise.question": "Soal No. 14: Sebuah benda bermassa 2 kg bergerak di atas lantai licin dengan kecepatan 6 m/s. Hitung energi kinetiknya!",
    "disguise.exitHint": "Tekan ESC 2 kali atau klik tombol keluar kecil untuk kembali ke Ruang Aman.",
    "disguise.exitBtn": "Keluar dari Modul Ujian",

    // About Page
    "about.badge": "Tentang Ruang Aman & Satgas PPKSP",
    "about.title": "Mewujudkan Lingkungan Sekolah yang Aman, Inklusif, dan Bebas Kekerasan",
    "about.lead": "Ruang Aman adalah inisiatif teknologi digital berbasis privasi mutlak untuk mendukung implementasi Permendikbudristek No. 46 Tahun 2023.",
    "about.pillar1": "Privasi Matematis",
    "about.pillar1Desc": "Kriptografi Semaphore ZKP menjamin pembuktian keabsahan siswa tanpa menyimpan identitas.",
    "about.pillar2": "Koordinasi Lintas Sektor",
    "about.pillar2Desc": "Integrasi alur rujukan dari Guru BK ke Dinas Pendidikan dan pendampingan UPTD PPA.",
    "about.pillar3": "Akuntabilitas Berbasis Bukti",
    "about.pillar3Desc": "Audit log kriptografi tak terhapus dan standarisasi Berita Acara Pemeriksaan (BAP) digital.",

    // App & Common
    "app.quickExitTitle": "Keluar Cepat: Bersihkan jejak seketika (ESC 2x)",
    "app.quickExit": "Keluar Cepat",
    "nav.report": "Lapor",
    "nav.status": "Status",
    "footer.nationalPlatform": "Platform Nasional PPKSP",
    "footer.regulation": "Sesuai Permendikbudristek No. 46/2023",

    // Help Center
    "help.badge": "Pusat Bantuan & Panduan Siswa",
    "help.title": "Ada yang Bisa Kami Bantu?",
    "help.sub": "Cari panduan langkah pelaporan, jaminan privasi kriptografis, dan informasi perlindungan hukum anak.",
    "help.searchPlaceholder": "Cari artikel bantuan, FAQ, atau kata kunci...",
    "help.bannerBadge": "Pendampingan Ramah Anak & Guru BK",
    "help.bannerTitle": "Jangan Ragu, Kamu Tidak Sendirian",
    "help.bannerSub": "Semua proses konsultasi dan tindak lanjut dijamin bebas intimidasi, didampingi guru konselor bersertifikasi, dan hak privasimu dilindungi penuh oleh undang-undang.",
    "help.catAll": "Semua",
    "help.catReport": "Cara Melapor",
    "help.catPrivacy": "Privasi & Keamanan",
    "help.catTracking": "Tracking Tiket",
    "help.catTokens": "Akun & Token",
    "help.catPolicy": "Kebijakan Sekolah",
    "help.closeArticle": "Tutup Artikel",
    "help.startReport": "Mulai Buat Laporan",
    "help.keyGuides": "Panduan Utama & Topik Bantuan",
    "help.readFull": "Baca Panduan Selengkapnya",
    "help.faqTitle": "Pertanyaan yang Sering Diajukan (FAQ)",
    "help.faqSub": "Jawaban langsung seputar kerahasiaan identitas, tindak lanjut, dan operasional aplikasi.",
    "help.moreQuestions": "Masih Memiliki Pertanyaan Lain?",
    "help.moreQuestionsSub": "Hubungi saluran bantuan resmi kami atau kirim pesan rahasia langsung ke tim Guru BK.",
    "help.sendOfficial": "Kirim Pesan Resmi",

    // Contact Page
    "contact.bannerBadge": "Hubungi Tim Ruang Aman & Satgas Sekolah",
    "contact.bannerTitle": "Kontak Layanan Dukungan",
    "contact.bannerSub": "Kirimkan saran, permohonan sosialisasi, atau pertanyaan resmi kepada pengelola sistem dan konselor sekolah.",
    "contact.formTitle": "Formulir Pesan Resmi",
    "contact.formNotice": "Jika ini adalah perundungan langsung, gunakan menu Lapor Anonim untuk perlindungan enkripsi penuh.",
    "contact.sentTitle": "Pesan Anda Berhasil Terkirim!",
    "contact.sentSub": "Tim pengelola akan meninjau dan merespons pertanyaan Anda dalam 1x24 jam kerja.",
    "contact.sendAnother": "Kirim Pesan Lainnya",
    "contact.nameLabel": "Nama / Inisial (Opsional):",
    "contact.namePlaceholder": "Boleh dikosongkan jika anonim",
    "contact.emailLabel": "Email Kontak / Balasan:",
    "contact.emailPlaceholder": "email.anda@contoh.com",
    "contact.categoryLabel": "Kategori Pesan:",
    "contact.catService": "Pertanyaan Layanan",
    "contact.catToken": "Kendala Kartu Token",
    "contact.catFeedback": "Saran & Masukan",
    "contact.catConsult": "Konsultasi Guru / Orang Tua",
    "contact.catOther": "Lainnya",
    "contact.subjectLabel": "Subjek / Judul:",
    "contact.subjectPlaceholder": "Perihal pesan Anda",
    "contact.messageLabel": "Isi Pesan:",
    "contact.messagePlaceholder": "Tuliskan pertanyaan atau informasi yang ingin disampaikan...",
    "contact.sendError": "Gagal mengirim pesan. Pastikan server backend berjalan dan coba lagi.",
    "contact.sending": "Mengirim...",
    "contact.submitBtn": "Kirim Pesan Dukungan",
    "contact.dirHeader": "INFORMASI RESMI",
    "contact.dirTitle": "Sekretariat BK & PPKSP",
    "contact.dirSubtitle": "Pusat Pelayanan Terpadu Perlindungan Siswa",
    "contact.emailTitle": "Email Pengaduan:",
    "contact.phoneTitle": "Hotline Siaga BK (WA):",
    "contact.phoneNote": "(Chat Khusus)",
    "contact.hoursTitle": "Jam Layanan Konseling:",
    "contact.hoursValue": "Senin – Jumat: 07.00 – 17.00 WIB",
    "contact.hoursNote": "Pelaporan online aktif 24 jam",
    "contact.locationTitle": "Alamat Fisik Safe Room:",
    "contact.locationValue": "Ruang Bimbingan Konseling (Gedung Utama Sayap Timur Lt. 2)",
    "contact.dirFooter": "Semua laporan fisik maupun daring dijamin kerahasiaannya di bawah sumpah Kode Etik Bimbingan Konseling Indonesia (ABKIN).",

    // Transparency Page
    "transparency.badge": "Keterbukaan & Standar Keamanan Kriptografi",
    "transparency.title": "Transparansi & Jaminan Privasi Mutlak",
    "transparency.sub": "Kami percaya rasa aman berawal dari transparansi. Pahami bagaimana Ruang Aman melindungi identitas Anda dan batasan teknis sistem.",
    "transparency.bannerBadge": "Protokol Kriptografi Terbuka Semaphore",
    "transparency.bannerTitle": "Server Tidak Pernah Mampu Mengetahui Identitas Anda",
    "transparency.bannerSub": "Bukan sekadar janji tidak mencatat, namun sistem dibatasi secara matematis. Bukti keanggotaan (Zero-Knowledge Proof) dihitung sepenuhnya di browser perangkat Anda sebelum data dikirim.",
    "transparency.p1Title": "1. Anonimitas Kriptografis",
    "transparency.p1Desc": "Menggunakan arsitektur Zero-Knowledge Proof (ZKP). Server memverifikasi bahwa pelapor adalah siswa sah tanpa perlu tahu siapa nama siswa tersebut.",
    "transparency.p2Title": "2. Tanpa Jejak Digital (Zero Log)",
    "transparency.p2Desc": "Server kami tidak mencatat alamat IP, tidak menyimpan User-Agent perangkat, dan tidak melacak jejak GPS foto (EXIF stripping otomatis).",
    "transparency.p3Title": "3. Anti-Spam Kriptografis",
    "transparency.p3Desc": "Perangkat menjalankan kalkulasi Proof-of-Work ringan di browser sebelum mengirim, mencegah serangan bot flood tanpa membatasi hak lapor siswa.",
    "transparency.limitsTitle": "Keterbatasan Sistem yang Wajib Diketahui",
    "transparency.limitsSub": "Ruang Aman adalah instrumen pengaduan dan konseling, bukan pengganti penanganan kepolisian instan.",
    "transparency.limit1Title": "Bukan Layanan Darurat Kecepatan Detik:",
    "transparency.limit1Desc": "Jika Anda sedang dalam bahaya fisik maut, pendarahan, atau ancaman senjata detik ini juga, segera hubungi SAPA 129 atau Polisi 110, atau cari perlindungan fisik langsung ke ruang guru terdekat.",
    "transparency.limit2Title": "Isi Cerita Bisa Membocorkan Identitas:",
    "transparency.limit2Desc": "Meskipun sistem kami memiliki sensor otomatis PII, jika Anda secara sengaja menuliskan nomor absen atau peristiwa yang hanya dialami oleh Anda seorang diri di satu kelas tertentu, pembaca laporan mungkin dapat menebak identitas Anda secara kontekstual.",
    "transparency.sopStudentTitle": "Panduan Khusus Siswa",
    "transparency.sopStudent1": "Gunakan kata-kata yang jelas mengenai lokasi dan bentuk perundungan.",
    "transparency.sopStudent2": "Gunakan fitur Sensor Otomatis untuk menyamarkan nama teman atau kelas.",
    "transparency.sopStudent3": "Simpan Nomor Tiket di tempat yang aman dan jangan bagikan ke teman lain.",
    "transparency.sopStudent4": "Manfaatkan tombol Keluar Cepat (ESC) jika ada orang mendekat.",
    "transparency.sopCounselorTitle": "SOP Satgas PPKSP & Guru BK",
    "transparency.sopCounselor1": "Dilarang mencari tahu identitas pelapor atau menanyakan nama saat berbalas pesan.",
    "transparency.sopCounselor2": "Lakukan intervensi berdasarkan patroli rutin atau mediasi umum, bukan pemanggilan sepihak.",
    "transparency.sopCounselor3": "Berikan respons pada kanal chat dalam kurun waktu maksimal 1x24 jam kerja.",
    "transparency.sopCounselor4": "Jaga kerahasiaan catatan internal BK di bawah sumpah profesi konseling.",
    "transparency.ctaTitle": "Siap Menggunakan Ruang Aman?",
    "transparency.ctaSub": "Laporkan kejadian sekarang dengan jaminan privasi penuh tanpa syarat.",
    "transparency.ctaBtn": "Lapor Anonim Sekarang",

    // News Section
    "news.bannerBadge": "Kanal Berita & Edukasi Ruang Aman",
    "news.bannerTitle": "Berita & Edukasi Perlindungan Siswa",
    "news.bannerSub": "Kumpulan informasi resmi, panduan pencegahan perundungan, regulasi PPKSP, dan edukasi kesehatan mental untuk menciptakan sekolah yang aman dan inklusif.",
    "news.featured": "Sorotan Utama",
    "news.readMore": "Baca Selengkapnya",
    "news.searchPlaceholder": "Cari artikel, topik, regulasi...",
    "news.emptyTitle": "Tidak ada artikel ditemukan",
    "news.emptySub": "Coba gunakan kata kunci pencarian lain atau pilih kategori Semua untuk menampilkan seluruh artikel.",
    "news.calloutTitle": "Mengalami atau Menyaksikan Kejadian Serupa?",
    "news.calloutSub": "Jangan simpan sendiri. Suaramu dilindungi oleh enkripsi penuh. Buat pengaduan anonim sekarang dan dapatkan pertolongan dari Guru BK.",
    "news.calloutBtn": "Buat Laporan Sekarang",
    "news.catAll": "Semua",
    "news.catReg": "Regulasi & PPKSP",
    "news.catAntiBullying": "Edukasi Anti-Bullying",
    "news.catMentalHealth": "Kesehatan Mental",
    "news.catDigital": "Keamanan Digital",

    // Kiosk Mode & Session
    "kiosk.activeBadge": "Mode Kios Aktif",
    "kiosk.sharedDeviceNotice": "Perangkat Bersama (Tanpa Rekam Jejak / Auto-Purge dalam 3 Menit)",
    "kiosk.timeLeft": "Sisa Waktu:",
    "kiosk.extend": "+3 Mnt",
    "kiosk.extendTitle": "Tambah Waktu Sesi (+3 Menit)",
    "kiosk.endAndWipe": "Selesai & Bersihkan",
    "kiosk.endTitle": "Akhiri Sesi Sekarang & Hapus Semua Cache",
    "kiosk.sessionActive": "SESI AKTIF PERANGKAT BERSAMA",
    "kiosk.title": "Mode Kios Sekolah Sedang Berjalan",
    "kiosk.desc": "Sistem akan menghapus seluruh data tampilan secara otomatis jika tidak ada aktivitas selama 3 menit.",
    "kiosk.quickReportTitle": "1. Buat Laporan Cepat",
    "kiosk.quickReportDesc": "Kirim pengaduan perundungan/kekerasan secara instan tanpa meninggalkan jejak di komputer ini.",
    "kiosk.checkStatusTitle": "2. Cek Status Tiket",
    "kiosk.checkStatusDesc": "Pantau tindak lanjut laporan sebelumnya dan kirim pesan rahasia menggunakan Nomor Tiket.",
    "kiosk.safetyTitle": "Prinsip Keamanan Privasi Mode Kios",
    "kiosk.rule1": "Seluruh cache peramban, cookie, dan sesi memori lokal langsung dihancurkan saat keluar atau habis waktu.",
    "kiosk.rule2": "Formulir input tidak menyimpan riwayat pengetikan otomatis (autocomplete disabled).",
    "kiosk.rule3": "Tekan ESC dua kali atau klik tombol 'Selesai & Bersihkan' jika ada orang mendekat.",
    "kiosk.endSessionBtn": "Akhiri Sesi Kios & Hapus Bersih Jejak",

    // Token Activation
    "tokenAct.title": "Aktivasi Kode Akses Sekolah",
    "tokenAct.subtitle": "Aktifkan kode akses sekolah Anda dan buat PIN pribadi untuk melapor secara aman.",
    "tokenAct.step1": "1. Masukkan Kode Sekolah",
    "tokenAct.step2": "2. Buat PIN 6-Digit",
    "tokenAct.step3": "3. Simpan Kunci Pemulihan",
    "tokenAct.inputLabel": "Kode Akses Sekolah",
    "tokenAct.inputPlaceholder": "Contoh: SCH-X1-8831",
    "tokenAct.verifyBtn": "Verifikasi Kode",
    "tokenAct.pinLabel": "Buat 6-Digit PIN Rahasia",
    "tokenAct.pinConfirmLabel": "Konfirmasi 6-Digit PIN Rahasia",
    "tokenAct.pinHint": "Ingat baik-baik PIN ini. Diperlukan untuk masuk atau memeriksa laporan.",
    "tokenAct.savePinBtn": "Simpan PIN & Selesaikan Aktivasi",
    "tokenAct.successTitle": "Aktivasi Berhasil!",
    "tokenAct.successSubtitle": "Kode sekolah Anda kini aktif dan terlindungi dengan PIN rahasia Anda.",
    "tokenAct.recoveryKeyTitle": "Kunci Pemulihan Darurat Anda",
    "tokenAct.recoveryKeyDesc": "Simpan frasa sandi ini di tempat aman. Jika lupa PIN, ini adalah SATU-SATUNYA cara memulihkan akses.",
    "tokenAct.copyBtn": "Salin Kunci Pemulihan",
    "tokenAct.proceedBtn": "Lanjut ke Formulir Laporan Anonim",

    // Kiosk Mode additional
    "kiosk.headerBadge": "Komputer Lab / Tablet Sekolah",
    "kiosk.headerTitle": "Mode Kios (Perangkat Bersama)",
    "kiosk.headerSubtitle": "Dirancang khusus bagi siswa yang menggunakan komputer perpustakaan atau lab sekolah tanpa meninggalkan riwayat penelusuran.",
    "kiosk.feat1Title": "Batas Waktu 3 Menit",
    "kiosk.feat1Desc": "Sesi terputus otomatis bila ditinggalkan tanpa aktivitas.",
    "kiosk.feat2Title": "Zero-Storage Cache",
    "kiosk.feat2Desc": "Tidak menyimpan cookie, password, ataupun histori browser.",
    "kiosk.feat3Title": "Enkripsi Sesi Ephemeral",
    "kiosk.feat3Desc": "Kunci enkripsi dihancurkan seketika saat sesi ditutup.",
    "kiosk.inputLabel": "Masukkan Kode Sesi Petugas TU atau Kode Pemulihan:",
    "kiosk.inputPlaceholder": "Contoh: TU-SMAN1-2025 atau kata-kunci-pemulihan",
    "kiosk.demoCodesLabel": "Gunakan Kode Sesi Demo Petugas TU:",
    "kiosk.startBtn": "Mulai Sesi Bersih (3 Menit)",
    "kiosk.errEmpty": "Masukkan kode sesi TU atau kode pemulihan Anda.",
    "kiosk.errInvalid": "Kode sesi tidak valid. Gunakan kode TU dari petugas atau Kode Pemulihan tiket Anda.",
    "kiosk.warnTitle": "Peringatan Keamanan Komputer Bersama:",
    "kiosk.warnDesc": "Pastikan tidak ada orang lain di belakang Anda yang dapat mengintip layar. Tekan tombol \"Selesai & Bersihkan\" saat Anda hendak meninggalkan komputer.",
    "kiosk.endWipeBtn": "Akhiri Sesi & Hapus Seluruh Memori",

    // Token Activation additional
    "tokenAct.badge": "Kartu Fisik / Digital Sekolah",
    "tokenAct.headerDesc": "Aktivasi token verifikasi dari sekolah dalam 3 langkah sederhana untuk memastikan keamanan lokal tanpa mengirim identitas pribadi ke server.",
    "tokenAct.step1Card": "Langkah 1: Masukkan Kode Token Sekolah",
    "tokenAct.step1CardDesc": "Token adalah kombinasi acak yang tercetak pada kartu privasi fisik yang dibagikan sekolah.",
    "tokenAct.tokenCardLabel": "Nomor Token Kartu Siswa:",
    "tokenAct.tokenPlaceholder": "Contoh: TMG-SCH-8831",
    "tokenAct.nextToPin": "Lanjut ke Buat PIN",
    "tokenAct.step2Card": "Langkah 2: Buat PIN 6-Digit Lokal",
    "tokenAct.step2CardDesc": "PIN ini hanya disimpan di memori browser perangkat Anda sendiri dan tidak pernah dikirim ke server.",
    "tokenAct.pinGuarantee": "Privasi Mutlak PIN:",
    "tokenAct.pinGuaranteeDesc": "Guru, staf sekolah, maupun developer Ruang Aman tidak memiliki akses terhadap PIN ini.",
    "tokenAct.createPinLabel": "Buat PIN 6 Digit:",
    "tokenAct.confirmPinLabel": "Konfirmasi PIN:",
    "tokenAct.backBtn": "Kembali",
    "tokenAct.activateSaveBtn": "Aktivasi & Simpan Pemulihan",
    "tokenAct.successMsg": "Token Berhasil Diaktivasi!",
    "tokenAct.successDesc": "Simpan kode pemulihan berikut jika Anda perlu mengakses akun dari perangkat lain atau jika lupa PIN.",
    "tokenAct.recoveryKeyHeader": "KODE PEMULIHAN (RECOVERY KEY)",
    "tokenAct.secretChars": "16 Karakter Rahasia",
    "tokenAct.copied": "Tersalin!",
    "tokenAct.copy": "Salin",
    "tokenAct.recoveryNotice": "Catat kode ini di buku catatan pribadi atau simpan di pengelola kata sandi Anda.",
    "tokenAct.startReportNow": "Mulai Buat Laporan Anonim Sekarang",
    "tokenAct.activateAnother": "Aktivasi Token Lain",
    "tokenAct.errAlreadyActive": "Token sudah diaktivasi sebelumnya. Gunakan Kode Pemulihan untuk masuk.",
    "tokenAct.errNotFound": "Kode Akses Siswa tidak valid atau tidak ditemukan.",
    "tokenAct.errPinDigits": "PIN harus berupa 6 angka rahasia.",
    "tokenAct.errPinMismatch": "Konfirmasi PIN tidak cocok dengan PIN pertama.",
    "tokenAct.errFailed": "Gagal mengaktifkan token. Silakan coba lagi.",

    // Student Access Gate Modal
    "gate.badge": "Verifikasi Siswa Terproteksi",
    "gate.title": "Verifikasi Siswa SMAN 1",
    "gate.subtitle": "Pilih salah satu cara verifikasi: Kode Akses Sekolah ATAU Sandi Pribadi Pelajar yang tersimpan terenkripsi.",
    "gate.tabCode": "1. Kode Akses",
    "gate.tabPassword": "2. Lupa Kode? Gunakan Sandi",
    "gate.codeLabel": "Langkah 1: Masukkan Kode Akses Siswa",
    "gate.codePlaceholder": "Contoh: SCH-X1-8831",
    "gate.verifyCodeChecking": "Memeriksa Kode Akses...",
    "gate.verifyCodeBtn": "Verifikasi Kode & Lanjut Langkah 2",
    "gate.twoStepNotice": "Sistem menerapkan Verifikasi 2 Langkah: Anda wajib memasangkan kata sandi pribadi pada Langkah 2 agar slip kode tidak bisa disalahgunakan orang lain.",
    "gate.passLabel": "Masukkan Sandi Pribadi Pelajar",
    "gate.passPlaceholder": "Masukkan sandi rahasia Anda...",
    "gate.verifyPassChecking": "Memeriksa Sandi...",
    "gate.verifyPassBtn": "Verifikasi Sandi & Lanjut",
    "gate.passHint": "Sandi pribadi melindungi akses Anda tanpa perlu membawa slip kode sekolah. Jika sandi Anda sama dengan siswa lain, sistem akan meminta pengenal cadangan.",
    "gate.collisionTitle": "Privasi Terlindungi: Tabrakan Sandi Terdeteksi",
    "gate.collisionDesc": "Terdeteksi lebih dari satu akun di sistem dengan kata sandi yang sama. Demi melindungi privasi Anda, sistem meminta verifikasi tambahan:",
    "gate.collisionPlaceholder": "Kode Akses Sekolah ATAU Kunci Pemulihan (kunci-xxxx)",
    "gate.collisionBtn": "Verifikasi dengan Pengaman Tambahan",
    "gate.stepValidCode": "1. Kode Valid",
    "gate.stepCreatePass": "2. Buat Sandi (Wajib)",
    "gate.createPassTitle": "Buat Kata Sandi Pribadi Pelajar",
    "gate.createPassDesc": "Untuk keamanan verifikasi 2-langkah, Anda wajib membuat sandi sebelum membuka laporan.",
    "gate.newPass": "Sandi Baru *",
    "gate.confirmPass": "Konfirmasi Sandi *",
    "gate.minChars": "Min 4 karakter",
    "gate.repeatPass": "Ulangi sandi",
    "gate.savingPass": "Menyimpan sandi...",
    "gate.savePassBtn": "Simpan Sandi & Lanjut",
    "gate.changeCode": "Ganti Kode",
    "gate.passSaved": "Sandi berhasil disimpan! Membuka sesi...",
    "gate.stepEnterPass": "2. Masukkan Sandi",
    "gate.enterPassTitle": "Masukkan Sandi Pribadi Pelajar",
    "gate.enterPassDesc": "Kode akses ini terproteksi oleh kata sandi Anda. Masukkan sandi untuk membuka akses.",
    "gate.successTitle": "Verifikasi Pelajar Berhasil!",
    "gate.successDesc": "Laporan Anda sah dari siswa internal dan identitas Anda 100% anonim.",
    "gate.validationStatus": "Status Validasi:",
    "gate.verifiedStudent": "Siswa Sah SMAN 1",
    "gate.encryptedPass": "Sandi Terenkripsi:",
    "gate.startReportBtn": "Mulai Tulis Laporan Sekarang",
    "gate.closeBtn": "Tutup",
    "gate.footer": "Satgas PPKSP Satuan Pendidikan Indonesia",
    "footer.subtitle": "PPKSP • Suara Siswa",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Default to 'en' as requested by the user ("ubah semua teks dalam web menggunakan bahasa inggris")
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem("ruang_aman_lang");
      if (stored === "id" || stored === "en") return stored;
    } catch {}
    return "en";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("ruang_aman_lang", newLang);
      document.documentElement.lang = newLang;
    } catch {}
  };

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[lang];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English if key missing in current language
    const fallbackDict = TRANSLATIONS.en;
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Dynamic Helpers for Data Mappings
export function getCategoryLabel(category: ReportCategory, lang: Language): string {
  if (lang === "id") return category;
  switch (category) {
    case "Perundungan / Bullying":
      return "Bullying / Harassment";
    case "Pelecehan Seksual":
      return "Sexual Harassment";
    case "Kekerasan Fisik":
      return "Physical Violence";
    case "Cyberbullying / Teror Online":
      return "Cyberbullying / Online Terror";
    case "Pemerasan / Pungli":
      return "Extortion / Blackmail";
    case "Kesehatan Mental / Krisis Diri":
      return "Mental Health & Peer Support";
    case "Lainnya":
    default:
      return "Other Issues";
  }
}

export function getStatusLabel(status: ReportStatus, lang: Language): string {
  if (lang === "id") {
    switch (status) {
      case "diterima":
        return "Diterima";
      case "ditinjau":
        return "Ditinjau";
      case "tindakan":
        return "Tindakan";
      case "menunggu_siswa":
        return "Konfirmasi Siswa";
      case "ditutup":
        return "Selesai";
      default:
        return status;
    }
  }
  switch (status) {
    case "diterima":
      return "Received";
    case "ditinjau":
      return "Under Review";
    case "tindakan":
      return "Action Taken";
    case "menunggu_siswa":
      return "Student Confirmation";
    case "ditutup":
      return "Resolved";
    default:
      return status;
  }
}

export function getStatusDesc(status: ReportStatus, lang: Language): string {
  if (lang === "id") {
    switch (status) {
      case "diterima":
        return "Laporan tersimpan rahasia & masuk antrean";
      case "ditinjau":
        return "Guru BK & Satgas PPKSP memeriksa laporan";
      case "tindakan":
        return "Langkah perlindungan & pemanggilan pihak terkait";
      case "menunggu_siswa":
        return "Sekolah kirim bukti, menunggu konfirmasi siswa";
      case "ditutup":
        return "Siswa konfirmasi tuntas & kondisi aman";
      default:
        return "";
    }
  }
  switch (status) {
    case "diterima":
      return "Report securely queued and stored";
    case "ditinjau":
      return "Counselor & PPKSP Task Force investigating";
    case "tindakan":
      return "Protective action & counselor intervention";
    case "menunggu_siswa":
      return "Resolution proof submitted, awaiting student confirmation";
    case "ditutup":
      return "Student confirmed safe & case concluded";
    default:
      return "";
  }
}

export function getUrgencyLabel(urgency: string, lang: Language): string {
  if (lang === "id") return urgency;
  switch (urgency?.toLowerCase()) {
    case "rendah":
      return "Low";
    case "sedang":
      return "Medium";
    case "tinggi":
      return "High";
    case "darurat":
    case "kritis":
      return "Critical / Emergency";
    default:
      return urgency;
  }
}

// Help Article and FAQ Translation Helpers
export function translateHelpArticle<T extends { id: string; title: string; category: string; readTime?: string; excerpt: string; content: string[] }>(
  art: T,
  lang: Language,
): T {
  if (lang === "id") return art;

  const EN_ARTICLES: Record<string, Partial<T>> = {
    "art-1": {
      title: "How to Report Anonymously on Ruang Aman?",
      category: "How to Report",
      readTime: "3 min read",
      excerpt: "A simple 4-step guide to reporting without fear of identity leaks or exposure to classmates.",
      content: [
        "1. Open the Anonymous Report (Ruang Aman) page.",
        "2. Select the incident category and your involvement (victim or witness).",
        "3. Describe the chronology clearly. Our AI PII Stripper automatically detects and censors any inadvertently mentioned names or class identifiers.",
        "4. Upload attachments if available (photos or audio). Our system automatically strips GPS EXIF metadata.",
        "5. Save your secret Ticket Number and Recovery Passphrase to track progress and chat 2-way with counselors.",
      ],
    } as any,
    "art-2": {
      title: "Cryptographic Privacy Guarantees & Zero-Knowledge Proof",
      category: "Privacy & Security",
      readTime: "4 min read",
      excerpt: "Technical explanation of how the system ensures our server never stores your IP, MAC Address, or identity.",
      content: [
        "Ruang Aman is engineered around Zero-Knowledge Architecture principles.",
        "The server does not record IP addresses (IP anonymization), ignores User-Agent device headers, and rounds timestamps to prevent network correlation attacks.",
        "Report contents are end-to-end encrypted so only authorized BK Counselors can view the chronology within the verified school perimeter.",
        "Your security PIN is stored strictly on your local browser and never transmitted across the open internet.",
      ],
    } as any,
    "art-3": {
      title: "How to Use Ticket Numbers & Safely Chat with Counselors",
      category: "Ticket Tracking",
      readTime: "2 min read",
      excerpt: "A guide to tracking case progress and replying to counselor advice without logging into an account.",
      content: [
        "After submitting a report, you receive a secret Ticket Number (e.g. TMG-2026-XXXX).",
        "Open 'Track Ticket', enter the number to view real-time investigation stages.",
        "If counselors send clarification requests or offer safe meeting options, reply directly through the encrypted chat room.",
        "All conversations are strictly confidential under the professional Guidance and Counseling code of ethics.",
      ],
    } as any,
    "art-4": {
      title: "Kiosk Mode Guide for Shared School Computers",
      category: "Tokens & Accounts",
      readTime: "3 min read",
      excerpt: "Safe steps for using school computer labs or shared library tablets without leaving browsing traces.",
      content: [
        "If you do not have a personal device and need to report from a school lab, use Kiosk Mode.",
        "Kiosk Mode accepts a temporary Session Code (provided on token slips or staff).",
        "Each session has an automatic 3-minute inactivity timer to prevent others from viewing your screen.",
        "When the session ends or you click Wipe, all local cache and memory are permanently destroyed immediately.",
      ],
    } as any,
    "art-5": {
      title: "School PPKSP Task Force SOP & Victim Protection Policies",
      category: "School Policies",
      readTime: "5 min read",
      excerpt: "Student protection rights under Permendikbudristek No. 46/2023 on Violence Prevention and Handling.",
      content: [
        "Every student has the right to a safe educational space free from intimidation, extortion, harassment, and discrimination.",
        "The PPKSP Task Force is strictly forbidden from disclosing reporter identities to alleged perpetrators or unauthorized parties.",
        "Schools guarantee psychological care through free counseling and the protection of educational continuity.",
        "Perpetrators receive progressive educational, administrative, and disciplinary actions under regulatory frameworks.",
      ],
    } as any,
  };

  const override = EN_ARTICLES[art.id];
  if (override) {
    return { ...art, ...override };
  }
  return art;
}

export function translateFAQItem<T extends { id: string; category: string; question: string; answer: string }>(
  faq: T,
  lang: Language,
): T {
  if (lang === "id") return faq;

  const EN_FAQS: Record<string, Partial<T>> = {
    "faq-1": {
      category: "Privacy & Confidentiality",
      question: "Can counselors or homeroom teachers find out who filed the report?",
      answer: "No. Ruang Aman does not store reporter identities, emails, phone numbers, device names, or IP addresses. Reports only contain a random ticket ID. Counselors only receive the factual chronology and evidence without ever learning who you are.",
    } as any,
    "faq-2": {
      category: "Privacy & Confidentiality",
      question: "What happens if I accidentally type my name or class in the story?",
      answer: "Ruang Aman features built-in Automated PII Detection. As you type, the system flags names, classes, student IDs, or contact numbers and offers a 1-click button to sanitize and redact them before sending.",
    } as any,
    "faq-3": {
      category: "Technical & Tickets",
      question: "What happens if I forget my ticket number?",
      answer: "If you saved the secret Recovery Passphrase issued during report submission or token activation, you can recover access. However, for absolute privacy, school staff cannot look up tickets by student name because no name associations exist.",
    } as any,
    "faq-4": {
      category: "Safety & Emergency Button",
      question: "What is the purpose of the 'Quick Exit' button?",
      answer: "If someone approaches you while viewing Ruang Aman, click 'Quick Exit' or press ESC twice. The screen immediately closes, clears data from device memory, and redirects your browser to Google search.",
    } as any,
    "faq-5": {
      category: "Token Activation",
      question: "What is the School Token card for?",
      answer: "Token cards are distributed randomly to students during orientation. They validate that the reporter is a legitimate member of the school without associating the token with any individual student name or record.",
    } as any,
    "faq-6": {
      category: "Emergencies",
      question: "Can Ruang Aman be used in urgent physical danger?",
      answer: "Ruang Aman is an intake and follow-up counseling platform. If you face immediate life-threatening physical danger or armed threats right now, call SAPA 129, Police 110, or open the Emergency Contacts menu immediately.",
    } as any,
  };

  const override = EN_FAQS[faq.id];
  if (override) {
    return { ...faq, ...override };
  }
  return faq;
}

