const express = require('express');
const crypto = require('node:crypto');
const router = express.Router();

router.get('/genSecretKey', (req, res) =>{

    const genKey = crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16).toString('hex');
    res.json({genKey, iv});
});

router.post('/encrypt', (req, res) => {

    const { longKey, text } = req.body;
    const algorithm = 'aes-256-cbc';
    const secretKey = Buffer.from(longKey.slice(0, 64), 'hex');
    const genIv = Buffer.from(longKey.slice(64, 96), 'hex');
    const cipher = crypto.createCipheriv(algorithm, secretKey, genIv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    res.json({ encrypted });
});

router.post('/decrypt', (req, res) => {

    const { decLongKey, decText } = req.body;
    const algorithm = 'aes-256-cbc';
    const decSecretKey = Buffer.from(decLongKey.slice(0, 64), 'hex');
    const decGenIv = Buffer.from(decLongKey.slice(64, 96), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, decSecretKey, decGenIv);
    let decrypted = decipher.update(decText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    res.json({ decrypted });
});

module.exports = router;