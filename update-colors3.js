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
    
    const newContent = content
        .replace(/rgba\(8,\s*8,\s*12/g, 'rgba(34, 34, 34')
        .replace(/rgba\(8,8,12/g, 'rgba(34,34,34')
        .replace(/rgba\(10,10,15/g, 'rgba(34,34,34')
        .replace(/rgba\(10,\s*10,\s*15/g, 'rgba(34, 34, 34');
        
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log('Updated: ' + file);
    }
});
