const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const cors = require('cors');



//LOGIN PAGE
router.get('/', userController.view);
//create, find, update, delete
router.get('/home', userController.home);
router.post('/', userController.find);
router.get('/additem', userController.form);
router.post('/additem', userController.create);
router.get('/edititem/:id', userController.edit);
router.post('/edititem/:id', userController.update);

router.get('/viewitem/:id', userController.viewall);

router.get('/invitem', userController.invitems);
router.post('/invitem', userController.findProd);

router.get('/orderitem/:id', userController.edit);
router.post('/orderitem/:id', userController.order);

//SORT
router.post('/invitem/itemid', userController.sortitem_itemid);
router.post('/invitem/itemname', userController.sortitem_itemname);
router.post('/invitem/category', userController.sortitem_category);

//Customer
router.get('/customerlist', userController.customerget);
router.get('/viewcust/:id', userController.viewcust);
router.get('/editcust/:id', userController.editcust);
router.post('/editcust/:id', userController.updatecustomer);

router.get('/addcust', userController.get_cust);
router.post('/addcust', userController.create_cust);

//Category
router.get('/categorypage', userController.category_get);
router.get('/editcat/:id', userController.editcat);
router.post('/editcat/:id', userController.updatecat);

router.get('/addcat', userController.get_cat);
router.post('/addcat', userController.create_cat);

//Brand
router.get('/brandpage', userController.brand_get);
router.get('/editbrand/:id', userController.editbrand);
router.post('/editbrand/:id', userController.updatebrand);

router.get('/addbrand', userController.get_brand);
router.post('/addbrand', userController.create_brand);

//Stock Entry

router.get('/StockInTransaction', userController.get_stockin_transaction);
router.post('/StockInTransaction', userController.create_stockin_transaction);
router.get('/StockInEntry', userController.get_stockin_entry);
router.get('/StockInEntry/:id', userController.add_multiple_stockentry);
router.post('/StockInEntry', userController.find_StockInEntry);

//Stock In Cart
router.get('/StockinEntryCart', userController.StockinEntryCart);
router.post('/StockinEntryCart', userController.add_all_stock_entry);
router.get('/StockinEntryCart/delete/:id', userController.delete_entry_stock);
router.get('/StockinEntryCart/:id', userController.get_addstock_entry);
router.post('/StockinEntryCart/:id', userController.create_stock_entry);


//Stock In History
router.get('/StockinHistoryPage', userController.StockinHistoryPage);
router.post('/StockinHistoryPage', userController.findstock_history);


//SORT
/*router.post('/StockinHistoryPage/itemid', userController.sortStockinHistoryPage_itemid);
router.post('/StockinHistoryPage/itemname', userController.sortStockinHistoryPage_itemname);
router.post('/StockinHistoryPage/category', userController.sortStockinHistoryPage_category);
router.post('/StockinHistoryPage/supplier', userController.sortStockinHistoryPage_supplier);
router.post('/StockinHistoryPage/date', userController.sortStockinHistoryPage_date);*/
router.post('/StockinHistoryPage/FindDate', userController.FindDate);

//INVENTORY
router.get('/prodinvitem', userController.PInv);
router.get('/viewiteminInv/:id', userController.viewiteminv);
router.post('/prodinvitem', userController.findProdInv);

//Stock Return
router.get('/StockReturnPage', userController.StockReturnPage);
router.post('/StockReturnPage', userController.StockReturnPage_post);
router.get('/StockReturnPage/list', userController.StockReturnPage_list);
router.post('/StockReturnPage/list', userController.findstockreturn_history);
router.get('/StockReturnPage/list/:reff/:id', userController.get_each_return);
router.post('/StockReturnPage/list/:reff/:id', userController.post_each_return);
router.post('/StockReturnPage/list/FindDate', userController.FindDate_returnpage);

//Stock Return History
router.get('/StockReturnHistoryPage', userController.StockReturnHistoryPage);

//EMPLOYEE
router.get('/EmployeePage', userController.EmployeePage);
router.get('/EditEmployee/:id', userController.EditEmployee);
router.post('/EditEmployee/:id', userController.UpdateEmployee);
router.get('/ViewEmployee/:id', userController.ViewEmployee);
router.post('/FindEmployee', userController.FindEmployee);

router.get('/AddEmployee', userController.get_employee);
router.post('/AddEmployee', userController.create_employee);

//SUPPLIER
router.get('/SupplierPage', userController.SupplierPage);
router.get('/EditSupplier/:id', userController.EditSupplier);
router.post('/EditSupplier/:id', userController.UpdateSupplier);
router.get('/ViewSupplier/:id', userController.ViewSupplier);
router.post('/FindSupplier', userController.FindSupplier);

router.get('/AddSupplier', userController.get_Supplier);
router.post('/AddSupplier', userController.create_Supplier);

router

/*router.post('/add',(req,res) => {
    var em = req.body.quantity;
    res.render('home',{title:"yes", email:em});

});*/

module.exports = router;