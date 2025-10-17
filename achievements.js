/* =========================================================
   achievements.js - The River Shade Achievement System
   Tracks player progress, deaths, endings, and secrets
   ========================================================= */

(function() {
  
  // === Achievement Definitions ===
  const ACHIEVEMENTS = {
    // Death Achievements
    first_death: {
      id: 'first_death',
      name: 'The First Drowning',
      description: 'Meet the Shade for the first time',
      icon: '🌊',
      secret: false
    },
    frequent_visitor: {
      id: 'frequent_visitor',
      name: 'Frequent Visitor',
      description: 'Die 5 times',
      icon: '💀',
      secret: false
    },
    death_expert: {
      id: 'death_expert',
      name: 'The River Knows You',
      description: 'Experience all 7 unique death narratives',
      icon: '☠️',
      secret: false
    },
    
    // Ending Achievements
    bad_end: {
      id: 'bad_end',
      name: 'Silence Claims Another',
      description: 'Linger too long in the Haunt',
      icon: '👁️',
      secret: false
    },
    true_end: {
      id: 'true_end',
      name: 'The River Keeps Secrets',
      description: 'Complete a true ending',
      icon: '🌫️',
      secret: false
    },
    perfect_end: {
      id: 'perfect_end',
      name: 'Coexistence',
      description: 'Reach the Perfect Ending',
      icon: '✨',
      secret: false
    },
    all_endings: {
      id: 'all_endings',
      name: 'Every Reflection',
      description: 'Witness all possible endings',
      icon: '🪞',
      secret: false
    },
    
    // Item Achievements
    collector: {
      id: 'collector',
      name: 'Collector',
      description: 'Gather all 5 fragments',
      icon: '🗝️',
      secret: false
    },
    lore_keeper: {
      id: 'lore_keeper',
      name: 'Lore Keeper',
      description: 'Examine all items in your inventory',
      icon: '📖',
      secret: false
    },
    
    // Exploration Achievements
    bridge_master: {
      id: 'bridge_master',
      name: 'Bridge Master',
      description: 'Witness the full lore revelation at the bridge',
      icon: '🌉',
      secret: false
    },
    memory_complete: {
      id: 'memory_complete',
      name: 'Memory Restored',
      description: 'Collect all 5 memory fragments on the Perfect Path',
      icon: '🌑',
      secret: true
    },
    
    // Secret Achievements
    shade_friend: {
      id: 'shade_friend',
      name: 'Welcome Home, Shade',
      description: 'Accept the darkness within',
      icon: '🖤',
      secret: true
    },
    voice_heard: {
      id: 'voice_heard',
      name: 'The Voice Remembers',
      description: 'Have the proper conversation at the investigation site',
      icon: '🔮',
      secret: true
    },
    double_drowned: {
      id: 'double_drowned',
      name: 'The River Remembers',
      description: 'Return to the riverbank after drowning there once',
      icon: '🌊',
      secret: true
    },
    acceptance: {
      id: 'acceptance',
      name: 'Quiet Acceptance',
      description: 'Choose to listen rather than resist',
      icon: '🤝',
      secret: true
    },
    defiance: {
      id: 'defiance',
      name: 'Gentle Defiance',
      description: 'Choose to resist with understanding',
      icon: '💪',
      secret: true
    }
  };

  // === Stats Tracking ===
  function getStats() {
    try {
      return JSON.parse(localStorage.getItem('playerStats') || '{}');
    } catch(e) {
      return {};
    }
  }

  function saveStats(stats) {
    try {
      localStorage.setItem('playerStats', JSON.stringify(stats));
    } catch(e) {
      console.warn('Could not save stats:', e);
    }
  }

  function initStats() {
    const stats = getStats();
    if (!stats.initialized) {
      const defaultStats = {
        initialized: true,
        totalDeaths: 0,
        uniqueDeaths: [],
        endingsReached: [],
        itemsCollected: [],
        itemsExamined: [],
        locationsVisited: [],
        playTime: 0,
        startTime: Date.now(),
        achievements: []
      };
      saveStats(defaultStats);
      return defaultStats;
    }
    return stats;
  }

  // === Achievement Functions ===
  function unlockAchievement(achievementId) {
    const stats = getStats();
    if (!stats.achievements) stats.achievements = [];
    
    if (!stats.achievements.includes(achievementId)) {
      stats.achievements.push(achievementId);
      saveStats(stats);
      showAchievementNotification(achievementId);
      return true;
    }
    return false;
  }

  function hasAchievement(achievementId) {
    const stats = getStats();
    return stats.achievements && stats.achievements.includes(achievementId);
  }

  // === Achievement Notification ===
  function showAchievementNotification(achievementId) {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;

    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-text">
        <div class="achievement-title">Achievement Unlocked!</div>
        <div class="achievement-name">${achievement.name}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }

  // === Stats Update Functions ===
  function trackDeath(deathType) {
    const stats = getStats();
    stats.totalDeaths = (stats.totalDeaths || 0) + 1;
    
    if (!stats.uniqueDeaths) stats.uniqueDeaths = [];
    
    // Ensure deathType is stored as string
    const deathId = String(deathType);
    
    if (!stats.uniqueDeaths.includes(deathId)) {
      stats.uniqueDeaths.push(deathId);
    }
    
    saveStats(stats);
    
    // Check achievements
    if (stats.totalDeaths === 1) unlockAchievement('first_death');
    if (stats.totalDeaths >= 5) unlockAchievement('frequent_visitor');
    
    // Death expert requires seeing all 7 awakening narratives (narrative_0 through narrative_6)
    const narrativeDeaths = stats.uniqueDeaths.filter(d => String(d).startsWith('narrative_'));
    if (narrativeDeaths.length >= 7) unlockAchievement('death_expert');
    
    console.log('Death tracked:', deathId, '| Total:', stats.totalDeaths, '| Unique:', stats.uniqueDeaths.length, '| Narratives:', narrativeDeaths.length);
    
    // Check journal unlock after death tracking
    checkJournalUnlock();
  }

  function trackEnding(endingId) {
    const stats = getStats();
    if (!stats.endingsReached) stats.endingsReached = [];
    if (!stats.endingsReached.includes(endingId)) {
      stats.endingsReached.push(endingId);
    }
    saveStats(stats);
    
    // Unlock ending achievements
    if (endingId === 'bad') unlockAchievement('bad_end');
    if (endingId === 'true') unlockAchievement('true_end');
    if (endingId === 'perfect') {
      unlockAchievement('perfect_end');
      unlockAchievement('shade_friend');
    }
    
    // NEW: Check if player has seen all endings
    const allEndingTypes = ['bad', 'true', 'perfect'];
    const hasAllEndings = allEndingTypes.every(type => stats.endingsReached.includes(type));
    if (hasAllEndings) {
      unlockAchievement('all_endings');
    }
    
    // Check journal unlock after ending
    checkJournalUnlock();
  }

  function trackLocation(locationId) {
    const stats = getStats();
    if (!stats.locationsVisited) stats.locationsVisited = [];
    if (!stats.locationsVisited.includes(locationId)) {
      stats.locationsVisited.push(locationId);
    }
    saveStats(stats);
  }

  function trackItemCollected(itemId) {
    const stats = getStats();
    if (!stats.itemsCollected) stats.itemsCollected = [];
    if (!stats.itemsCollected.includes(itemId)) {
      stats.itemsCollected.push(itemId);
    }
    saveStats(stats);
    
    // Check collector achievement
    if (stats.itemsCollected.length >= 5) {
      unlockAchievement('collector');
    }
    
    // Check journal unlock after item collection
    checkJournalUnlock();
  }

  // === Auto-tracking from existing flags ===
  function autoTrackFromFlags() {
    const stats = getStats();
    const flags = JSON.parse(localStorage.getItem('rflags') || '{}');
    const inv = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    // Track deaths
    const deathCount = parseInt(flags.deathCount || '0', 10);
    if (deathCount > stats.totalDeaths) {
      stats.totalDeaths = deathCount;
    }
    
    // Track items
    inv.forEach(item => {
      const itemId = (typeof item === 'string') ? item : (item.id || '');
      trackItemCollected(itemId);
    });
    
    // Track special flags
    if (flags.heardVoice) unlockAchievement('voice_heard');
    if (flags.perfectComplete) trackEnding('perfect');
    if (flags.trueAltComplete) trackEnding('true');
    
    // Bridge lore
    const bridgeInvestigated = localStorage.getItem('bridgeInvestigated') === 'true';
    if (bridgeInvestigated) {
      const itemCount = inv.length;
      if (itemCount >= 4) unlockAchievement('bridge_master');
    }
    
    // Perfect path memories
    const memoryKeys = ['memory_tavern','memory_cellar','memory_riverbank','memory_haunt','memory_town'];
    const allMemories = memoryKeys.every(k => localStorage.getItem(k) === 'true');
    if (allMemories) unlockAchievement('memory_complete');
    
    saveStats(stats);
  }

  // === JOURNAL UNLOCK SYSTEM ===
  function checkJournalUnlock() {
    // Skip if already unlocked
    if (localStorage.getItem('journalUnlocked') === 'true') return false;
    
    const stats = getStats();
    const inv = JSON.parse(localStorage.getItem('inventory') || '[]');
    const flags = JSON.parse(localStorage.getItem('rflags') || '{}');
    
    // Three unlock conditions
    const hasEnding = (stats.endingsReached && stats.endingsReached.length > 0);
    const hasItems = inv.length >= 4;
    const hasDeaths = (flags.deathCount || 0) >= 3;
    
    if (hasEnding || hasItems || hasDeaths) {
      localStorage.setItem('journalUnlocked', 'true');
      console.log("📖 Journal unlocked!", { hasEnding, hasItems, hasDeaths });
      
      // Flag that journal was just unlocked (for notification)
      localStorage.setItem('journalJustUnlocked', 'true');
      return true;
    }
    
    return false;
  }

  // === Add Styles ===
  const style = document.createElement('style');
  style.textContent = `
    .achievement-notification {
      position: fixed;
      top: 80px;
      right: 20px;
      background: linear-gradient(135deg, #1a2332 0%, #0d1520 100%);
      border: 2px solid rgba(156,207,255,0.4);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      z-index: 10001;
      opacity: 0;
      transform: translateX(400px);
      transition: all 0.5s ease;
    }
    .achievement-notification.show {
      opacity: 1;
      transform: translateX(0);
    }
    .achievement-icon {
      font-size: 2rem;
      filter: drop-shadow(0 0 10px rgba(156,207,255,0.5));
    }
    .achievement-text {
      color: #d0eaff;
    }
    .achievement-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9cf;
      margin-bottom: 0.25rem;
    }
    .achievement-name {
      font-size: 1rem;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  // ============================================================
// REPLACE THE END OF achievements.js WITH THIS
// (Find the line "// === Initialize on page load ===" 
//  and replace everything from there to the end)
// ============================================================

  // === Initialize on page load ===
  document.addEventListener('DOMContentLoaded', () => {
    initStats();
    autoTrackFromFlags();
    
    // Track current location
    const scene = document.body.dataset.scene;
    if (scene) trackLocation(scene);
    
    // Check journal unlock
    checkJournalUnlock();
    
    // Initialize journal button (if unlocked)
    initJournalButton();
  });

  // === Expose globally ===
  window.unlockAchievement = unlockAchievement;
  window.trackDeath = trackDeath;
  window.trackEnding = trackEnding;
  window.trackLocation = trackLocation;
  window.trackItemCollected = trackItemCollected;
  window.getPlayerStats = getStats;
  window.getAchievements = () => ACHIEVEMENTS;
  window.checkJournalUnlock = checkJournalUnlock;

})();

// ============================================================
// JOURNAL BUTTON SYSTEM (runs after achievements code)
// ============================================================
(function() {
  'use strict';
  
  function createJournalButton() {
    // Don't duplicate
    if (document.getElementById('journal-btn-universal')) return;
    
    const btn = document.createElement('a');
    btn.id = 'journal-btn-universal';
    btn.href = 'journal.html';
    btn.title = "The Keeper's Journal - Guide & Hints";
    btn.innerHTML = '📖';
    btn.style.cssText = `
      position: fixed;
      top: 0.5rem;
      left: 0.5rem;
      background: linear-gradient(135deg, #6b4423 0%, #4a2f1a 100%);
      border: 2px solid rgba(210,180,140,0.7);
      color: #f5deb3;
      padding: 0.5rem 0.8rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.4rem;
      z-index: 10002;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.6);
      transition: all 0.3s;
    `;
    
    // Hover effect
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'linear-gradient(135deg, #8b5a2b 0%, #654321 100%)';
      btn.style.transform = 'scale(1.1)';
      btn.style.boxShadow = '0 0 20px rgba(210,180,140,0.8)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'linear-gradient(135deg, #6b4423 0%, #4a2f1a 100%)';
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.6)';
    });
    
    document.body.appendChild(btn);
    console.log('✓ Journal button shown');
  }
  
  function showJournalUnlockToast() {
    const toast = document.createElement('div');
    toast.id = 'journal-unlock-toast';
    toast.style.cssText = `
      position: fixed;
      top: 70px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: linear-gradient(135deg, #2a1810 0%, #1a0f08 100%);
      border: 2px solid rgba(210,180,140,0.6);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      box-shadow: 0 8px 30px rgba(0,0,0,0.9);
      z-index: 10003;
      opacity: 0;
      pointer-events: none;
      transition: all 0.5s ease;
      text-align: center;
      max-width: 300px;
    `;
    
    toast.innerHTML = `
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📖</div>
      <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: #c9a66b; font-weight: bold; margin-bottom: 0.25rem;">The Keeper's Journal</div>
      <div style="font-size: 0.85rem; color: #d2b48c; line-height: 1.4;">Guide unlocked! Look for 📖 in the top-left corner.</div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Animate out
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => toast.remove(), 500);
    }, 5000);
    
    localStorage.removeItem('journalJustUnlocked');
  }
  
  function initJournalButton() {
    // Check if unlocked
    const isUnlocked = localStorage.getItem('journalUnlocked') === 'true';
    const justUnlocked = localStorage.getItem('journalJustUnlocked') === 'true';
    
    if (isUnlocked) {
      createJournalButton();
      
      if (justUnlocked) {
        setTimeout(() => showJournalUnlockToast(), 500);
      }
    }
  }
  
  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJournalButton);
  } else {
    initJournalButton();
  }
  
  // Expose globally
  window.initJournalButton = initJournalButton;
  
})();


