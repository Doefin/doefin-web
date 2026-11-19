// Invite landing page, /invite?ref=CODE (SCRUM-571). Written with doefin-voice-writer;
// check:brand passed. Replace {partner} and {bonus} at render.
export const inviteCopy = {
  meta: {
    // Passed to seo() with absoluteTitle, or the title ends "… to Doefin | Doefin".
    partner: {
      title: '{partner} invited you to Doefin',
      description:
        'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty. Doefin is for professional investors only.',
    },
    generic: {
      title: 'You have been invited to Doefin',
      description:
        'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty. Doefin is for professional investors only.',
    },
  },
  button: 'Enter app',
  termsLink: 'Read the Doefin Rewards terms',
  // Shown under the button in every state.
  disclaimer:
    'Doefin is for professional investors only. You can lose the full amount paid for a position. Nothing here is investment advice.',
  states: {
    // Partner code, Doefin Rewards running, bonus present.
    partnerBonus: {
      heading: '{partner} invited you to Doefin.',
      body: [
        'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty.',
        'Join Doefin Rewards before your first trade to accept the invite. We pay a welcome bonus of {bonus} once you qualify under its terms.',
      ],
      note: 'Your invite code goes with you into the app.',
      showTermsLink: true,
    },
    // Personal code (no name), running, bonus present.
    personalBonus: {
      heading: 'You have been invited to Doefin.',
      body: [
        'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty.',
        'Join Doefin Rewards before your first trade to accept the invite. We pay a welcome bonus of {bonus} once you qualify under its terms.',
      ],
      note: 'Your invite code goes with you into the app.',
      showTermsLink: true,
    },
    // Running, no bonus.
    noBonus: {
      heading: '{partner} invited you to Doefin.',
      headingPersonal: 'You have been invited to Doefin.',
      body: [
        'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty.',
        'Join Doefin Rewards before your first trade to accept the invite.',
      ],
      note: 'Your invite code goes with you into the app.',
      showTermsLink: true,
    },
    // Valid code, Doefin Rewards not running (or its terms not published). Promises no bonus.
    programmeInactive: {
      heading: '{partner} invited you to Doefin.',
      headingPersonal: 'You have been invited to Doefin.',
      body: [
        'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty.',
        'Doefin Rewards is not running at the moment, so there is no welcome bonus.',
      ],
      note: null,
      showTermsLink: false,
    },
    // Code not found (unknown or switched off). The button goes to the app without the code.
    notFound: {
      heading: 'This invite code is not valid.',
      body: [
        'Ask whoever shared the link for a new one, or enter the app without an invite.',
        'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty.',
      ],
      note: null,
      showTermsLink: false,
    },
    // Lookup unavailable. Says nothing about whether the code is valid; the app checks it.
    lookupUnavailable: {
      heading: 'Take your invite code into the app.',
      body: [
        'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty.',
        'We could not check the code just now. The app checks it when you enter. If it is valid, join Doefin Rewards before your first trade to accept the invite.',
      ],
      note: null,
      showTermsLink: false,
    },
  },
} as const
