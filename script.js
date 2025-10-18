// Simple Bible verses database
const bibleVerses = {
    morning: [
        {
            text: "The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.",
            reference: "Lamentations 3:22-23",
            translation: "ESV"
        },
        {
            text: "This is the day that the LORD has made; let us rejoice and be glad in it.",
            reference: "Psalm 118:24",
            translation: "ESV"
        }
    ],
    afternoon: [
        {
            text: "And let us not grow weary of doing good, for in due season we will reap, if we do not give up.",
            reference: "Galatians 6:9",
            translation: "ESV"
        }
    ],
    evening: [
        {
            text: "In peace I will both lie down and sleep; for you alone, O LORD, make me dwell in safety.",
            reference: "Psalm 4:8",
            translation: "ESV"
        }
    ],
    night: [
        {
            text: "When I remember you upon my bed, and meditate on you in the watches of the night.",
            reference: "Psalm 63:6",
            translation: "ESV"
        }
    ]
};

// Initialize variables
let currentVerse = null;
let customVerses = JSON.parse(localStorage.getItem('customVerses')) || [];

// Initialize the app
function init() {
    console.log('Initializing VerseCurator...');
    
    // Set up event listeners
    document.getElementById('nextVerse').addEventListener('click', displayRandomVerse);
    document.getElementById('shareButton').addEventListener('click', showShareModal);
    document.getElementById('addCustomVerse').addEventListener('click', addCustomVerse);
    
    // Share modal events
    document.querySelector('.close').addEventListener('click', hideShareModal);
    document.getElementById('copyText').addEventListener('click', copyVerseToClipboard);
    document.getElementById('shareTwitter').addEventListener('click', shareOnTwitter);
    document.getElementById('shareWhatsApp').addEventListener('click', shareOnWhatsApp);
    document.getElementById('shareEmail').addEventListener('click', shareViaEmail);
    document.getElementById('downloadImage').addEventListener('click', downloadVerseAsImage);
    document.getElementById('shareDevice').addEventListener('click', shareViaDevice);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('shareModal')) {
            hideShareModal();
        }
    });
    
    // Start time updates
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000); // Update every second
    
    // Display initial verse
    displayRandomVerse();
    
    console.log('VerseCurator initialized successfully!');
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
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const timeString = now.toLocaleDateString('en-US', options);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    document.getElementById('timeDisplay').textContent = timeString;
    document.getElementById('timezoneDisplay').textContent = `Timezone: ${timezone}`;
}

// Get current time of day
function getCurrentTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

// Display random verse
function displayRandomVerse() {
    const timeOfDay = getCurrentTimeOfDay();
    const verses = bibleVerses[timeOfDay] || bibleVerses.morning;
    
    if (verses.length > 0) {
        const randomIndex = Math.floor(Math.random() * verses.length);
        currentVerse = verses[randomIndex];
        
        document.getElementById('verseText').textContent = `"${currentVerse.text}"`;
        document.getElementById('verseReference').textContent = currentVerse.reference;
        document.getElementById('verseTranslation').textContent = currentVerse.translation;
        
        console.log(`Displayed ${timeOfDay} verse:`, currentVerse.reference);
    }
}

// Share modal functions
function showShareModal() {
    document.getElementById('shareModal').style.display = 'block';
}

function hideShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

// Share functions
function copyVerseToClipboard() {
    if (!currentVerse) return;
    
    const textToCopy = `${document.getElementById('verseText').textContent} - ${document.getElementById('verseReference').textContent}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('Verse copied to clipboard!');
        hideShareModal();
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy verse');
    });
}

function shareOnTwitter() {
    if (!currentVerse) return;
    const text = encodeURIComponent(`${document.getElementById('verseText').textContent} - ${document.getElementById('verseReference').textContent}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    hideShareModal();
}

function shareOnWhatsApp() {
    if (!currentVerse) return;
    const text = encodeURIComponent(`${document.getElementById('verseText').textContent} - ${document.getElementById('verseReference').textContent}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    hideShareModal();
}

function shareViaEmail() {
    if (!currentVerse) return;
    const subject = encodeURIComponent('Daily Bible Verse');
    const body = encodeURIComponent(`${document.getElementById('verseText').textContent}\n\n- ${document.getElementById('verseReference').textContent}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    hideShareModal();
}

function shareViaDevice() {
    if (!currentVerse) return;
    
    if (navigator.share) {
        navigator.share({
            title: 'Daily Bible Verse',
            text: `${document.getElementById('verseText').textContent} - ${document.getElementById('verseReference').textContent}`,
            url: window.location.href
        }).then(() => {
            console.log('Verse shared successfully');
        }).catch(err => {
            console.log('Error sharing:', err);
            copyVerseToClipboard(); // Fallback
        });
    } else {
        copyVerseToClipboard(); // Fallback
    }
    hideShareModal();
}

function downloadVerseAsImage() {
    showNotification('Image download feature coming soon!');
    hideShareModal();
}

// Custom verses functions
function addCustomVerse() {
    const text = document.getElementById('customVerseText').value;
    const reference = document.getElementById('customVerseRef').value;
    const time = document.getElementById('customVerseTime').value;
    
    if (text && reference) {
        customVerses.push({ text, reference, time, translation: 'CUSTOM' });
        localStorage.setItem('customVerses', JSON.stringify(customVerses));
        loadCustomVerses();
        
        // Clear inputs
        document.getElementById('customVerseText').value = '';
        document.getElementById('customVerseRef').value = '';
        
        showNotification('Custom verse added!');
    }
}

function loadCustomVerses() {
    const list = document.getElementById('customVersesList');
    list.innerHTML = '';
    
    customVerses.forEach((verse, index) => {
        const verseElement = document.createElement('div');
        verseElement.className = 'custom-verse-item';
        verseElement.innerHTML = `
            <div class="verse-content">
                <strong>"${verse.text}"</strong>
                <div>${verse.reference} • <span class="verse-time">${verse.time}</span></div>
            </div>
            <button class="delete-verse" onclick="deleteCustomVerse(${index})">×</button>
        `;
        list.appendChild(verseElement);
    });
}

function deleteCustomVerse(index) {
    customVerses.splice(index, 1);
    localStorage.setItem('customVerses', JSON.stringify(customVerses));
    loadCustomVerses();
    showNotification('Custom verse deleted!');
}

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load custom verses on init
function loadCustomVersesOnInit() {
    loadCustomVerses();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    loadCustomVersesOnInit();
    console.log('DOM fully loaded and parsed');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
    showNotification('An error occurred. Please refresh the page.');
});
