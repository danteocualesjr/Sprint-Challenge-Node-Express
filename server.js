const express = require('express');
const cors = require('cors');
const projects = require('./data/helpers/projectModel.js');
const actions = require('./data/helpers/actionModel.js');
const port = 5333;

const server = express();
server.use(express.json());
server.use(cors({}));

const errorHelper = (status, message, res) => {
    res.status(status).json({ error: message });
};

// ===== CUSTOM MIDDLEWARE ===

const nameCheckMiddleware = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        errorHelper(404, 'Name must be included.', res);
        next();
    } else {
        next();
    }
};

// ===== PROJECTS ENDPOINTS =====

server.get('/api/projects', (req,res) => {
    projects
        .get()
        .then(foundProjects => {
            res.json(foundProjects);
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

// ===== ACTIONS ENDPOINTS =====

server.get('/api/actions', (req,res) => {
    actions
        .get()
        .then(foundActions => {
            res.json(foundActions);
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

server.listen(port, () => console.log(`Server listening at port ${port}`));