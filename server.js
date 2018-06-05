const express = require('express');
// const cors = require('cors');
const port = 5333;
const projects = require('./data/helpers/projectModel.js');
const actions = require('./data/helpers/actionModel.js');

const server = express();
server.use(express.json());
// server.use(cors({}));

const errorHelper = (status, message, res) => {
    res.status(status).json({ error: message });
};

// =============== CUSTOM MIDDLEWARE ===============

const nameCheckMiddleware = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        errorHelper(404, 'Name must be included.', res);
        next();
    } else {
        next();
    }
};

// =============== PROJECTS ENDPOINTS ===============

server.post('/api/projects', (req, res) => {
    const { name, description, completed } = req.body;
    if (!name || !description) {
        res.status(404).json({ error: 'We need name and description.' });
        return;
    }
    const newProject = { name, description, completed };
    projects
        .insert(newProject)
        .then(response => {
            console.log(response);
            res.status(201).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: 'Cannot create projects to DB.' });
        }); 
});

server.get('/api/projects', (req,res) => {
    projects
        .get()
        .then(projects => res.json(projects))
        .catch(err => res.status(500).json({ error: 'Database down!' }));
});

server.get('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    projects
        .get(id)
        .then(project => res.json(project))
        .catch(err => {
            res.status(500).json({ error: 'Database down!' });
        });
});

server.get('/api/projects/:id/actions', (req, res) => {
    const { id } = req.params;
    projects
        .getProjectActions(id)
        .then(actions => {
            res.json(actions)
        })
        .catch(err => {
            res.status(500).json({ error: 'Database down!' });
        });
});

server.put('/api/projects/:id', (req, res) => {
    const { name, description, completed } = req.body;
    const updatedProject = { name, description, completed };
    if (!name || !description) {
        res.status(404).json({ error: 'We need name and description.' });
        return;
    }
    const { id } = req.params;
    projects
        .update(id, updatedProject)
        .then(response => {
            res.json(response);
        })
        .catch(err =>
            res.status(400).json({ error: 'Cannot update that item from DB.' })
        );
});

server.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    projects
        .remove(id)
        .then(response => {
            if (response == 0) {
                res.status(404).json({ error: 'That ID does not live in our DB.' });
                return;
            }
            res.json({ success: 'Item removed from DB.' });
        })
        .catch(err => 
            res.status(400).json({ error: 'Cannot remove that item from DB.' })
        );
});

// =============== ACTIONS ENDPOINTS ===============

server.post('/api/actions', (req, res) => {
    const { project_id, description, completed, notes } = req.body;
    const newAction = { project_id, description, completed, notes }
    if (!project_id || !description) {
        res.status(404).json({ error: 'We need project ID and description.' });
        return;
    }
    actions
        .insert(newAction)
        .then(response => {
            res.status(201).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: 'Database down!' });            
        });
});

server.get('/api/actions', (req,res) => {
    actions
        .get()
        .then(actions => res.json(actions))
        .catch(err => res.status(500).json({ error: 'Database down!' }));
});

server.get('/api/actions/:id', (req, res) => {
    const { id } = req.params;
    actions
        .get(id)
        .then(action => res.json(action))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Database down!' });
        });
});

server.put('/api/actions/:id', (req, res) => {
    const { project_id, description, notes } = req.body;
    const updatedAction = { project_id, description, notes };
    if (!project_id || !description) {
        res.status(404).json({ error: 'We need project ID and description.' });
        return;
    }
    const { id } = req.params;
    actions
        .update(id, updatedAction)
        .then(response => {
            res.json(response);
        })
        .catch(err =>
            res.status(400).json({ error: 'Cannot update that item from DB.' })
        );
});

server.delete('/api/actions/:id', (req, res) => {
    const { id } = req.params;
    actions
        .remove(id)
        .then(response => {
            if (response == 0) {
                res.status(404).json({ error: 'That ID does not live in our DB.' });
                return;
            }
            res.json({ success: 'Item removed from DB.' });
        })
        .catch(err => 
            res.status(400).json({ error: 'Cannot remove that item from DB.' })
        );
});

server.listen(port, () => console.log(`Server listening at port ${port}`));