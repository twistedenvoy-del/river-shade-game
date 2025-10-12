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

  // === Initialize on page load ===
  document.addEventListener('DOMContentLoaded', () => {
    initStats();
    autoTrackFromFlags();
    
    // Track current location
    const scene = document.body.dataset.scene;
    if (scene) trackLocation(scene);
  });

  // === Expose globally ===
  window.unlockAchievement = unlockAchievement;
  window.trackDeath = trackDeath;
  window.trackEnding = trackEnding;
  window.trackLocation = trackLocation;
  window.trackItemCollected = trackItemCollected;
  window.getPlayerStats = getStats;
  window.getAchievements = () => ACHIEVEMENTS;

})();