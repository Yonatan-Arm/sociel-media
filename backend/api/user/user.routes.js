const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getUsers, getUserById, addUser, updateUser, removeUser } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/',   addUser)
router.put('/:id',  updateUser)
router.delete('/:id', removeUser)

module.exports = router