const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(name, password) {
    logger.debug(`auth.service - login with name: ${name}`)
    const user = await userService.getByUsername(name)
    if (!user) return Promise.reject('Invalid name or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid name or password')
    delete user.password
    return user
}

async function signup(name, password,isAdmin,friends, createdAt) {
    const saltRounds = 10
    logger.debug(`auth.service - signup with name: ${name}, fullname: ${name}`)
    if (!name || !password) return Promise.reject('fullname, name and password are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ name, password: hash, isAdmin ,friends, createdAt})
}

module.exports = {
    signup,
    login,
}