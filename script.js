const spamKeywords = [
    'free', 'win', 'winner', 'congratulations', 'prize', 'lottery', 'cash',
    'urgent', 'act now', 'limited time', 'offer expires', 'click here',
    'buy now', 'discount', '50% off', '100% free', 'no cost',
    'viagra', 'cialis', 'weight loss', 'lose weight', 'miracle',
    'make money', 'work from home', 'earn $', 'get rich', 'million',
    'password', 'verify account', 'update account', 'suspended',
    'nigeria', 'prince', 'inheritance', 'bank transfer',
    'unsubscribe', 'remove me', 'opt out', 'credit card',
    'dear friend', 'dear customer', 'urgent response'
];

const suspiciousPatterns = [
    /[A-Z]{5,}/g, // All caps words
    /\$\d+/g, // Money amounts
    /!\s*!/g, // Multiple exclamation marks
    /http[s]?:\/\/[^\s]+/g, // URLs
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
];

document.getElementById('spamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const subject = document.getElementById('emailSubject').value.toLowerCase();
    const body = document.getElementById('emailBody').value.toLowerCase();
    const fullText = subject + ' ' + body;
    
    let spamScore = 0;
    const reasons = [];
    
    // Check for spam keywords
    spamKeywords.forEach(keyword => {
        if (fullText.includes(keyword)) {
            spamScore += 10;
            reasons.push(`Contains suspicious keyword: "${keyword}"`);
        }
    });
    
    // Check for suspicious patterns
    if (/[A-Z]{10,}/.test(document.getElementById('emailSubject').value + document.getElementById('emailBody').value)) {
        spamScore += 15;
        reasons.push('Excessive use of capital letters');
    }
    
    const urlMatches = fullText.match(/http[s]?:\/\/[^\s]+/g);
    if (urlMatches && urlMatches.length > 2) {
        spamScore += 20;
        reasons.push(`Contains ${urlMatches.length} suspicious links`);
    } else if (urlMatches && urlMatches.length === 1) {
        spamScore += 5;
        reasons.push('Contains external links');
    }
    
    if (fullText.match(/!\s*!/g)) {
        spamScore += 10;
        reasons.push('Excessive use of exclamation marks');
    }
    
    if (fullText.match(/\$\d+/g)) {
        spamScore += 15;
        reasons.push('Mentions money/currency amounts');
    }
    
    if (subject.includes('re:') === false && subject.includes('fwd:') === false && 
        (subject.includes('free') || subject.includes('win') || subject.includes('urgent'))) {
        spamScore += 10;
        reasons.push('Suspicious subject line');
    }
    
    // Determine result
    const resultDiv = document.getElementById('result');
    const resultTitle = document.getElementById('resultTitle');
    const resultScore = document.getElementById('resultScore');
    const reasonsList = document.getElementById('reasonsList');
    
    reasonsList.innerHTML = '';
    
    if (spamScore >= 30) {
        resultDiv.className = 'result spam';
        resultTitle.textContent = '⚠️ This email is likely SPAM';
        resultScore.textContent = `Spam Score: ${spamScore}/100`;
    } else if (spamScore >= 15) {
        resultDiv.className = 'result spam';
        resultTitle.textContent = '⚠️ This email is potentially SPAM';
        resultScore.textContent = `Spam Score: ${spamScore}/100`;
    } else {
        resultDiv.className = 'result safe';
        resultTitle.textContent = '✅ This email looks SAFE';
        resultScore.textContent = `Spam Score: ${spamScore}/100`;
        
        if (reasons.length === 0) {
            reasons.push('No suspicious patterns detected');
        }
    }
    
    // Display reasons
    reasons.slice(0, 6).forEach(reason => {
        const li = document.createElement('li');
        li.textContent = reason;
        reasonsList.appendChild(li);
    });
    
    resultDiv.style.display = 'block';
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('spamForm').reset();
    document.getElementById('result').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
