/**
 * Emoji Story Generator - Frontend Application
 * Features: Story Creation, Translation Preview, Gallery, State Management
 */

class EmojiStoryApp {
    constructor() {
        // State management
        this.state = {
            currentStory: [],
            currentAuthor: '',
            translation: '',
            stories: [],
            currentPage: 0,
            isLoading: false,
            sortBy: 'latest' // 'latest' or 'popular'
        };

        // Emoji categories data
        this.emojiCategories = {
            popular: ['😀', '😂', '🥰', '😍', '🤔', '😊', '👍', '❤️', '🔥', '💯', '🎉', '👏', '🙌', '💪', '🚀', '⭐', '🌟', '✨', '🎊', '🎈'],
            faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔'],
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄'],
            nature: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌻', '🌾', '🌿', '🍀', '🍃', '🌱', '🌳', '🌲', '🌴', '🌵', '🌊', '💧', '🔥', '⭐', '🌟', '✨', '🌙', '☀️', '⛅', '🌤️', '🌦️', '🌧️', '⛈️', '🌩️'],
            food: ['🍎', '🍌', '🍊', '🍋', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞'],
            activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥊', '🥋', '🎽', '🛹', '🛼', '🛴', '⛳', '🪁', '🏹', '🎣', '🤿', '🎿', '🛷'],
            objects: ['🦴','📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '☎️', '📞', '📟', '📠', '📺', '📻', '⏰', '⏱️', '⏲️', '🕐', '📡', '🔋', '💡', '🔦', '🕯️', '🧯', '🛢️', '💸', '💰']
        };

        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        this.setupEventListeners();
        this.renderEmojiGrid('popular');
        await this.loadStories();
        this.setupTooltips();
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Author input
        const authorInput = document.getElementById('authorNickname');
        authorInput.addEventListener('input', (e) => {
            this.state.currentAuthor = e.target.value;
            this.updateSaveButtonState();
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.selectCategory(category);
            });
        });

        // Story controls
        document.getElementById('clearStory').addEventListener('click', () => this.clearStory());
        document.getElementById('undoLast').addEventListener('click', () => this.undoLast());
        document.getElementById('saveStory').addEventListener('click', () => this.saveStory());
        document.getElementById('getRandomStory').addEventListener('click', () => this.generateRandomStory());

        // Gallery controls
        document.getElementById('sortByLatest').addEventListener('click', () => this.sortStories('latest'));
        document.getElementById('sortByPopular').addEventListener('click', () => this.sortStories('popular'));
        document.getElementById('refreshStories').addEventListener('click', () => this.loadStories());
        document.getElementById('loadMoreStories').addEventListener('click', () => this.loadMoreStories());

        // Mobile FAB
        document.getElementById('createStoryFab').addEventListener('click', () => {
            document.querySelector('.composer-section').scrollIntoView({ behavior: 'smooth' });
        });

        // Toast close
        document.getElementById('toastClose').addEventListener('click', () => this.hideToast());

        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => this.hideModal());
        document.getElementById('storyModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('storyModal')) {
                this.hideModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                this.hideToast();
            }
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                    e.preventDefault();
                    this.saveStory();
                }
                if (e.key === 'z') {
                    e.preventDefault();
                    this.undoLast();
                }
            }
        });
    }

    /**
     * Select emoji category and render grid
     */
    selectCategory(category) {
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Render emoji grid for selected category
        this.renderEmojiGrid(category);
    }

    /**
     * Render emoji grid for a category
     */
    renderEmojiGrid(category) {
        const grid = document.getElementById('emojiGrid');
        const emojis = this.emojiCategories[category] || [];

        grid.innerHTML = emojis.map(emoji => 
            `<button class="emoji-item" data-emoji="${emoji}" tabindex="0" 
                     onclick="app.addEmojiToStory('${emoji}')" 
                     onkeydown="if(event.key==='Enter'||event.key===' '){app.addEmojiToStory('${emoji}');event.preventDefault();}"
                     title="Add ${emoji} to story">
                ${emoji}
             </button>`
        ).join('');
    }

    /**
     * Add emoji to current story
     */
    async addEmojiToStory(emoji) {
        if (this.state.currentStory.length >= 50) {
            this.showToast('Story is too long! Maximum 50 emojis allowed.', 'error');
            return;
        }

        this.state.currentStory.push(emoji);
        this.renderStoryDisplay();
        this.updateSaveButtonState();
        
        // Get live translation preview
        if (this.state.currentStory.length > 0) {
            await this.getTranslationPreview();
        }
    }

    /**
     * Remove emoji from story by clicking on it
     */
    removeEmojiFromStory(index) {
        this.state.currentStory.splice(index, 1);
        this.renderStoryDisplay();
        this.updateSaveButtonState();
        
        if (this.state.currentStory.length > 0) {
            this.getTranslationPreview();
        } else {
            this.clearTranslationPreview();
        }
    }

    /**
     * Render the current story display
     */
    renderStoryDisplay() {
        const container = document.getElementById('storyEmojis');
        
        if (this.state.currentStory.length === 0) {
            container.innerHTML = '<div class="empty-story">Click emojis above to start your story! 📖</div>';
        } else {
            container.innerHTML = this.state.currentStory.map((emoji, index) => 
                `<span class="story-emoji" 
                        onclick="app.removeEmojiFromStory(${index})"
                        title="Click to remove">${emoji}</span>`
            ).join('');
        }

        // Update undo button state
        document.getElementById('undoLast').disabled = this.state.currentStory.length === 0;
    }

    /**
     * Clear the entire story
     */
    clearStory() {
        this.state.currentStory = [];
        this.renderStoryDisplay();
        this.clearTranslationPreview();
        this.updateSaveButtonState();
    }

    /**
     * Undo the last emoji
     */
    undoLast() {
        if (this.state.currentStory.length > 0) {
            this.state.currentStory.pop();
            this.renderStoryDisplay();
            this.updateSaveButtonState();
            
            if (this.state.currentStory.length > 0) {
                this.getTranslationPreview();
            } else {
                this.clearTranslationPreview();
            }
        }
    }

    /**
     * Generate a random story for inspiration
     */
    generateRandomStory() {
        const allEmojis = Object.values(this.emojiCategories).flat();
        const storyLength = Math.floor(Math.random() * 8) + 3; // 3-10 emojis
        
        this.state.currentStory = [];
        for (let i = 0; i < storyLength; i++) {
            const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
            this.state.currentStory.push(randomEmoji);
        }
        
        this.renderStoryDisplay();
        this.getTranslationPreview();
        this.updateSaveButtonState();
        this.showToast('Random story generated! ✨', 'success');
    }

    /**
     * Get translation preview from API
     */
    async getTranslationPreview() {
        if (this.state.currentStory.length === 0) return;

        try {
            const response = await fetch('/api/translate-preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.currentStory)
            });

            if (response.ok) {
                const data = await response.json();
                this.renderTranslationPreview(data);
            } else {
                this.showTranslationError();
            }
        } catch (error) {
            console.error('Translation preview error:', error);
            this.showTranslationError();
        }
    }

    /**
     * Render translation preview
     */
    renderTranslationPreview(data) {
        const content = document.getElementById('translationPreview');
        const meta = document.getElementById('previewMeta');

        content.innerHTML = `<div class="preview-text">${data.translation}</div>`;
        
        meta.innerHTML = `
            <div class="meta-item">
                <span>📊</span>
                <span>${data.emoji_count} emojis</span>
            </div>
            <div class="meta-item">
                <span>🏷️</span>
                <span>${data.themes?.join(', ') || 'Mixed themes'}</span>
            </div>
        `;

        this.state.translation = data.translation;
    }

    /**
     * Clear translation preview
     */
    clearTranslationPreview() {
        document.getElementById('translationPreview').innerHTML = 
            '<div class="preview-placeholder">Your story translation will appear here...</div>';
        document.getElementById('previewMeta').innerHTML = '';
        this.state.translation = '';
    }

    /**
     * Show translation error
     */
    showTranslationError() {
        document.getElementById('translationPreview').innerHTML = 
            '<div class="preview-error" style="color: var(--danger-color);">⚠️ Could not generate translation. Please try again.</div>';
    }

    /**
     * Update save button state
     */
    updateSaveButtonState() {
        const saveBtn = document.getElementById('saveStory');
        const canSave = this.state.currentStory.length > 0 && 
                       this.state.currentAuthor.trim().length > 0 && 
                       !this.state.isLoading;
        
        saveBtn.disabled = !canSave;
    }

    /**
     * Save the current story
     */
    async saveStory() {
        if (this.state.currentStory.length === 0) {
            this.showToast('Please add some emojis to your story! 😊', 'error');
            return;
        }

        if (!this.state.currentAuthor.trim()) {
            this.showToast('Please enter your nickname! 👤', 'error');
            document.getElementById('authorNickname').focus();
            return;
        }

        this.state.isLoading = true;
        this.updateSaveButtonState();

        try {
            const response = await fetch('/api/stories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emoji_sequence: this.state.currentStory,
                    author_nickname: this.state.currentAuthor.trim()
                })
            });

            if (response.ok) {
                const newStory = await response.json();
                this.showToast('Story saved successfully! 🎉', 'success');
                
                // Clear the form
                this.clearStory();
                document.getElementById('authorNickname').value = '';
                this.state.currentAuthor = '';
                
                // Reload stories to show the new one
                await this.loadStories();
            } else {
                const error = await response.json();
                this.showToast(`Error saving story: ${error.detail || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Save story error:', error);
            this.showToast('Failed to save story. Please check your connection.', 'error');
        } finally {
            this.state.isLoading = false;
            this.updateSaveButtonState();
        }
    }

    /**
     * Load stories from API
     */
    async loadStories(reset = true) {
        if (reset) {
            this.state.currentPage = 0;
            this.state.stories = [];
        }

        this.state.isLoading = true;
        this.showStoriesLoading(true);

        try {
            const response = await fetch(
                `/api/stories?skip=${this.state.currentPage * 4}&limit=4&popular=${this.state.sortBy === 'popular'}`
            );

            if (response.ok) {
                const stories = await response.json();
                
                if (reset) {
                    this.state.stories = stories;
                } else {
                    this.state.stories.push(...stories);
                }
                
                this.renderStoriesGrid();
                this.state.currentPage++;
            } else {
                this.showToast('Failed to load stories', 'error');
            }
        } catch (error) {
            console.error('Load stories error:', error);
            this.showToast('Failed to load stories. Please check your connection.', 'error');
        } finally {
            this.state.isLoading = false;
            this.showStoriesLoading(false);
        }
    }

    /**
     * Load more stories
     */
    async loadMoreStories() {
        await this.loadStories(false);
    }

    /**
     * Sort stories
     */
    async sortStories(sortBy) {
        this.state.sortBy = sortBy;
        
        // Update active sort button
        document.querySelectorAll('#sortByLatest, #sortByPopular').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(sortBy === 'latest' ? 'sortByLatest' : 'sortByPopular')
            .classList.add('active');

        await this.loadStories();
    }

    /**
     * Render stories grid
     */
    renderStoriesGrid() {
        const grid = document.getElementById('storiesGrid');
        
        if (this.state.stories.length === 0) {
            grid.innerHTML = `
                <div class="empty-stories">
                    <div style="font-size: 3rem; margin-bottom: 15px;">📝</div>
                    <div style="font-size: 1.2rem; color: var(--text-secondary);">No stories yet!</div>
                    <div style="color: var(--text-light);">Be the first to create an emoji story.</div>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.state.stories.map(story => this.createStoryCard(story)).join('');
    }

    /**
     * Create a story card HTML
     */
    createStoryCard(story) {
        const createdDate = new Date(story.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="story-card" onclick="app.showStoryModal('${story.id}')">
                <div class="story-header">
                    <div class="story-author">
                        <span>👤</span>
                        <span>${this.escapeHtml(story.author_nickname)}</span>
                    </div>
                    <div class="story-date">${createdDate}</div>
                </div>
                <div class="story-emojis-display">
                    ${story.emoji_sequence.join(' ')}
                </div>
                <div class="story-translation">
                    "${this.escapeHtml(story.translation)}"
                </div>
                <div class="story-footer">
                    <div class="story-likes">
                        <button class="like-btn" onclick="event.stopPropagation(); app.likeStory('${story.id}')">
                            ❤️
                        </button>
                        <span>${story.likes}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Like a story
     */
    async likeStory(storyId) {
        try {
            const response = await fetch(`/api/stories/${storyId}/like`, {
                method: 'POST',
            });

            if (response.ok) {
                const updatedStory = await response.json();
                
                // Update the story in our state
                const storyIndex = this.state.stories.findIndex(s => s.id === storyId);
                if (storyIndex !== -1) {
                    this.state.stories[storyIndex] = updatedStory;
                    this.renderStoriesGrid();
                }
                
                this.showToast('Story liked! ❤️', 'success');
            } else {
                this.showToast('Failed to like story', 'error');
            }
        } catch (error) {
            console.error('Like story error:', error);
            this.showToast('Failed to like story', 'error');
        }
    }

    /**
     * Show story details modal
     */
    showStoryModal(storyId) {
        const story = this.state.stories.find(s => s.id === storyId);
        if (!story) return;

        const modal = document.getElementById('storyModal');
        const modalBody = document.getElementById('modalBody');

        const createdDate = new Date(story.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        modalBody.innerHTML = `
            <div class="modal-story-content">
                <div class="modal-story-header">
                    <h4>Story by ${this.escapeHtml(story.author_nickname)}</h4>
                    <p class="modal-story-date">Created on ${createdDate}</p>
                </div>
                
                <div class="modal-story-emojis">
                    <h5>Emoji Sequence:</h5>
                    <div style="font-size: 2rem; line-height: 1.4; margin: 15px 0;">
                        ${story.emoji_sequence.join(' ')}
                    </div>
                </div>
                
                <div class="modal-story-translation">
                    <h5>Translation:</h5>
                    <p style="font-style: italic; line-height: 1.6; margin: 15px 0;">
                        "${this.escapeHtml(story.translation)}"
                    </p>
                </div>
                
                <div class="modal-story-stats">
                    <div class="stat-item">
                        <strong>Likes:</strong> ${story.likes} ❤️
                    </div>
                    <div class="stat-item">
                        <strong>Length:</strong> ${story.emoji_sequence.length} emojis
                    </div>
                </div>
                
                <div class="modal-story-actions" style="margin-top: 25px;">
                    <button class="btn btn-primary" onclick="app.likeStory('${story.id}')">
                        <span class="btn-icon">❤️</span>
                        Like Story
                    </button>
                    <button class="btn btn-secondary" onclick="app.copyStoryToComposer('${story.id}')">
                        <span class="btn-icon">📝</span>
                        Use as Template
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('show');
    }

    /**
     * Copy story to composer as template
     */
    copyStoryToComposer(storyId) {
        const story = this.state.stories.find(s => s.id === storyId);
        if (!story) return;

        this.state.currentStory = [...story.emoji_sequence];
        this.renderStoryDisplay();
        this.getTranslationPreview();
        this.updateSaveButtonState();
        this.hideModal();
        
        // Scroll to composer
        document.querySelector('.composer-section').scrollIntoView({ behavior: 'smooth' });
        this.showToast('Story copied to composer! Edit and save as your own. ✨', 'success');
    }

    /**
     * Hide story modal
     */
    hideModal() {
        document.getElementById('storyModal').classList.remove('show');
    }

    /**
     * Show/hide stories loading state
     */
    showStoriesLoading(show) {
        const loading = document.getElementById('storiesLoading');
        const grid = document.getElementById('storiesGrid');
        
        if (show) {
            loading.style.display = 'flex';
            grid.style.display = 'none';
        } else {
            loading.style.display = 'none';
            grid.style.display = 'grid';
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const content = document.getElementById('toastContent');
        
        content.textContent = message;
        toast.className = `toast ${type} show`;
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            this.hideToast();
        }, 4000);
    }

    /**
     * Hide toast notification
     */
    hideToast() {
        document.getElementById('toast').classList.remove('show');
    }

    /**
     * Setup tooltips for better UX
     */
    setupTooltips() {
        // This would be expanded with a tooltip library in a real application
        // For now, we're using native title attributes
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the application when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new EmojiStoryApp();
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmojiStoryApp;
}