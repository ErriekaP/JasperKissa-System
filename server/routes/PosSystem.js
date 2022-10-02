const express = require('express');
const router = express.Router();
const PosController = require('../controllers/PosController');
const cors = require('cors');

router.get('/OrderTransaction', PosController.OrderTransactionPage);
router.post('/OrderTransaction', PosController.OrderTransactionPage_post);

router.get('/POSPage', PosController.POSPage);
router.get('/POSPage/delete/:id', PosController.delete_all_order_entry);
router.get('/POSPage/add/:id', PosController.add_order_entry);
router.get('/POSPage/minus/:id', PosController.minus_order_entry);
router.post('/POSPage', PosController.add_all_order_entry);
router.post('/POSPage/rec', PosController.amn_received);

router.get('/OrderEntry', PosController.get_order_entry);
router.get('/OrderEntry/:id', PosController.add_multiple_item);
router.get('/OrderEntry/add/:id', PosController.add_each_item);

router.post('/OrderEntry', PosController.find_item);

router.get('/TransactionPage', PosController.TransactionPage);
router.post('/TransactionPage', PosController.find_trans);
router.post('/TransactionPage/FindDate', PosController.FindDate);



//router.get('/OrderEntryCart', PosController.OrderEntryCart);


module.exports = router;