// ============================================================
// NOW ADD THIS TO mobile.css (at the very end)
// This fixes achievement notification positioning on mobile
// ============================================================

/* === FIXED ACHIEVEMENT NOTIFICATIONS FOR MOBILE === */
@media (max-width: 768px) {
  .achievement-notification {
    left: 10px !important;
    right: 10px !important;
    top: 70px !important;
    width: auto !important;
    transform: translateX(0) !important;
    max-width: calc(100vw - 20px);
  }
  
  .achievement-notification.show {
    transform: translateX(0) !important;
  }
  
  /* Journal unlock toast on mobile */
  #journal-unlock-toast {
    top: 70px !important;
    left: 10px !important;
    right: 10px !important;
    max-width: calc(100vw - 20px) !important;
    transform: translateX(0) translateY(-20px) !important;
  }
  
  /* Item examination modal on mobile */
  .modal-content {
    width: 95% !important;
    max-width: 95% !important;
    padding: 1.5rem 1rem !important;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-close {
    width: 44px !important;
    height: 44px !important;
    font-size: 1.5rem !important;
  }
  
  /* Journal button on mobile */
  #journal-btn-universal {
    top: 0.5rem !important;
    left: 0.5rem !important;
    font-size: 1.2rem !important;
    padding: 0.4rem 0.7rem !important;
    z-index: 10002 !important;
  }
  
  /* Ensure achievement notifications are above inventory */
  .achievement-notification {
    z-index: 10001 !important;
  }
  
  /* Keep inventory below notifications */
  #inventory-box {
    z-index: 50 !important;
  }
  
  #memory-box {
    z-index: 50 !important;
  }
}

/* === TOUCH DEVICE IMPROVEMENTS === */
@media (hover: none) and (pointer: coarse) {
  .achievement-notification {
    padding: 1rem !important;
  }
  
  .achievement-icon {
    font-size: 2rem !important;
  }
  
  .achievement-name {
    font-size: 0.95rem !important;
  }
  
  /* Make sure modals are touchable */
  .modal-overlay {
    -webkit-tap-highlight-color: transparent;
  }
  
  .modal-close {
    min-width: 44px;
    min-height: 44px;
    touch-action: manipulation;
  }
}