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

server.post('/api/projects', (req, res) => {
    const { name, description } = req.body;
    projects
        .insert({ name, description })
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

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

server.get('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    projects
        .get(id)
        .then(userProjects => {
            if(userProjects === 0) {
                return errorHelper(404, 'No projects by that user', res);
            }
            res.json(userProjects);
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

server.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    projects
        .update(id, { name })
        .then(response => {
            if (response === 0) {
                return errorHelper(404, 'No project by that ID.');
            } else {
                db.find(id).then(projects => {
                    res.json(projects);
                });
            }
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

server.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    projects
        .remove(id)
        .then(projectRemoved => {
            if (projectRemoved === 0) {
                return errorHelper(404, 'No project by that ID.');
            } else {
                res.json({ success: 'Project removed'});
            }
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

// ===== ACTIONS ENDPOINTS =====

server.post('/api/actions', (req, res) => {
    const { project_id, description, notes } = req.body;
    actions
        .insert({ project_id, description, notes })
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

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

server.get('/api/actions/:id', (req, res) => {
    const { id } = req.params;
    actions
        .get(id)
        .then(userActions => {
            if(userActions === 0) {
                return errorHelper(404, 'No projects by that user', res);
            }
            res.json(userActions);
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

server.put('/api/actions/:id', (req, res) => {
    const { id } = req.params;
    const { project_id, description, notes } = req.body;
    actions
        .update(id, { project_id, description, notes })
        .then(response => {
            if (response === 0) {
                return errorHelper(404, 'No project by that ID.');
            } else {
                db.find(id).then(projects => {
                    res.json(projects);
                });
            }
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

server.delete('/api/actions/:id', (req, res) => {
    const { id } = req.params;
    actions
        .remove(id)
        .then(actionRemoved => {
            if (actionRemoved === 0) {
                return errorHelper(404, 'No project by that ID.');
            } else {
                res.json({ success: 'Action removed'});
            }
        })
        .catch(err => {
            return errorHelper(500, 'Internal server error', res);
        });
});

server.listen(port, () => console.log(`Server listening at port ${port}`));