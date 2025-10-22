// VerseCurator - Main Application Script
class VerseCurator {
    constructor() {
        this.currentVerse = null;
        this.customVerses = JSON.parse(localStorage.getItem('customVerses')) || [];
        this.favorites = JSON.parse(localStorage.getItem('favoriteVerses')) || [];
        this.notes = JSON.parse(localStorage.getItem('verseNotes')) || [];
        this.stats = JSON.parse(localStorage.getItem('appStats')) || {
            versesViewed: 0,
            versesShared: 0,
            versesFavorited: 0,
            currentStreak: 0,
            lastVisit: null
        };
        
        this.userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {
            translation: 'ESV',
            displayMode: 'auto',
            canvasStyle: '1',
            appMode: 'general',
            theme: 'light'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.updateTimeDisplay();
        this.updateStats();
        this.loadCustomVerses();
        this.checkVisitStreak();
        
        // Start intervals
        setInterval(() => this.updateTimeDisplay(), 1000);
        setInterval(() => this.autoRotateVerse(), 30000); // Rotate every 30 seconds
        
        // Display initial verse
        this.displayRandomVerse();
        
        console.log('VerseCurator initialized successfully!');
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Main actions
        document.getElementById('nextVerse').addEventListener('click', () => this.displayRandomVerse());
        document.getElementById('shareButton').addEventListener('click', () => this.showShareModal());
        
        // Settings changes
        document.getElementById('translationSelect').addEventListener('change', (e) => this.savePreference('translation', e.target.value));
        document.getElementById('displayModeSelect').addEventListener('change', (e) => this.savePreference('displayMode', e.target.value));
        document.getElementById('canvasStyleSelect').addEventListener('change', (e) => this.savePreference('canvasStyle', e.target.value));
        document.getElementById('appModeSelect').addEventListener('change', (e) => this.handleAppModeChange(e.target.value));
        document.getElementById('occasionSelect').addEventListener('change', (e) => this.savePreference('occasion', e.target.value));
        
        // Custom verses
        document.getElementById('toggleCustomForm').addEventListener('click', () => this.toggleCustomForm());
        document.getElementById('addCustomVerse').addEventListener('click', () => this.addCustomVerse());
        
        // Verse actions
        document.getElementById('favoriteVerse').addEventListener('click', () => this.toggleFavorite());
        document.getElementById('addNote').addEventListener('click', () => this.showNoteModal());
        
        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.hideShareModal());
        document.getElementById('closeNoteModal').addEventListener('click', () => this.hideNoteModal());
        document.getElementById('cancelNote').addEventListener('click', () => this.hideNoteModal());
        document.getElementById('saveNote').addEventListener('click', () => this.saveNote());
        
        // Share options
        document.getElementById('copyText').addEventListener('click', () => this.copyVerseToClipboard());
        document.getElementById('shareTwitter').addEventListener('click', () => this.shareOnTwitter());
        document.getElementById('shareWhatsApp').addEventListener('click', () => this.shareOnWhatsApp());
        document.getElementById('shareEmail').addEventListener('click', () => this.shareViaEmail());
        document.getElementById('downloadImage').addEventListener('click', () => this.downloadVerseAsImage());
        document.getElementById('shareFacebook').addEventListener('click', () => this.shareOnFacebook());
        document.getElementById('shareDevice').addEventListener('click', () => this.shareViaDevice());
        document.getElementById('shareSMS').addEventListener('click', () => this.shareViaSMS());
        document.getElementById('copyImage').addEventListener('click', () => this.copyVerseAsImage());
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideShareModal();
                this.hideNoteModal();
            }
        });

        // Time period indicators
        document.querySelectorAll('.period').forEach(period => {
            period.addEventListener('click', (e) => {
                this.setTimePeriod(e.currentTarget.dataset.period);
            });
        });
    }

    // Time and Display Functions
    updateTimeDisplay() {
        const now = new Date();
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        };
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', timeOptions);
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', dateOptions);
        
        // Update active time period
        this.updateTimePeriodIndicator();
    }

    getCurrentTimePeriod() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 15) return 'day';
        if (hour >= 15 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    updateTimePeriodIndicator() {
        const currentPeriod = this.getCurrentTimePeriod();
        document.querySelectorAll('.period').forEach(period => {
            period.classList.toggle('active', period.dataset.period === currentPeriod);
        });
        
        // Update verse time badge
        const periodNames = {
            morning: '🌅 Morning',
            day: '☀️ Day', 
            afternoon: '🌇 Afternoon',
            evening: '🌆 Evening',
            night: '🌙 Night'
        };
        
        document.getElementById('verseTimeBadge').textContent = periodNames[currentPeriod];
    }

    setTimePeriod(period) {
        this.savePreference('displayMode', period);
        this.displayRandomVerse();
    }

    // Verse Management
    displayRandomVerse() {
        const displayMode = this.userPreferences.displayMode;
        const timePeriod = displayMode === 'auto' ? this.getCurrentTimePeriod() : displayMode;
        const translation = this.userPreferences.translation;
        
        let verses = this.getVersesForPeriod(timePeriod, translation);
        
        if (verses.length === 0) {
            verses = this.bibleVerses.morning.ESV; // Fallback
        }
        
        const randomIndex = Math.floor(Math.random() * verses.length);
        this.currentVerse = verses[randomIndex];
        
        this.updateVerseDisplay();
        this.incrementStat('versesViewed');
    }

    getVersesForPeriod(period, translation) {
        // Base verses
        let verses = this.bibleVerses[period]?.[translation] || [];
        
        // Add custom verses for this period
        const customVerses = this.customVerses.filter(v => 
            v.time === period || v.time === 'general'
        ).map(v => ({
            text: v.text,
            reference: v.reference,
            translation: 'CUSTOM'
        }));
        
        return [...verses, ...customVerses];
    }

    updateVerseDisplay() {
        if (!this.currentVerse) return;
        
        document.getElementById('verseText').textContent = `"${this.currentVerse.text}"`;
        document.getElementById('verseReference').textContent = this.currentVerse.reference;
        document.getElementById('verseTranslationBadge').textContent = this.currentVerse.translation;
        
        // Update favorite button
        const isFavorite = this.favorites.some(fav => 
            fav.text === this.currentVerse.text && fav.reference === this.currentVerse.reference
        );
        
        const favoriteBtn = document.getElementById('favoriteVerse');
        favoriteBtn.innerHTML = isFavorite ? 
            '<i class="fas fa-heart"></i>' : 
            '<i class="far fa-heart"></i>';
        favoriteBtn.style.color = isFavorite ? '#e74c3c' : '';
    }

    autoRotateVerse() {
        if (this.userPreferences.displayMode === 'auto') {
            this.displayRandomVerse();
        }
    }

    // Custom Verses
    toggleCustomForm() {
        const form = document.getElementById('customForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    addCustomVerse() {
        const text = document.getElementById('customVerseText').value.trim();
        const reference = document.getElementById('customVerseRef').value.trim();
        const time = document.getElementById('customVerseTime').value;
        
        if (!text || !reference) {
            this.showNotification('Please enter both verse text and reference', 'error');
            return;
        }
        
        this.customVerses.push({ text, reference, time });
        localStorage.setItem('customVerses', JSON.stringify(this.customVerses));
        this.loadCustomVerses();
        
        // Clear form
        document.getElementById('customVerseText').value = '';
        document.getElementById('customVerseRef').value = '';
        document.getElementById('customForm').style.display = 'none';
        
        this.showNotification('Custom verse added successfully!');
    }

    loadCustomVerses() {
        const list = document.getElementById('customVersesList');
        list.innerHTML = '';
        
        this.customVerses.forEach((verse, index) => {
            const verseElement = document.createElement('div');
            verseElement.className = 'custom-verse-item fade-in';
            verseElement.innerHTML = `
                <div class="verse-content">
                    <strong>"${verse.text}"</strong>
                    <div class="verse-meta">
                        <span>${verse.reference}</span>
                        <span>•</span>
                        <span>${verse.time.charAt(0).toUpperCase() + verse.time.slice(1)}</span>
                    </div>
                </div>
                <button class="delete-verse" onclick="app.deleteCustomVerse(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            list.appendChild(verseElement);
        });
    }

    deleteCustomVerse(index) {
        this.customVerses.splice(index, 1);
        localStorage.setItem('customVerses', JSON.stringify(this.customVerses));
        this.loadCustomVerses();
        this.showNotification('Custom verse deleted');
    }

    // Favorites and Notes
    toggleFavorite() {
        if (!this.currentVerse) return;
        
        const index = this.favorites.findIndex(fav => 
            fav.text === this.currentVerse.text && fav.reference === this.currentVerse.reference
        );
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('Removed from favorites');
        } else {
            this.favorites.push({ ...this.currentVerse });
            this.incrementStat('versesFavorited');
            this.showNotification('Added to favorites!');
        }
        
        localStorage.setItem('favoriteVerses', JSON.stringify(this.favorites));
        this.updateVerseDisplay();
        this.updateStats();
    }

    showNoteModal() {
        if (!this.currentVerse) return;
        
        const existingNote = this.notes.find(note => 
            note.text === this.currentVerse.text && note.reference === this.currentVerse.reference
        );
        
        document.getElementById('verseNote').value = existingNote?.note || '';
        document.getElementById('noteModal').style.display = 'flex';
    }

    hideNoteModal() {
        document.getElementById('noteModal').style.display = 'none';
    }

    saveNote() {
        if (!this.currentVerse) return;
        
        const noteText = document.getElementById('verseNote').value.trim();
        const existingIndex = this.notes.findIndex(note => 
            note.text === this.currentVerse.text && note.reference === this.currentVerse.reference
        );
        
        if (existingIndex > -1) {
            if (noteText) {
                this.notes[existingIndex].note = noteText;
            } else {
                this.notes.splice(existingIndex, 1);
            }
        } else if (noteText) {
            this.notes.push({
                text: this.currentVerse.text,
                reference: this.currentVerse.reference,
                note: noteText,
                date: new Date().toISOString()
            });
        }
        
        localStorage.setItem('verseNotes', JSON.stringify(this.notes));
        this.hideNoteModal();
        this.showNotification(n
