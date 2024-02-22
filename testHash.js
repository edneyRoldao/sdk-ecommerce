const crypto = require('crypto');

const key = 'STO-1234-5678';
const content = '62fc7938-b5ad-4f27-80a7-de590f1b4b97';

let hash = crypto
    .createHmac('sha256', key)
    .update(content)
    .digest('hex');

console.log(hash);
console.log(hash.length);
