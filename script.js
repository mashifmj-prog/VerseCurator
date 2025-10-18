// Bible verses database - categorized by time of day
const bibleVerses = {
    morning: [
        {
            text: "The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.",
            reference: "Lamentations 3:22-23"
        },
        {
            text: "This is the day that the LORD has made; let us rejoice and be glad in it.",
            reference: "Psalm 118:24"
        },
        {
            text: "Let me hear in the morning of your steadfast love, for in you I trust. Make me know the way I should go, for to you I lift up my soul.",
            reference: "Psalm 143:8"
        },
        {
            text: "But I will sing of your strength; I will sing aloud of your steadfast love in the morning. For you have been to me a fortress and a refuge in the day of my distress.",
            reference: "Psalm 59:16"
        },
        {
            text: "Satisfy us in the morning with your steadfast love, that we may rejoice and be glad all our days.",
            reference: "Psalm 90:14"
        }
    ],
    afternoon: [
        {
            text: "Cast all your anxiety on him because he cares for you.",
            reference: "1 Peter 5:7"
        },
        {
            text: "And let us not grow weary of doing good, for in due season we will reap, if we do not give up.",
            reference: "Galatians 6:9"
        },
        {
            text: "The LORD is my strength and my shield; my heart trusts in him, and he helps me. My heart leaps for joy, and with my song I praise him.",
            reference: "Psalm 28:7"
        },
        {
            text: "But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
            reference: "Isaiah 40:31"
        },
        {
            text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
            reference: "Philippians 4:6"
        }
    ],
    general: [
        {
            text: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
            reference: "Jeremiah 29:11"
        },
        {
            text: "I can do all things through him who strengthens me.",
            reference: "Philippians 4:13"
        },
        {
            text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
            reference: "Romans 8:28"
        },
        {
            text: "The LORD is my shepherd; I shall not want.",
            reference: "Psalm 23:1"
        },
        {
            text: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.",
            reference: "Isaiah 41:10"
        }
    ]
};

// DOM Elements
const verseText = document.getElementById('verseText');
const verseReference = document.getElementById('verseReference');
const getVerseBtn = document.getElementById('getVerse');
const morningVerseBtn = document.getElementById('morningVerse');
const afternoonVerseBtn = document.getElementById('afternoonVerse');
const copyTextBtn = document.getElementById('copyText');
const shareTwitterBtn = document.getElementById('shareTwitter');
const shareWhatsAppBtn = document.getElementById('shareWhatsApp');
const shareEmailBtn = document.getElementById('shareEmail');
const downloadImageBtn = document.getElementById('downloadImage');
const timeDisplay = document.getElementById('timeDisplay');
const autoModeCheckbox = document.getElementById('autoMode');

let currentVerse = null;

// Initialize the app
function init() {
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000); // Update time every minute
    
    // Check if it's time to show auto-verse
    checkAutoVerse();
    
    // Set up event listeners
    getVerseBtn.addEventListener('click', getRandomVerse);
    morningVerseBtn.addEventListener('click', () => getTimeSpecificVerse('morning'));
    afternoonVerseBtn.addEventListener('click', () => getTimeSpecificVerse('afternoon'));
    copyTextBtn.addEventListener('click', copyVerseToClipboard);
    shareTwitterBtn.addEventListener('click', shareOnTwitter);
    shareWhatsAppBtn.addEventListener('click', shareOnWhatsApp);
    shareEmailBtn.addEventListener('click', shareViaEmail);
    downloadImageBtn.addEventListener('click', downloadVerseAsImage);
    autoModeCheckbox.addEventListener('change', toggleAutoMode);
}

// Update time display
function updateTimeDisplay() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    timeDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// Get random verse from all categories
function getRandomVerse() {
    const allVerses = [...bibleVerses.morning, ...bibleVerses.afternoon, ...bibleVerses.general];
    const randomVerse = allVerses[Math.floor(Math.random() * allVerses.length)];
    displayVerse(randomVerse);
}

// Get time-specific verse
function getTimeSpecificVerse(timeOfDay) {
    const verses = bibleVerses[timeOfDay];
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    displayVerse(randomVerse);
}

// Display verse
function displayVerse(verse) {
    currentVerse = verse;
    verseText.textContent = `"${verse.text}"`;
    verseReference.textContent = verse.reference;
}

// Copy verse to clipboard
function copyVerseToClipboard() {
    if (!currentVerse) return;
    
    const textToCopy = `"${currentVerse.text}" - ${currentVerse.reference}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Verse copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Share on Twitter
function shareOnTwitter() {
    if (!currentVerse) return;
    
    const text = `"${currentVerse.text}" - ${currentVerse.reference}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Share on WhatsApp
function shareOnWhatsApp() {
    if (!currentVerse) return;
    
    const text = `"${currentVerse.text}" - ${currentVerse.reference}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Share via Email
function shareViaEmail() {
    if (!currentVerse) return;
    
    const subject = 'Daily Bible Verse';
    const body = `"${currentVerse.text}" - ${currentVerse.reference}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
}

// Download as Image
function downloadVerseAsImage() {
    if (!currentVerse) return;
    
    const canvas = document.getElementById('verseCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    // Verse text
    ctx.font = 'bold 40px Playfair Display';
    wrapText(ctx, `"${currentVerse.text}"`, canvas.width / 2, 200, 1000, 50);
    
    // Reference
    ctx.font = '30px Inter';
    ctx.fillText(`- ${currentVerse.reference} -`, canvas.width / 2, 500);
    
    // Create download link
    const link = document.createElement('a');
    link.download = `bible-verse-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Helper function to wrap text
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineArray = [];

    for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            lineArray.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lineArray.push(line);

    for (let m = 0; m < lineArray.length; m++) {
        context.fillText(lineArray[m], x, y + (m * lineHeight));
    }
}

// Auto-verse functionality
function checkAutoVerse() {
    const now = new Date();
    const hour = now.getHours();
    const lastDisplay = localStorage.getItem('lastAutoVerseDisplay');
    const today = now.toDateString();
    
    // Only show auto-verse once per day
    if (lastDisplay === today) return;
    
    if (hour >= 5 && hour < 12) {
        // Morning (5 AM - 12 PM)
        getTimeSpecificVerse('morning');
    } else if (hour >= 12 && hour < 18) {
        // Afternoon (12 PM - 6 PM)
        getTimeSpecificVerse('afternoon');
    } else {
        // Evening (6 PM - 5 AM)
        getRandomVerse();
    }
    
    localStorage.setItem('lastAutoVerseDisplay', today);
}

function toggleAutoMode() {
    if (autoModeCheckbox.checked) {
        localStorage.setItem('autoMode', 'enabled');
        checkAutoVerse();
    } else {
        localStorage.setItem('autoMode', 'disabled');
    }
}

// Load auto-mode preference
window.addEventListener('load', () => {
    const autoMode = localStorage.getItem('autoMode');
    if (autoMode === 'enabled') {
        autoModeCheckbox.checked = true;
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', init);