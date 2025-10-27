# VerseCurator

**Curate • Share • Inspire**

VerseCurator is a mobile-first web app for discovering, curating, and sharing Bible verses. It delivers inspirational verses tailored to the time of day (e.g., Night mode at 03:23 AM SAST). Built with vanilla HTML, CSS, and JavaScript, it’s lightweight, offline-capable via LocalStorage, and hosted on GitHub Pages.

**Live Demo**: [https://mashifmj-prog.github.io/VerseCurator/](https://mashifmj-prog.github.io/VerseCurator/)

## Features
- **Time-Based Verses**: Displays verses based on the current time slot:
  - 🌅 Morning (5AM–12PM): Themes of renewal (e.g., Lamentations 3:22-23 ESV).
  - ☀️ Day (12PM–3PM): Strength and focus.
  - 🌇 Afternoon (3PM–6PM): Patience and faith.
  - 🌆 Evening (6PM–10PM): Gratitude and reflection.
  - 🌙 Night (10PM–5AM): Rest and peace.
- **Auto/Manual Mode**: Auto-detects time or lets users select a period.
- **Light/Dark Themes**: Toggle for better readability in any lighting.
- **Verse Sharing**: Share as text (via WhatsApp, Email, SMS, etc.) or as styled images (classic, parchment, nature, dark, colorful, sunrise themes). Image sharing uses Canvas API with optional watermarks.
- **Engagement Stats**: Tracks verses viewed, shared, favorited, and daily streaks.
- **Rating System**: Rate 1–5 stars with comments after sufficient use (10+ views or 2+ day streak).
- **Reminders**: Schedule verse-sharing reminders as calendar events (.ics files).
- **Custom Verses**: Add, edit, or delete personal verses with notes.
- **Share History**: View up to 15 recent shares with reshare/copy options.
- **Broadcast Mode**: Copy formatted verses for WhatsApp or social media.
- **Responsive Design**: Optimized for mobile with smooth modals and animations.

**Note**: Text sharing may have platform limitations; use image sharing for best results.

## Installation and Usage

### For Users
1. Open [https://mashifmj-prog.github.io/VerseCurator/](https://mashifmj-prog.github.io/VerseCurator/) in Chrome, Safari, or Edge.
2. View the current verse (e.g., Night mode at 03:23 AM SAST). Switch modes or translations via the control panel.
3. Share verses as text or images (select a theme like “parchment” for images).
4. Track stats (views, shares, streaks) and favorite verses.
5. Rate the app when prompted to help improve VerseCurator.

**Progressive Web App (PWA)**: Installable version coming soon—stay tuned!

### For Developers
1. Clone the repo:
   ```bash
   git clone https://github.com/mashifmj-prog/VerseCurator.git
