// Update the share modal in the HTML section to include device share
// Add this button to your share-options-grid in HTML:
// <button id="shareDevice" class="share-option device-share">
//     <i class="fas fa-share-alt"></i>
//     Share (Device)
// </button>

// Enhanced share modal setup in JavaScript
function setupEventListeners() {
    // ... existing event listeners ...
    
    // Share options
    document.getElementById('copyText').addEventListener('click', copyVerseToClipboard);
    document.getElementById('shareTwitter').addEventListener('click', shareOnTwitter);
    document.getElementById('shareWhatsApp').addEventListener('click', shareOnWhatsApp);
    document.getElementById('shareEmail').addEventListener('click', shareViaEmail);
    document.getElementById('downloadImage').addEventListener('click', downloadVerseAsImage);
    document.getElementById('shareDevice').addEventListener('click', shareViaDevice);
    
    // ... rest of existing code ...
}

// Device Native Share Function
function shareViaDevice() {
    if (!navigator.share) {
        // Fallback for browsers that don't support Web Share API
        alert('Device sharing not supported in your browser. Try copying the text instead.');
        return;
    }
    
    const verseData = {
        title: 'Daily Bible Verse',
        text: `${elements.verseText.textContent} - ${elements.verseReference.textContent}`,
        url: window.location.href
    };
    
    navigator.share(verseData)
        .then(() => console.log('Verse shared successfully'))
        .catch((error) => {
            console.log('Error sharing:', error);
            // Fallback to copy to clipboard
            copyVerseToClipboard();
        });
}

// Enhanced share modal HTML update (replace your existing share-options-grid)
function updateShareModalHTML() {
    const shareGrid = document.querySelector('.share-options-grid');
    shareGrid.innerHTML = `
        <button id="copyText" class="share-option">
            <i class="fas fa-copy"></i>
            Copy Text
        </button>
        <button id="shareTwitter" class="share-option">
            <i class="fab fa-twitter"></i>
            Twitter
        </button>
        <button id="shareWhatsApp" class="share-option">
            <i class="fab fa-whatsapp"></i>
            WhatsApp
        </button>
        <button id="shareEmail" class="share-option">
            <i class="fas fa-envelope"></i>
            Email
        </button>
        <button id="shareFacebook" class="share-option">
            <i class="fab fa-facebook"></i>
            Facebook
        </button>
        <button id="downloadImage" class="share-option">
            <i class="fas fa-download"></i>
            Download Image
        </button>
        <button id="copyImage" class="share-option">
            <i class="fas fa-image"></i>
            Copy Image
        </button>
        <button id="shareSMS" class="share-option">
            <i class="fas fa-comment-sms"></i>
            SMS
        </button>
        <button id="shareDevice" class="share-option device-share">
            <i class="fas fa-share-alt"></i>
            Share (Device)
        </button>
    `;
    
    // Reattach event listeners after updating HTML
    document.getElementById('shareDevice').addEventListener('click', shareViaDevice);
    // ... reattach other event listeners ...
}

// Enhanced copy to clipboard with better feedback
function copyVerseToClipboard() {
    if (!currentVerse) return;
    
    const textToCopy = `${elements.verseText.textContent} - ${elements.verseReference.textContent}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('Verse copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Verse copied to clipboard!');
    });
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
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1001;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add these CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the enhanced app
document.addEventListener('DOMContentLoaded', function() {
    init();
    updateShareModalHTML();
});
