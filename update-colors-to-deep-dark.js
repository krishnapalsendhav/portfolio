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
        .replace(/#222222/g, '#0a0a0a')
        .replace(/0x222222/g, '0x0a0a0a')
        .replace(/rgba\(34, 34, 34/g, 'rgba(10, 10, 10')
        .replace(/rgba\(34,34,34/g, 'rgba(10,10,10');
        
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log('Updated: ' + file);
    }
});
