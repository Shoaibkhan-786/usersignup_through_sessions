const { connect, connection, set} = require('mongoose');

const db_connect = async (req,res) => {
    return connect("mongodb://localhost:27017/session-demo-database")
}

connection.on('connected', () => {
    console.log('database connected');
})

module.exports = db_connect