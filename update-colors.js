const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else { 
            if (file.endsWith('.css') || file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./app').concat(walk('./components'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    const newContent = content
        .replace(/rgba\(204,\s*218,\s*71/g, 'rgba(137, 233, 0')
        .replace(/#CCDA47/g, '#89E900')
        .replace(/#0A3625/g, '#111111') // Used for 3D depth shadows/materials
        .replace(/#0a0a0f/g, '#222222') // The main background
        .replace(/#111114/g, '#2A2A2A') // Surface 1
        .replace(/#18181d/g, '#333333') // Surface 2
        .replace(/#d8e55a/g, '#9fff1a') // Hover version of primary
        .replace(/Wattle/g, 'Kiwi')
        .replace(/Bottle Green/g, 'Deep Night');
        
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log('Updated: ' + file);
    }
});
