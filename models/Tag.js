module.exports = (sequelize, type) => {
    return sequelize.define('tag', {
        id: {
          type: type.UUID,
          primaryKey: true,
          defaultValue: type.UUIDV4
        },
        name: type.STRING
    })
}