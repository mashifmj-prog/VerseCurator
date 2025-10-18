// Enhanced Bible verses database with multiple translations and occasions
const bibleVerses = {
    // Morning verses
    morning: {
        ESV: [
            { text: "The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.", reference: "Lamentations 3:22-23" },
            { text: "This is the day that the LORD has made; let us rejoice and be glad in it.", reference: "Psalm 118:24" }
        ],
        NIV: [
            { text: "Because of the LORD's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.", reference: "Lamentations 3:22-23" },
            { text: "The LORD is my strength and my shield; my heart trusts in him, and he helps me.", reference: "Psalm 28:7" }
        ],
        KJV: [
            { text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.", reference: "Lamentations 3:22-23" },
            { text: "This is the day which the LORD hath made; we will rejoice and be glad in it.", reference: "Psalm 118:24" }
        ]
    },
    
    // Afternoon verses
    afternoon: {
        ESV: [
            { text: "And let us not grow weary of doing good, for in due season we will reap, if we do not give up.", reference: "Galatians 6:9" },
            { text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" }
        ],
        NIV: [
            { text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", reference: "Galatians 6:9" },
            { text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" }
        ]
    },
    
    // Evening verses
    evening: {
        ESV: [
            { text: "In peace I will both lie down and sleep; for you alone, O LORD, make me dwell in safety.", reference: "Psalm 4:8" },
            { text: "The sun shall not strike you by day, nor the moon by night.", reference: "Psalm 121:6" }
        ]
    },
    
    // Night verses
    night: {
        ESV: [
            { text: "When I remember you upon my bed, and meditate on you in the watches of the night.", reference: "Psalm 63:6" },
            { text: "Be angry and do not sin; ponder in your own hearts on your beds, and be silent.", reference: "Psalm 4:4" }
        ]
    },
    
    // Occasion-specific verses
    occasions: {
        christmas: {
            ESV: [
                { text: "For unto you is born this day in the city of David a Savior, who is Christ the Lord.", reference: "Luke 2:11" },
                { text: "And the Word became flesh and dwelt among us, and we have seen his glory.", reference: "John 1:14" }
            ]
        },
        easter: {
            ESV: [
                { text: "He is not here, for he has risen, as he said.", reference: "Matthew 28:6" },
                { text: "For God so loved the world, that he gave his only Son.", reference: "John 3:16" }
            ]
        }
    }
};

// Custom verses storage
let customVerses = JSON.parse(localStorage.getItem('customVerses')) || [];
let userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {
    translation: 'ESV',
    timeOfDay: 'auto',
    appMode: 'general',
    canvasStyle: '1',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

// DOM Elements
const elements = {
    verseText: document.getElementById('verseText'),
    verseReference: document.getElementById('verseReference'),
    verseTranslation: document.getElementById('verseTranslation'),
    nextVerseBtn: document.getElementById('nextVerse'),
    shareButton: document.getElementById('shareButton'),
    timeDisplay: document.getElementById('timeDisplay'),
    timezoneDisplay: document.getElementById('timezoneDisplay'),
    translationSelect: document.getElementById('translationSelect'),
    timeOfDaySelect: document.getElementById('timeOfDaySelect'),
    appModeSelect: document.getElementById('appModeSelect'),
    occasionSelect: document.getElementById('occasionSelect'),
    occasionGroup: document.getElementById('occasionGroup'),
    canvasStyleSelect: document.getElementById('canvasStyleSelect'),
    shareModal: document.getElementById('shareModal'),
    closeModal: document.querySelector('.close')
};

// Initialize the app
function init() {
    loadUserPreferences();
    setupEventListeners();
    updateTimeDisplay();
    loadCustomVerses();
    generateWeeklySchedule();
    
    // Start auto-rotation
    setInterval(updateTimeDisplay, 60000); // Update time every minute
    setInterval(displayRandomVerse, 60000); // Rotate verse every minute
    
    // Display initial verse
    displayRandomVerse();
}

function loadUserPreferences() {
    elements.translationSelect.value = userPreferences.translation;
    elements.timeOfDaySelect.value = userPreferences.timeOfDay;
    elements.appModeSelect.value = userPreferences.appMode;
    elements.canvasStyleSelect.value = userPreferences.canvasStyle;
    elements.timezoneDisplay.textContent = `Timezone: ${userPreferences.timezone}`;
    
    toggleOccasionGroup();
}

function setupEventListeners() {
    elements.nextVerseBtn.addEventListener('click', displayRandomVerse);
    elements.shareButton.addEventListener('click', showShareModal);
    elements.closeModal.addEventListener('click', hideShareModal);
    
    // Settings change listeners
    elements.translationSelect.addEventListener('change', savePreferences);
    elements.timeOfDaySelect.addEventListener('change', savePreferences);
    elements.appModeSelect.addEventListener('change', savePreferences);
    elements.occasionSelect.addEventListener('change', savePreferences);
    elements.canvasStyleSelect.addEventListener('change', savePreferences);
    
    // Share options
    document.getElementById('copyText').addEventListener('click', copyVerseToClipboard);
    document.getElementById('shareTwitter').addEventListener('click', shareOnTwitter);
    document.getElementById('shareWhatsApp').addEventListener('click', shareOnWhatsApp);
    document.getElementById('shareEmail').addEventListener('click', shareViaEmail);
    document.getElementById('downloadImage').addEventListener('click', downloadVerseAsImage);
    
    // Custom verses
    document.getElementById('addCustomVerse').addEventListener('click', addCustomVerse);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === elements.shareModal) {
            hideShareModal();
        }
    });
}

function savePreferences() {
    userPreferences = {
        translation: elements.translationSelect.value,
        timeOfDay: elements.timeOfDaySelect.value,
        appMode: elements.appModeSelect.value,
        canvasStyle: elements.canvasStyleSelect.value,
        timezone: userPreferences.timezone
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    toggleOccasionGroup();
    displayRandomVerse();
}

function toggleOccasionGroup() {
    if (userPreferences.appMode === 'occasion') {
        elements.occasionGroup.style.display = 'block';
    } else {
        elements.occasionGroup.style.display = 'none';
    }
}

function updateTimeDisplay() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: userPreferences.timezone
    };
    elements.timeDisplay.textContent = now.toLocaleDateString('en-US', options);
}

function getCurrentTimeOfDay() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

function displayRandomVerse() {
    let verseCategory = userPreferences.timeOfDay === 'auto' ? getCurrentTimeOfDay() : userPreferences.timeOfDay;
    let verses = [];
    
    if (userPreferences.appMode === 'occasion') {
        const occasion = elements.occasionSelect.value;
        verses = bibleVerses.occasions[occasion]?.[userPreferences.translation] || [];
    }
    
    // If no occasion verses or in general mode, use time-based verses
    if (verses.length === 0) {
        verses = bibleVerses[verseCategory]?.[userPreferences.translation] || [];
    }
    
    // Add custom verses for this category
    const customCategoryVerses = customVerses.filter(v => 
        v.time === verseCategory || v.time === 'general'
    );
    
    if (customCategoryVerses.length > 0) {
        verses = verses.concat(customCategoryVerses);
    }
    
    // Fallback to general verses if none found
    if (verses.length === 0) {
        verses = bibleVerses.morning[userPreferences.translation] || [];
    }
    
    if (verses.length > 0) {
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        elements.verseText.textContent = `"${randomVerse.text}"`;
        elements.verseReference.textContent = randomVerse.reference;
        elements.verseTranslation.textContent = userPreferences.translation;
    }
}

// Custom Verses Management
function loadCustomVerses() {
    const list = document.getElementById('customVersesList');
    list.innerHTML = '';
    
    customVerses.forEach((verse, index) => {
        const verseElement = document.createElement('div');
        verseElement.className = 'custom-verse-item';
        verseElement.innerHTML = `
            <div class="verse-content">
                <strong>${verse.text}</strong>
                <div>${verse.reference} • <span class="verse-time">${verse.time}</span></div>
            </div>
            <button class="delete-verse" onclick="deleteCustomVerse(${index})">×</button>
        `;
        list.appendChild(verseElement);
    });
}

function addCustomVerse() {
    const text = document.getElementById('customVerseText').value;
    const reference = document.getElementById('customVerseRef').value;
    const time = document.getElementById('customVerseTime').value;
    
    if (text && reference) {
        customVerses.push({ text, reference, time });
        localStorage.setItem('customVerses', JSON.stringify(customVerses));
        loadCustomVerses();
        
        // Clear inputs
        document.getElementById('customVerseText').value = '';
        document.getElementById('customVerseRef').value = '';
    }
}

function deleteCustomVerse(index) {
    customVerses.splice(index, 1);
    localStorage.setItem('customVerses', JSON.stringify(customVerses));
    loadCustomVerses();
}

// Weekly Schedule
function generateWeeklySchedule() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const schedule = document.getElementById('weekSchedule');
    
    schedule.innerHTML = days.map(day => `
        <div class="day-schedule">
            <h4>${day}</h4>
            <div class="schedule-verse">No verse scheduled</div>
            <button class="btn secondary" onclick="scheduleVerse('${day.toLowerCase()}')">Schedule</button>
        </div>
    `).join('');
}

