const express = require('express');

const routes = new express.Router();

routes.get('/', (req, res) => {
    return res.status(200).json({
        name: 'api_segue_a_trilha',
        description: 'Backend para api mobile do segue a trilha',
        version: '1.0.0'
    })
});

routes.get('*', (req, res) => {
    return res.status(200).json({
        name: 'api_segue_a_trilha',
        description: 'Backend para api mobile do segue a trilha',
        version: '1.0.0'
    })
});

module.exports = routes;