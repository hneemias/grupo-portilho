const fs = require('fs');
let content = fs.readFileSync('public/assets/img/logo_completa_traced.svg', 'utf8');
content = content.replace('viewBox="0 0 1421 800"', 'viewBox="0 0 1421 400" preserveAspectRatio="xMidYTop meet"').replace('height="800"', 'height="400"');
fs.writeFileSync('public/assets/img/logo_gp.svg', content);
