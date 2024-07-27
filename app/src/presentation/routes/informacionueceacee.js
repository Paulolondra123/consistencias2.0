const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/proxy', async (req, res) => {

    try {
        const response = await axios.get('https://rue.sie.gob.bo');

        let data = response.data;

        // Reemplazar URLs de recursos para que apunten al proxy
        data = data.replace(/(href|src)="\/(.*?)"/g, (match, p1, p2) => {
            return `${p1}="/proxy/${p2}"`;
        });

        res.send(data);
    } catch (error) {
        console.error('Error al hacer la solicitud proxy:', error.message);
        res.status(500).send('Error al hacer la solicitud proxy');
    }
});




module.exports = router;
