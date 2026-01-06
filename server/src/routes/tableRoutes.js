const express = require('express');
const router = express.Router();
const { getTables, createTable, updateTableStatus, assignWaiter } = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTables)
    .post(protect, authorize('admin', 'manager', 'owner'), createTable);

router.route('/:id/status')
    .put(protect, authorize('waiter', 'admin', 'manager', 'owner', 'staff'), updateTableStatus);

router.route('/:id/assign')
    .put(protect, authorize('waiter', 'admin', 'manager', 'owner'), assignWaiter);

module.exports = router;
