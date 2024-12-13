import { createNotification, findManyNotifications, updateNotification } from 'controllers/notification'
import express from 'express'
import { verifyJWT } from 'middlewares/auth'


const notificationRouter = express.Router()

notificationRouter.use(verifyJWT)

notificationRouter.get('/', findManyNotifications)
notificationRouter.post('/', createNotification)
notificationRouter.patch('/:id', updateNotification)

export default notificationRouter