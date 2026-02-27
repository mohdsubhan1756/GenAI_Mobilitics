const crypto = require('crypto');

function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(' ')
        .filter(w => w.length > 2)
        .sort()
        .join(' ');
}

function generateConditionKey(text) {
    const normalized = normalizeText(text);
    return crypto.createHash('sha256').update(normalized).digest('hex');
}

module.exports = { normalizeText, generateConditionKey };
