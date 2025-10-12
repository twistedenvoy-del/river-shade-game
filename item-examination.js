/* =========================================================
   item-examination.js - The River Shade Item Lore System
   Add this script to pages where you want item examination
   ========================================================= */

(function() {
  // === Item Lore Database ===
  const ITEM_LORE = {
    'journal': {
      name: 'Old Journal',
      description: 'Ink-stained pages that remember things you don\'t. The handwriting shifts between entries—sometimes steady, sometimes frantic. The last page is blank, waiting.',
      flavor: '"I wrote this to remember. Now I can\'t forget." – Final entry'
    },
    'rusty_key': {
      name: 'Rusty Key',
      description: 'Cold metal that hums when touched, as if recognizing your hand. The rust isn\'t decay—it\'s memory made tangible. It opens doors that were never meant to stay closed.',
      flavor: 'The river kept it safe. Or prisoner. It\'s hard to tell the difference.'
    },
    'rivers_heart': {
      name: 'The River\'s Heart',
      description: 'Dark as ink, pulsing faintly with light. It beats in rhythm with something deep beneath the current. When you hold it, you feel the weight of every name the river has drowned.',
      flavor: 'It doesn\'t belong to the river. It IS the river.'
    },
    'shades_mark': {
      name: 'The Shade\'s Mark',
      description: 'A smooth black stone bearing a spiral that never ends, still wet as if freshly carved. It hums almost inaudibly—a thought whispering from deep water. The spiral moves when you\'re not looking.',
      flavor: '"Welcome back." The words echo even when no one speaks.'
    },
    'silver_coin': {
      name: 'Silver Coin',
      description: 'Tarnished but whole, bearing no mint mark or date. One side shows a bridge. The other shows a reflection. Metal remembers what it was paid for.',
      flavor: 'Every bargain leaves a trace. This one hasn\'t been settled yet.'
    }
  };

  // === Create Examination Modal ===
  function createExaminationModal() {
    if (document.getElementById('item-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'item-modal';
    modal.innerHTML = `
      <div class="modal-overlay" id="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" id="modal-close">✕</button>
        <h2 id="modal-item-name"></h2>
        <div class="modal-divider"></div>
        <p id="modal-description"></p>
        <div class="modal-flavor" id="modal-flavor"></div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #item-modal {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
      }
      #item-modal.active {
        display: flex;
      }
      .modal-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(4px);
      }
      .modal-content {
        position: relative;
        background: linear-gradient(135deg, #0a1628 0%, #000814 100%);
        border: 2px solid rgba(156,207,255,0.3);
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 0 40px rgba(100,150,200,0.4);
        animation: modalFadeIn 0.3s ease;
        color: #d0eaff;
      }
      @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: #fff;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
      }
      .modal-close:hover {
        background: rgba(255,255,255,0.2);
        transform: rotate(90deg);
      }
      #modal-item-name {
        margin: 0 0 1rem 0;
        color: #9cf;
        text-shadow: 0 0 10px rgba(156,207,255,0.4);
        font-size: 1.5rem;
      }
      .modal-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(156,207,255,0.3), transparent);
        margin-bottom: 1.5rem;
      }
      #modal-description {
        line-height: 1.8;
        margin-bottom: 1.5rem;
        color: #b0d8ff;
      }
      .modal-flavor {
        padding: 1rem;
        background: rgba(0,0,0,0.3);
        border-left: 3px solid rgba(156,207,255,0.5);
        font-style: italic;
        color: #8ab;
        font-size: 0.95rem;
      }
    `;
    document.head.appendChild(style);
    
    // Close handlers
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', closeModal);
  }

  // === Show Item Details ===
  function examineItem(itemId) {
    const lore = ITEM_LORE[itemId];
    if (!lore) {
      console.warn('No lore found for item:', itemId);
      return;
    }
    
    createExaminationModal();
    
    document.getElementById('modal-item-name').textContent = lore.name;
    document.getElementById('modal-description').textContent = lore.description;
    document.getElementById('modal-flavor').textContent = lore.flavor;
    
    document.getElementById('item-modal').classList.add('active');
    
    // Track examination
    trackItemExamined(itemId);
  }

  // === Close Modal ===
  function closeModal() {
    const modal = document.getElementById('item-modal');
    if (modal) modal.classList.remove('active');
  }

  // === Track Examinations ===
  function trackItemExamined(itemId) {
    try {
      const stats = JSON.parse(localStorage.getItem('playerStats') || '{}');
      if (!stats.itemsExamined) stats.itemsExamined = [];
      
      if (!stats.itemsExamined.includes(itemId)) {
        stats.itemsExamined.push(itemId);
        localStorage.setItem('playerStats', JSON.stringify(stats));
        
        // Check lore_keeper achievement (examine all 5 items)
        const allItems = ['journal', 'rusty_key', 'rivers_heart', 'shades_mark', 'silver_coin'];
        const examinedAll = allItems.every(id => stats.itemsExamined.includes(id));
        
        if (examinedAll && window.unlockAchievement) {
          window.unlockAchievement('lore_keeper');
          console.log("Lore Keeper achievement unlocked!");
        }
      }
    } catch(e) {
      console.warn('Could not track examination:', e);
    }
  }

  // === Make Inventory Items Clickable ===
  function makeInventoryInteractive() {
    const invBox = document.getElementById('inventory-box');
    if (!invBox) return;
    
    // Replace the refresh function to add click handlers
    const originalRefresh = window.refreshInventoryBoxSafe;
    window.refreshInventoryBoxSafe = function() {
      if (originalRefresh) originalRefresh();
      
      // Add click handlers after render
      setTimeout(() => {
        const inv = JSON.parse(localStorage.getItem('inventory') || '[]');
        const lines = invBox.innerHTML.split('<br>');
        
        let newHTML = '<strong>Inventory</strong>';
        if (inv.length === 0) {
          newHTML += '<br>(empty)';
        } else {
          newHTML += '<div style="margin-top:0.5rem;font-size:0.85rem;color:#999;font-style:italic;">Click items to examine</div>';
          inv.forEach(item => {
            const itemId = (typeof item === 'string') ? item : (item.id || '');
            const itemName = (typeof item === 'string') ? item : (item.name || item.id || '');
            const hasLore = ITEM_LORE[itemId];
            
            if (hasLore) {
              newHTML += `<br><span class="inv-item-clickable" data-item="${itemId}" style="cursor:pointer;color:#9cf;text-decoration:underline;">${itemName}</span>`;
            } else {
              newHTML += `<br>${itemName}`;
            }
          });
        }
        
        invBox.innerHTML = newHTML;
        
        // Add click handlers
        invBox.querySelectorAll('.inv-item-clickable').forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            examineItem(el.dataset.item);
          });
        });
      }, 100);
    };
    
    // Trigger initial setup
    if (window.refreshInventoryBoxSafe) {
      window.refreshInventoryBoxSafe();
    }
  }

  // === Initialize ===
  document.addEventListener('DOMContentLoaded', () => {
    makeInventoryInteractive();
  });

  // === Expose globally ===
  window.examineItem = examineItem;

})();