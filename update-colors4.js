const fs = require('fs');

const files = [
    './app/globals.css',
    './components/AiTerminal3D.tsx',
    './components/Scene3D.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    const newContent = content
        .replace(/#111111/g, '#222222')
        .replace(/0x111111/g, '0x222222');
        
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log('Updated: ' + file);
    }
});
