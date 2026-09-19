const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\suren\\.gemini\\antigravity-ide\\brain\\9b9870ab-f13b-46e2-b136-f0ba2512ea67\\media__1789726635324.png';
const destDir = path.join(__dirname, 'frontend', 'public');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, path.join(destDir, 'logo.png'));
fs.copyFileSync(src, path.join(destDir, 'favicon.png'));
fs.copyFileSync(src, path.join(destDir, 'favicon.ico'));

console.log('Logo copied successfully to frontend/public/ !');
