const fs = require('fs');

const files = [
    './app/globals.css',
    './components/HeroNew.module.css'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    const newContent = content
        .replace(/10,10,15/g, '34,34,34')
        .replace(/10,\s*10,\s*15/g, '34, 34, 34');
        
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log('Updated: ' + file);
    }
});
