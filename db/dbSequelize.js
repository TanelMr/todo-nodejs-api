const Sequelize = require("sequelize");
const {DataTypes} = require("sequelize");

const sequelize = new Sequelize(
    'todo',
    'Daniilo',
    'qwerty',
    {
        host: 'Localhost',
        dialect: 'mysql',
        logging: false
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const todos = sequelize.define("sequelizeTodos", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
    },
    completed: {
        type: DataTypes.STRING,
    },
    userID: {
        type: DataTypes.INTEGER
    }
});

const users = sequelize.define("sequelizeUsers", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
},
{timestamps: false});

sequelize.sync()
    .then(() => {
        console.log("Synced sequelize db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });


const logs = [];

const saveLogs = (data, method) => {
    const subLog = []
    let date = JSON.stringify(data.get('updatedAt'))
    let newDate = date.replaceAll(/T/g, ", ").replaceAll(/"/g, "")
    subLog.push(newDate.slice(0, 17), method, data.get('userID'), data.get('title'), data.get('completed'), data.previous('title'), data.previous('completed'))
    logs.push(subLog)
}

todos.beforeCreate((instance, options) => {
    const method = 'POST'
    saveLogs(instance, method)
    }
);

todos.beforeUpdate((instance, options) => {
    const method = 'PUT'
    saveLogs(instance, method)
    }
);

todos.beforeDestroy((instance, options) => {
    const method = 'DELETE'
    saveLogs(instance, method)
    }
);

const getLogs = (req, res) => {
    res.send(logs);
}

const jwt = require("jsonwebtoken");
const jwt_secret =
    "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

let sessionToken;

function checkToken(token) {
    return sessionToken === token;
}

const validateUser = (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    };
    users.findOne({ where: [credentials] })
        .then(data => {
            if (data === null){
                res.status(401).send(
                    false
                )
            }
            else {
                let token = jwt.sign({ UserID: data.id }, jwt_secret);
                sessionToken = token
                res.send({id: data.id, token: token})
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

const authorizeUser = (req, res) => {

    if (checkToken(req.body.token) === true) {
        const credentials = {
            userID: req.body.id,
        };
        todos.findAll({ where: [credentials] })
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while authorizing user."
                });
            });
    }
    else {
        res.sendStatus(401)
    }

}

const getTodos = (req, res) => {
    todos.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving todos."
            });
        });
}

const createTodo = (req, res) => {

    if (checkToken(req.body.token) === true) {

        const todo = {
            title: req.body.title,
            completed: req.body.completed,
            userID: req.body.userID
        };

        todos.create(todo)
            .then(() => {
                res.sendStatus(201);
            })
            .catch(() => {
                res.sendStatus(500);
            });
    }
    else {
        res.sendStatus(401)
    }
};

const updateTodo = (req, res) => {

    if (checkToken(req.body.token) === true) {

        const id = req.params.id;

        todos.update(req.body, {
            where: {id: id},
            individualHooks: true
        })
            .then(() => {
                res.sendStatus(201);
            })
            .catch(() => {
                res.sendStatus(500);
            });
    }
    else {
        res.sendStatus(401)
    }
};

const deleteTodo = (req, res) => {

    if (checkToken(req.body.token) === true) {

        const id = req.params.id;

        todos.destroy({
            where: {id: id},
            individualHooks: true
        })
            .then(() => {
                res.sendStatus(202);
            })
            .catch(() => {
                res.sendStatus(500);
            });
    }
    else {
        res.sendStatus(401)
    }
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    validateUser,
    authorizeUser,
    getLogs
}

