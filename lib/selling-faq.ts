export function sellingFaqs(location = 'Bangalore') {
  return [
    { question: `How do I sell my old laptop in ${location}?`, answer: 'Choose your brand and exact model, share its configuration and condition, and provide your contact details and pickup pincode. Our team can discuss the assessment and collection availability before you confirm the next step.' },
    { question: 'What affects the price of my used laptop?', answer: 'The processor or chip, RAM, storage, graphics, battery, display, age, repairs, and included accessories all matter. An initial estimate is not a final offer; the final price follows verification of your device.' },
    { question: 'Which brands can I choose from?', answer: 'Explore Apple, Dell, HP, Lenovo, ASUS, Acer, Microsoft, and other brands in the device catalog. If your exact model is missing, ask our team rather than selecting a different device.' },
    { question: 'When will I receive payment?', answer: 'Discuss the payment method and timing with the team and confirm the final amount after the assessment. Review the agreed payment arrangements before completing the handover.' },
    { question: `Is pickup available in ${location}?`, answer: 'Share your full address and pincode so the team can check collection coverage and available arrangements. Confirm the pickup time and any applicable terms before preparing for handover.' },
    { question: 'Can I sell a damaged or older laptop?', answer: 'Describe the faults, repair history, and whether it powers on. The team can discuss whether an assessment is possible. Acceptance and any offer depend on the actual device and condition.' },
    { question: 'How should I prepare my device?', answer: 'Create and verify a backup, list the accessories you intend to include, and keep the charger ready. When you are ready to proceed, sign out of personal accounts and remove linked device locks. Resolve employer ownership or management before selling a work device.' },
    { question: 'Can I sell a desktop too?', answer: 'Yes, choose the desktop category to begin. Include the form factor, processor, RAM, storage, and graphics. List monitors, keyboards, mice, and other peripherals separately so the assessment reflects what is included.' },
  ];
}