function scheduleVerse(day) {
    // Implementation for scheduling verses for specific days
    alert(`Scheduling verse for ${day}`);
    // You can implement a modal or form for scheduling
}

// Share functionality
function showShareModal() {
    elements.shareModal.style.display = 'block';
}

function hideShareModal() {
    elements.shareModal.style.display = 'none';
}

// Enhanced downloadVerseAsImage with multiple canvas styles
function downloadVerseAsImage() {
    const canvas = document.getElementById('verseCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1200;
    canvas.height = 630;
    
    // Apply selected canvas style
    applyCanvasStyle(ctx, canvas.width, canvas.height);
    
    // Create download link
    const link = document.createElement('a');
    link.download = `bible-verse-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

function applyCanvasStyle(ctx, width, height) {
    const style = userPreferences.canvasStyle;
    
    switch(style) {
        case '1': // Classic Gradient
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            break;
            
        case '2': // Parchment Style
            ctx.fillStyle = '#f5e8c0';
            break;
            
        case '3': // Nature Theme
            ctx.fillStyle = '#2e8b57';
            break;
            
        case '4': // Minimal Dark
            ctx.fillStyle = '#2c3e50';
            break;
            
        case '5': // Colorful Abstract
            const abstractGradient = ctx.createLinearGradient(0, 0, width, height);
            abstractGradient.addColorStop(0, '#ff6b6b');
            abstractGradient.addColorStop(0.5, '#4ecdc4');
            abstractGradient.addColorStop(1, '#45b7d1');
            ctx.fillStyle = abstractGradient;
            break;
    }
    
    ctx.fillRect(0, 0, width, height);
    
    // Add text (common to all styles)
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px Playfair Display';
    wrapText(ctx, elements.verseText.textContent, width / 2, 200, 1000, 50);
    
    ctx.font = '30px Inter';
    ctx.fillText(`- ${elements.verseReference.textContent} -`, width / 2, 500);
}

// Keep the existing helper functions (wrapText, share functions, etc.)
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

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
