/* Add to browser console to verify achievement state */

function debugGameState() {
  console.log("=== THE RIVER SHADE - GAME STATE ===\n");
  
  // Inventory
  const inv = JSON.parse(localStorage.getItem('inventory') || '[]');
  console.log("📦 INVENTORY:", inv.length, "items");
  inv.forEach(item => {
    const name = typeof item === 'string' ? item : (item.name || item.id);
    console.log("  -", name);
  });
  
  // Memories (Perfect Path)
  console.log("\n🧠 MEMORIES:");
  ['tavern', 'cellar', 'riverbank', 'haunt', 'town'].forEach(loc => {
    const has = localStorage.getItem(`memory_${loc}`) === 'true';
    console.log(`  ${has ? '✓' : '✗'} ${loc}`);
  });
  
  // Achievements
  const stats = JSON.parse(localStorage.getItem('playerStats') || '{}');
  console.log("\n🏆 ACHIEVEMENTS:", (stats.achievements || []).length);
  (stats.achievements || []).forEach(id => console.log("  ✓", id));
  
  // Flags
  const flags = JSON.parse(localStorage.getItem('rflags') || '{}');
  console.log("\n🚩 KEY FLAGS:");
  console.log("  Deaths:", flags.deathCount || 0);
  console.log("  Perfect Unlocked:", localStorage.getItem('perfectUnlocked') === 'true');
  console.log("  Perfect Active:", localStorage.getItem('perfectPathActive') === 'true');
  console.log("  Visited Locations:", Object.keys(flags).filter(k => k.startsWith('visited')));
  
  // Unlock Status
  console.log("\n🔓 UNLOCKS:");
  console.log("  Waterfront:", localStorage.getItem('perfectWaterfrontUnlocked') === 'true');
  console.log("  Bridge:", ['memory_tavern', 'memory_cellar', 'memory_riverbank', 'memory_haunt', 'memory_town']
    .every(k => localStorage.getItem(k) === 'true'));
  
  return {
    inventory: inv,
    memories: ['tavern', 'cellar', 'riverbank', 'haunt', 'town']
      .filter(loc => localStorage.getItem(`memory_${loc}`) === 'true'),
    achievements: stats.achievements || [],
    flags: flags
  };
}

// Run it
debugGameState();