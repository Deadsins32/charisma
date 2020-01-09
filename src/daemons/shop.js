Math.seedrandom = require('seedrandom');

module.exports = function(imports) {
    imports.shop = {
        getPrice: function(item) {
            var date = new Date();
            Math.seedrandom(`${date.getDate()}${item.name}`);
            return Math.floor(Math.random() * (item.value * 1.5) + (item.value * 0.5));
        },
    
        isAvailable: function(item) {
            var date = new Date();
            Math.seedrandom(`${date.getDate()}${item.name}`);
            var rarity = 3;
            if (item.tags.includes('uncommon')) { rarity = 6 }
            else if (item.tags.includes('rare')) { rarity = 12 }
            else if (item.tags.includes('elusive')) { rarity = 24 }
        
            var odds = Math.floor(Math.random() * 100);
            if (item.tags.includes('elusive')) { rarity = 90 }
            else if (item.tags.includes('rare')) { rarity = 65 }
            else if (item.tags.includes('uncommon')) { rarity = 50 }
            else { rarity = 20 }
    
            return odds > rarity;
        },
    
        getValue: function(item) {
            var toReturn;
            if (item.shoppable) { toReturn = Math.floor(this.getPrice(item) * 0.75) }
            else { toReturn = item.value }
            toReturn = Math.floor(toReturn);
            return toReturn;
        }
    }
}