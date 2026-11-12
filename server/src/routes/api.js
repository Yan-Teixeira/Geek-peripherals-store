import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { objectBody, validateProduct } from '../middlewares/validate.js'
import { requireAuth, requireAdmin, optionalAuth } from '../middlewares/auth.js'
import * as auth from '../controllers/authController.js'
import * as products from '../controllers/productController.js'
import * as variations from '../controllers/variationController.js'
import * as orders from '../controllers/orderController.js'
import * as users from '../controllers/userController.js'
import { home, recordView, weeklyOffer } from '../controllers/homeController.js'
import { getDashboard } from '../controllers/dashboardController.js'

const router = Router()
router.post('/auth/register', objectBody, asyncHandler(auth.register))
router.post('/auth/login', objectBody, asyncHandler(auth.login))
router.get('/auth/me', requireAuth, asyncHandler(auth.me))
router.post('/auth/logout', requireAuth, auth.logout)

router.get('/home', asyncHandler(home))
router.post('/products/:id/views', requireAuth, asyncHandler(recordView))
router.patch('/products/:id/weekly-offer', requireAuth, requireAdmin, objectBody, asyncHandler(weeklyOffer))
router.get('/products', optionalAuth, asyncHandler(products.list))
router.get('/products/:id', asyncHandler(products.get))
router.post('/products', requireAuth, requireAdmin, objectBody, validateProduct, asyncHandler(products.create))
router.patch('/products/:id', requireAuth, requireAdmin, objectBody, validateProduct, asyncHandler(products.update))
router.delete('/products/:id', requireAuth, requireAdmin, asyncHandler(products.remove))

router.get('/products/:id/variations', optionalAuth, asyncHandler(variations.list))
router.post('/products/:id/variations', requireAuth, requireAdmin, objectBody, variations.validate, asyncHandler(variations.create))
router.patch('/products/:id/variations/:variationId', requireAuth, requireAdmin, objectBody, variations.validate, asyncHandler(variations.update))
router.delete('/products/:id/variations/:variationId', requireAuth, requireAdmin, asyncHandler(variations.remove))

router.post('/orders', requireAuth, objectBody, asyncHandler(orders.create))
router.get('/orders', requireAuth, asyncHandler(orders.list))
router.get('/orders/:id', requireAuth, asyncHandler(orders.get))
router.patch('/orders/:id', requireAuth, requireAdmin, objectBody, asyncHandler(orders.updateStatus))
router.delete('/orders/:id', requireAuth, requireAdmin, asyncHandler(orders.remove))

router.get('/users', requireAuth, requireAdmin, asyncHandler(users.list))
router.get('/users/:id', requireAuth, asyncHandler(users.get))
router.patch('/users/:id', requireAuth, objectBody, asyncHandler(users.update))
router.delete('/users/:id', requireAuth, asyncHandler(users.remove))
router.get('/dashboard', requireAuth, requireAdmin, asyncHandler(getDashboard))
export default router
