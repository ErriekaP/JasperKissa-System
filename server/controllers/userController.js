const mysql = require('mysql');
const router = require('../routes/user');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

// View Items
exports.view = (req,res) => {
    

res.render('login', {true: {login: true }});

}

// View Items
exports.home = (req,res) => {
    
  res.render('home');
    };
    


/////Product Inventory
//View Items Inventory

exports.invitems = (req,res) => { 
    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT item_id, item_name,item.category_id,item.brand_id,category_name,brand_name,item.description,quantity,final_price,stock,supp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item,category,brand WHERE category.category_id = item.category_id AND brand.brand_id = item.brand_id GROUP BY item_id',(err,rows) => {
            // When done with the connection, release it
            connection.release();
            if(!err){
                res.render('inventory', {rows});
               
            } else{
                
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };


//Find item by search
exports.findProd = (req,res) => {

pool.getConnection((err,connection) => {
    if(err) throw err; //not connected!
    console.log('Connected as ID' + " " + connection.threadId)

    let searchTerm = req.body.search;

    //User the connection
    connection.query('SELECT item_id, item_name,item.category_id,category_name,brand.brand_id,brand_name,description,quantity,final_price,stock,supp_id,emp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item,category,brand WHERE category.category_id = item.category_id AND brand.brand_id = item.brand_id AND (item_name LIKE ? OR (CONCAT("ID",item_id)) LIKE ?  OR brand_name LIKE ? OR category_name LIKE ?) Group by item_id  ', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
        // When done with the connection, release it
        connection.release();

        if(!err){
            res.render('inventory', {rows});
        } else{
            console.log(err);
        }

        console.log('The data from user table: \n', rows);



    });
});

}
//Sort items
exports.sortitem_itemid = (req,res) => {
    
    pool.getConnection((err,connection) => {

        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)

        let orderby_itemname = req.body.itemname;

        connection.query('SELECT item_id, item_name,item.category_id,category_name,brand.brand_id,brand_name,description,quantity,final_price,stock,supp_id,emp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item,category,brand WHERE category.category_id = item.category_id AND brand.brand_id = item.brand_id Order by item_id ',[], (err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('inventory', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
            
        });
    });
}
exports.sortitem_itemname = (req,res) => {
    
    pool.getConnection((err,connection) => {

        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)

        let orderby_itemname = req.body.itemname;

        connection.query('SELECT item_id, item_name,item.category_id,category_name,brand.brand_id,brand_name,description,quantity,final_price,stock,supp_id,emp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item,category,brand WHERE category.category_id = item.category_id AND brand.brand_id = item.brand_id Order by item_name ',[], (err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('inventory', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
            
        });
    });
}

exports.sortitem_category = (req,res) => {
    
    pool.getConnection((err,connection) => {

        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)

        let orderby_itemname = req.body.itemname;

        connection.query('SELECT item_id, item_name,item.category_id,category_name,brand.brand_id,brand_name,description,quantity,final_price,stock,supp_id,emp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item,category,brand WHERE category.category_id = item.category_id AND brand.brand_id = item.brand_id Order by category_name ',[], (err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('inventory', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
            
        });
    });
}

exports.form = (req,res) => {
     
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT emp_firstname, emp_id from employee WHERE employee.position = "Admin" AND employee.status = "active" ',[req.params.id],(err,emp) => {
            // When done with the connection, release it
            connection.query('SELECT category_name, category_id FROM category',[req.params.id],(err,cat) => {
                connection.query('SELECT brand_name, brand_id FROM brand ',[req.params.id],(err,brand) => {
                    connection.query('SELECT company_name, supp_id FROM supplier WHERE status = "active" ',[req.params.id],(err,supp) => {

            connection.release();

            if(!err){
                res.render('add-item',{admin_list:emp,supplier_list:supp,cat_list:cat,brand_list:brand});

            } 

            else{
                console.log(err);
            }
    
            //console.log('The data from user table: \n', rows1);
            //console.log('The data from user table: \n', rows2);
    
    
                  });
            });
        });
    });
       
    });

}

//Add new item 
exports.create = (req,res) => {
  const {item_name, category, brand, description, price,employee } = req.body;
  var type,fprice;

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let searchTerm = req.body.search;
        

        if (req.body.flexRadioDefault == "Small Items") {
            type = "Small Items";
            fprice = price * (1.08/0.76);
        } else {
            type = "Big Items";
            fprice = price * (1.08/0.86);
         }

        //User the connection
        connection.query('INSERT INTO item SET item_name = ?, category_id = ?, brand_id = ?, description = ?,  price = ?, type = ?, emp_id = ?,final_price = ? ', [item_name,category,brand,description,price,type,employee,fprice],(err,rows) => {

            // When done with the connection, release it
            connection.release()
    
            if(!err){
                res.render('add-item',{alert: 'Item added successfully.'});
                console.log("type" + type);
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    

}
//Edit Item
exports.edit = (req,res) => {
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM item WHERE item_id = ?',[req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('edit-item', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}

//Update Item
exports.update = (req,res) => {

    const{item_name, description,price} = req.body;
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('UPDATE item SET item_name = ? , price = ? , description = ? WHERE item_id = ? ',[item_name, price, description, req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){

                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM item WHERE item_id = ?',[req.params.id],(err,rows) => {
                        // When done with the connection, release it
                        connection.release();
                
                        if(!err){
                            res.render('edit-item', {rows, alert: `${item_name} has been updated`});
                        } else{
                            console.log(err);
                        }
                
                        console.log('The data from user table: \n', rows);          
                
                    });
                });

            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}
//Order Item
exports.order = (req,res) => {

    const{item_name, item_category, supplier,price,stock} = req.body;
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('UPDATE item SET item_name = ?, item_category = ? , supplier = ? , price = ? , stock = ? WHERE item_id = ? ',[item_name, item_category, supplier, price, stock, req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){

                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM item WHERE item_id = ?',[req.params.id],(err,rows) => {
                        // When done with the connection, release it
                        connection.release();
                
                        if(!err){
                            res.render('edit-item', {rows, alert: `${item_name} has been updated`});
                        } else{
                            console.log(err);
                        }
                
                        console.log('The data from user table: \n', rows);          
                
                    });
                });

            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}

//View Items button
exports.viewall = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT *,DATE_FORMAT(st.date_added,"%m-%d-%Y") AS datein FROM item as i,supplier as s,brand as b,category as c,employee as e,stock_entry as se,stockin_transaction as st WHERE i.item_id = ? AND i.category_id = c.category_id AND i.brand_id = b.brand_id AND se.item_id = i.item_id AND encoded_by = e.emp_id AND reff_num = stockin_trans_id AND s.supp_id = i.supp_id ORDER BY st.date_added', [req.params.id],(err,rows) => {
            connection.query('SELECT *, DATE_FORMAT(i.datein,"%m-%d-%Y") AS datein FROM item as i,brand as b,category as c,employee as e WHERE i.category_id = c.category_id AND i.brand_id = b.brand_id AND i.emp_id = e.emp_id AND i.item_id=?  ORDER BY i.datein', [req.params.id],(err,rows2) => {
                connection.query('SELECT *, DATE_FORMAT(cst.date_cancelled,"%m-%d-%Y") AS datein FROM item as i,brand as b,category as c,employee as e,cancel_stock_trans as cst, stock_entry as se,stockin_transaction as st, supplier as s WHERE s.supp_id = cst.supp_id AND i.item_id = ? AND i.category_id = c.category_id AND i.brand_id = b.brand_id AND se.item_id = i.item_id AND cancelled_by = e.emp_id AND reff_num = stockin_trans_id AND cst.reff_id = se.reff_num AND i.item_id = cst.item_id ORDER BY st.date_added', [req.params.id],(err,cancel) => {
                    connection.query('SELECT *, DATE_FORMAT(ot.date_added,"%m-%d-%Y") AS datein FROM item as i,brand as b,category as c,employee as e, order_entry as oe,order_transaction as ot WHERE i.item_id = ? AND i.category_id = c.category_id AND i.brand_id = b.brand_id AND oe.item_id = i.item_id AND ot.encoded_by = e.emp_id AND ot.order_trans_id = oe.order_trans_id AND cancelled = "No"  ORDER BY ot.date_added', [req.params.id],(err,trans) => {


            // When done with the connection, release it
            connection.release();
            if(!err){
                res.render('view-item', {rows,rows2,cancel:cancel,trans:trans});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
        });
        });
        });
    });
    });

    };

//Customer Tab//

// View Customers
exports.customerget = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM customer',(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('customer-list', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };

//View Customer Button
exports.viewcust = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM customer WHERE cust_id = ?', [req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('view-cust', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };

//Edit Customer
exports.editcust = (req,res) => {
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM customer WHERE cust_id = ?',[req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('edit-cust', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}


//Update Customer
exports.updatecustomer = (req,res) => {

    const{cust_first_name, cust_last_name, phone_num} = req.body;
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('UPDATE customer SET cust_first_name = ?, cust_last_name = ? , phone_num = ? WHERE cust_id = ? ',[cust_first_name, cust_last_name, phone_num, req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){

                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM customer WHERE cust_id = ?',[req.params.id],(err,rows) => {
                        // When done with the connection, release it
                        connection.release();
                
                        if(!err){
                            res.render('edit-cust', {rows, alert: `${cust_first_name} has been updated`});
                        } else{
                            console.log(err);
                        }
                
                        console.log('The data from user table: \n', rows);          
                
                    });
                });

            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}

//Find customer by search
exports.find = (req,res) => {

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let searchTerm = req.body.search;
    
        //User the connection
        connection.query('SELECT * FROM customer WHERE cust_first_name LIKE ? OR cust_last_name LIKE ? ', ['%' + searchTerm + '%','%' + searchTerm + '%' ],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('customer-list', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    }

exports.get_cust = (req,res) => {
        res.render('add-customer');
    }

    //Add new customer by search
    exports.create_cust = (req,res) => {
      const{ cust_first_name, cust_last_name, phone_num } = req.body;

        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
        
            let searchTerm = req.body.search;
        
            //User the connection
            connection.query('INSERT INTO customer SET cust_first_name = ?, cust_last_name = ? , phone_num = ?', [cust_first_name,cust_last_name,phone_num],(err,rows) => {
                // When done with the connection, release it
                connection.release();
        
                if(!err){
                    res.render('add-customer',{rows, alert: `Successfully Added`});
                } else{
                    console.log(err);
                }
        
                console.log('The data from user table: \n', rows);
        
        
            });
        });
        
    
    }

//////CATEGORY PAGE/////////////

// View Customers
exports.category_get = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM category',(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('page-category', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };


//Edit category
exports.editcat = (req,res) => {
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM category WHERE category_id = ?',[req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('edit-category', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}


//Update Customer
exports.updatecat = (req,res) => {

    const{category_name} = req.body;
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('UPDATE category SET category_name = ? WHERE category_id = ? ',[category_name, req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){

                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM category WHERE category_id = ?',[req.params.id],(err,rows) => {
                        // When done with the connection, release it
                        connection.release();
                
                        if(!err){
                            res.render('edit-category', {rows, alert: `${category_name} has been updated`});
                        } else{
                            console.log(err);
                        }
                
                        console.log('The data from user table: \n', rows);          
                
                    });
                });

            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}


exports.get_cat = (req,res) => {
        res.render('add-category');
    }

    //Add new category by search
    exports.create_cat = (req,res) => {
      const{ category_name } = req.body;

        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
        
            let searchTerm = req.body.search;
        
            //User the connection
            connection.query('INSERT INTO category SET category_name = ?', [category_name],(err,rows) => {
                // When done with the connection, release it
                connection.release();
        
                if(!err){
                    res.render('add-category',{rows, alert: `Successfully Added`});
                } else{
                    console.log(err);
                }
        
                console.log('The data from user table: \n', rows);
        
        
            });
        });
        
    
    }

//////BRAND PAGE/////////////

// View Customers
exports.brand_get = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM brand',(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('page-brand', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };


//Edit category
exports.editbrand = (req,res) => {
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM brand WHERE brand_id = ?',[req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('edit-brand', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}


//Update Customer
exports.updatebrand = (req,res) => {

    const{brand_name,description} = req.body;
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('UPDATE brand SET brand_name = ?, brand_desc = ? WHERE brand_id = ? ',[brand_name,description, req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){

                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM brand WHERE brand_id = ?',[req.params.id],(err,rows) => {
                        // When done with the connection, release it
                        connection.release();
                
                        if(!err){
                            res.render('edit-brand', {rows, alert: `${brand_name} has been updated`});
                        } else{
                            console.log(err);
                        }
                
                        console.log('The data from user table: \n', rows);          
                
                    });
                });

            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}


exports.get_brand = (req,res) => {
        res.render('add-brand');
    }

    //Add new category by search
    exports.create_brand = (req,res) => {
      const{ brand_name,description } = req.body;

        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
        
            let searchTerm = req.body.search;
        
            //User the connection
            connection.query('INSERT INTO brand SET brand_name = ?,brand_desc = ?', [brand_name,description],(err,rows) => {
                // When done with the connection, release it
                connection.release();
        
                if(!err){
                    res.render('add-brand',{rows, alert: `Successfully Added`});
                } else{
                    console.log(err);
                }
        
                console.log('The data from user table: \n', rows);
        
        
            });
        });
        
    
    }
       

////////// STOCK ENTRY //////////

exports.get_stockin_transaction = (req,res) => {

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT emp_firstname, emp_id from employee WHERE employee.position = "Admin" AND employee.status = "active" ',[req.params.id],(err,emp) => {
            // When done with the connection, release it
            connection.query('SELECT category_name, category_id FROM category',[req.params.id],(err,cat) => {
                connection.query('SELECT brand_name, brand_id FROM brand ',[req.params.id],(err,brand) => {
                    connection.query('SELECT company_name, supp_id FROM supplier WHERE status = "active" ',[req.params.id],(err,supp) => {

            connection.release();

            if(!err){
                res.render('PAGE-stockin_trans',{admin_list:emp,supplier_list:supp,cat_list:cat,brand_list:brand});

            } 

            else{
                console.log(err);
            }
    
            //console.log('The data from user table: \n', rows1);
            //console.log('The data from user table: \n', rows2);
    
    
                  });
            });
        });
    });
       
    });


    };

    exports.create_stockin_transaction = (req,res) => {
        const {supplier, encoded_by, date_added} = req.body;
      
          pool.getConnection((err,connection) => {
              if(err) throw err; //not connected!
              console.log('Connected as ID' + " " + connection.threadId)
          
              let searchTerm = req.body.search;
              
              //User the connection
              connection.query('INSERT INTO stockin_transaction SET supplier = ?, encoded_by = ?, date_added = ? ', [supplier,encoded_by,date_added],(err,rows) => {
      
                  // When done with the connection, release it
                  connection.release()
          
                  if(!err){
                      res.render('PAGE-stockin_trans',{alert: 'Stock added successfully.'});
                      res.redirect('/StockInEntry');
                  } else{
                      console.log(err);
                  }
          
                  console.log('The data from user table: \n', rows);
          
          
              });
          });
          
      
      }

 exports.get_stockin_entry = (req,res) => {

        //Connect to DB
        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
            //User the connection
            connection.query('SELECT item_id, item_name,item.category_id,category_name,brand.brand_id,brand_name,description,quantity,price,stock,supp_id,emp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item,category,brand WHERE category.category_id = item.category_id AND brand.brand_id = item.brand_id GROUP BY item_id',(err,rows) => {
                connection.query('SELECT stockin_trans_id,supplier, company_name, address FROM stockin_transaction, supplier WHERE stockin_trans_id = (SELECT stockin_trans_id FROM stockin_transaction ORDER BY stockin_trans_id DESC LIMIT 1) AND supplier = supp_id',(err,ref) => {

                // When done with the connection, release it
                connection.release();
            
    
                if(!err){
    
                res.render('PAGE-stock_entry', {rows,reference_num:ref});
               
                    }
                    else{
                    console.log(err);
                }
                console.log(ref); 
                //console.log('The data from user table: \n', rows);
        
        
            });
        });
    });
    
 };

 exports.add_multiple_stockentry = (req,res) => {
    

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        
                //User the connection
        connection.query('INSERT INTO stock_cart(item_id,stock) SELECT item.item_id,stock FROM item WHERE item.item_id = ?',[ req.params.id],(err,rows) => {
                    // When done with the connection, release it
                        //connection.release();
            if(!err){
                  
                res.redirect('/StockInEntry');
                            
                     }
             else{
                 console.log(err);
                                res.redirect('/StockInEntry');
                            }
                     
           
                    
                    console.log('The data from user table2: \n', rows);
                    console.log(err);
                    
            
                });
                });
        
         }; 
exports.find_StockInEntry = (req,res) => {

            pool.getConnection((err,connection) => {
                if(err) throw err; //not connected!
                console.log('Connected as ID' + " " + connection.threadId)
            
                let searchTerm = req.body.search;
            
                //User the connection
                connection.query('SELECT item_id, item_name,item.category_id,category_name,brand.brand_id,brand_name,description,quantity,final_price,price,stock,supp_id,emp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item,category,brand WHERE category.category_id = item.category_id AND brand.brand_id = item.brand_id AND (item_name LIKE ? OR brand_name LIKE ? OR category_name LIKE ?) Group by item_id  ', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
                    connection.query('SELECT stockin_trans_id,supplier, company_name, address FROM stockin_transaction, supplier WHERE stockin_trans_id = (SELECT stockin_trans_id FROM stockin_transaction ORDER BY stockin_trans_id DESC LIMIT 1) AND supplier = supp_id',(err,ref) => {

                    // When done with the connection, release it
                    connection.release();
            
                    if(!err){
                        res.render('PAGE-stock_entry', {rows,reference_num:ref});
                       // res.redirect('/StockInEntry');
                    } else{
                        console.log(err);
                    }
            
                    console.log('The data from user table: \n', rows);
                });
        
                });
            });
            }

         
    
exports.StockinEntryCart = (req,res) => { 
            //Connect to DB
            const{butt} = req.body;   
            pool.getConnection((err,connection) => {
                if(err) throw err; //not connected!
                console.log('Connected as ID' + " " + connection.threadId)
                //User the connection
                connection.query('SELECT * FROM stock_cart',(err,rows) => {
                    // When done with the connection, release it
                    if(!err){
                       
                    }
                    connection.query('ALTER IGNORE TABLE stock_cart ADD UNIQUE INDEX u(item_id)',(err,rows) => {
                        // When done with the connection, release it
                        if(!err){
        
                          
                        }
                        connection.query('SELECT stock_cart.item_id,item_name,item.brand_id,brand_name,category.category_id,category_name,description,quantity,price,stock_cart.stock,item.emp_id,new_stock FROM item,stock_cart,category,brand WHERE item.item_id = stock_cart.item_id AND item.category_id = category.category_id  AND item.brand_id = brand.brand_id',(err,rows) => {
                            // When done with the connection, release it

                            if(!err){
                              
        ///////////////////////////////NOT SURE BUT IT WORKS
                                    connection.query('SELECT * FROM item WHERE item_id = 1 ',[req.params.id],(err,rows3) => {
                                        connection.query('SELECT stockin_trans_id,supplier, company_name, address FROM stockin_transaction, supplier WHERE stockin_trans_id = (SELECT stockin_trans_id FROM stockin_transaction ORDER BY stockin_trans_id DESC LIMIT 1) AND supplier = supp_id',(err,ref) => {
                                            

                                        connection.release();
                                        if(!err){
                                            res.render('PAGE-stock_entry_cart', {rows,submit:rows3,reference_num:ref, alert: `Successfully updated`});
                                            console.log(ref);
        
                                    }
        
                                    else{
                                        console.log(err);
                                    }

                            
                            
                                          });
                                         
                                        });
                               
                            }  else{
        
                        console.log('error');
                        res.redirect('/StockinEntryCart');
                        
                    }
                   
                    console.log('HI The data from user table: \n', rows);
                    //console.log('Hello')
            
            
              
            });
        });
            });
          //console.log('The data from user table: \n', rowss);
            });
        
 
            
            
            };

exports.add_all_stock_entry = (req,res) => {
                const{supplier,stock,item_id,employee,idd} = req.body;                
                
                
            pool.getConnection((err,connection) => {
                if(err) throw err; //not connected!
                console.log('Connected as ID' + " " + connection.threadId)
                //User the connection
                console.log("EMP"+employee);
               
                connection.query('UPDATE stock_cart SET supplier_id = ?, ref_num = ?, emp_id = ? ',[supplier, employee, req.params.id],(err,rows) => {
                    // When done with the connection, release it
                    //connection.release();
                    connection.query('SELECT stockin_trans_id FROM stockin_transaction ORDER BY stockin_trans_id DESC LIMIT 1',(err,ref) => {
                   
                       
                     connection.query('INSERT INTO stock_entry(reff_num,item_id,new_stock_added) SELECT stockin_trans_id, stock_cart.item_id,(stock_cart.stock-item.stock) as new_stock FROM stockin_transaction,stock_cart,item WHERE stockin_trans_id = (SELECT stockin_trans_id FROM stockin_transaction ORDER BY stockin_trans_id DESC LIMIT 1) AND item.item_id = stock_cart.item_id ',[],(err,rows) => {

                        connection.query('UPDATE item i, stock_cart s SET i.stock = s.stock  WHERE i.item_id = s.item_id',[item_id, req.params.id],(err,rows) => {

                     connection.query('DELETE FROM stock_cart',[req.params.id],(err,rows) => {
          
                       

                    if(!err){
        
                        pool.getConnection((err,connection) => {
                            if(err) throw err; //not connected!
                            console.log('Connected as ID' + " " + connection.threadId)
                            //User the connection
                            connection.query('SELECT * FROM stock_cart ',[req.params.id],(err,rows) => {
                                    if(!err){
                                        res.render('PAGE-stock_entry_cart',{rows,alert2: `Successfully Added`,modal_message:'HI'});
                                        res.redirect('/StockInTransaction');

                                        
                                    }
                        
                                    else{
                                    console.log(err);
                                }
                        
                                console.log('The data from user table: \n', rows);          
                        
                          });
                       });
                        
        
                    } else{
                        console.log(err);
                    }
            
                    console.log('The data from user table: \n', rows);
          
                    console.log('idd \n', stock);
                });  
                });
                });
            });

            });
              });
                }
        

exports.get_stocks_cart = (req,res) => {
    

        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
            
                    //User the connection
            connection.query('INSERT INTO stock_cart(item_id,stock) SELECT item.item_id,stock FROM item WHERE item.item_id = ?',[ req.params.id],(err,rows) => {

                // When done with the connection, release it
                            //connection.release();
                if(!err){
                      
                    res.redirect('/StockinEntryCart');
                                
                         }
                 else{
                     console.log(err);
                                    res.redirect('/StockinEntryCart');
                                }
                         
               
                        
                        console.log('The data from user table2: \n', rows);
                        console.log(err);
                        
                    });
                    });
  
            
}; 


//Delete 
exports.delete_entry_stock = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)


        //User the connection
        connection.query('DELETE FROM stock_cart WHERE item_id = ?',[req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release()
    
            if(!err){
                res.redirect('/StockinEntryCart');
            } 
          
            else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
            //console.log('Hi');
            
    
        });
    });


    };
//Update stock per item
exports.get_addstock_entry = (req,res) => {
    
        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
            //User the connection
            connection.query('SELECT stock_cart.item_id,item.item_name,category.category_id,category.category_name,description,quantity,price,stock_cart.stock,item.emp_id FROM item,stock_cart,category WHERE item.category_id = category.category_id AND item.item_id = stock_cart.item_id AND stock_cart.item_id = ? ',[req.params.id],(err,rows) => {
                connection.query('SELECT stockin_trans_id,supplier, company_name, address FROM stockin_transaction, supplier WHERE stockin_trans_id = (SELECT stockin_trans_id FROM stockin_transaction ORDER BY stockin_trans_id DESC LIMIT 1) AND supplier = supp_id',(err,ref) => {

                // When done with the connection, release it
                connection.release();
        
                if(!err){
                    res.render('add-per-stock-entry', {rows,reference_num:ref});
                } else{
                    console.log(err);
                }
        
                console.log('The data from user table: \n', rows);
        
            });
            });
        });
    }


//Update stock per item
exports.create_stock_entry = (req,res) => {
        const{supplier,stock,item_id} = req.body;
        
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        console.log("SUPP"+item_id);
       
        connection.query('UPDATE stock_cart SET  new_stock = ? WHERE item_id = ?',[stock, req.params.id],(err,rows) => {
            // When done with the connection, release it
 
            //connection.release();
            
            connection.query('UPDATE stock_cart  SET stock = (SELECT (stock+new_stock) from stock_cart WHERE item_id = ?) WHERE item_id = ?',[  req.params.id, req.params.id],(err,rows) => {

            if(!err){

                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    connection.query('SELECT stock_cart.item_id,item.item_name,category_id,description,quantity,price,stock_cart.stock,item.emp_id FROM item,stock_cart WHERE item.item_id = stock_cart.item_id AND stock_cart.item_id = ?',[req.params.id],(err,rows) => {
                        connection.query('SELECT stockin_trans_id,supplier, company_name, address FROM stockin_transaction, supplier WHERE stockin_trans_id = (SELECT stockin_trans_id FROM stockin_transaction ORDER BY stockin_trans_id DESC LIMIT 1) AND supplier = supp_id',(err,ref) => {
                            connection.release();
                            
                        if(!err){
                            
                             res.render('add-per-stock-entry',{rows,reference_num:ref,alert2: `Successfully Added`});
                

                              
                                
                            }
  
                            else{
                            console.log(err);
                        }
                
                        console.log('The data from user table: \n', rows);          
                    });
             
            });
                });
     
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
        });

        });
    
    
    });
        }





//Add new customer by search
/*exports.post_add_multiple_stock = (req,res) => {
    const{stock} = req.body;
    console.log('HI'); 
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('UPDATE stock_cart SET stock = ? WHERE item_id = ? ',[stock, req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){

                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM stock_cart WHERE item_id = ?',[req.params.id],(err,rows) => {
                        // When done with the connection, release it
                        connection.release();
                
                        if(!err){
                            res.render('stockin', {rows});
                        } else{
                            console.log(err);
                        }
                
                        console.log('The data from user table: \n', rows);          
                
                    });
                });

            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });

}*/


 /*   exports.form = (req,res) => {
     
        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
            //User the connection
            connection.query('SELECT emp_firstname from employee WHERE employee.position = "Admin" AND employee.status = "active" ',[req.params.id],(err,rows1) => {
                // When done with the connection, release it
                connection.release();
    
                if(!err){
                } 
                connection.query('SELECT company_name FROM supplier WHERE status = "active" ',[req.params.id],(err,rows2) => {
                if(!err){
                    res.render('add-item',{admin_list:rows1,supplier_list:rows2});
                }   
                else{
                    console.log(err);
                }
        
                console.log('The data from user table: \n', rows1);
                console.log('The data from user table: \n', rows2);
        
        
                      });
                });
       
           
        });
    
    }*/

//////STOCK HISTORY/////


//Find stock by search
exports.findstock_history = (req,res) => {

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let searchTerm = req.body.search;
    
        //User the connection
        connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id AND (item_name LIKE ? OR reff_num LIKE ? OR (CONCAT("ID",SE.item_id)) LIKE ?) ORDER BY ST.date_added ', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('StockinHistorypage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    

        });
    });
    }

//View Stock Button
exports.viewstock = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT stock_in.item_id,reference_num, item_name,item.category_id,category_name,description,quantity,price,final_price,stock_in.new_stock,stock_in.supplier_id,stock_in.emp_id, DATE_FORMAT(stock_in.date,"%m-%d-%Y") as datein, employee.emp_firstname,supplier.company_name,item.brand_id,brand_name FROM item,employee,supplier,stock_in,brand,category WHERE item.item_id = ? AND supplier.supp_id=stock_in.supplier_id AND stock_in.emp_id = employee.emp_id AND stock_in.item_id = item.item_id AND brand.brand_id = item.brand_id AND category.category_id = item.category_id', [req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('view-stock', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };

//Edit Stock
exports.editstock = (req,res) => {
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM item WHERE item_id = ?',[req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                
                res.render('edit-stock', {rows});
                
              
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    
}

//Stock In Page
exports.StockinHistoryPage = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection

    
        connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id ORDER BY ST.date_added',[],(err,rows) => {

            
            // When done with the connection, release it
    
            if(!err){
                res.render('StockinHistorypage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);


        });
    });  

    };


//Sort items
/*
exports.sortStockinHistoryPage_itemid = (req,res) => {
    
    
    pool.getConnection((err,connection) => {

        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)

        //User the connection
        connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id ORDER BY SE.item_id', [],(err,rows) => {

            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('StockinHistoryPage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
        
      
        });    
    });
   

}
exports.sortStockinHistoryPage_itemname = (req,res) => {
    
    pool.getConnection((err,connection) => {

        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)

 
        //User the connection
        connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id ORDER BY item_name', [],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('StockinHistoryPage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
           
        });
    });
}

exports.sortStockinHistoryPage_category = (req,res) => {
    
    pool.getConnection((err,connection) => {

        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)

        let orderby_itemname = req.body.itemname;

        //User the connection
        connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id ORDER BY category_name', [],(err,rows) => {
           // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('StockinHistoryPage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
            
        });
    });
}
exports.sortStockinHistoryPage_supplier = (req,res) => {
    
    pool.getConnection((err,connection) => {

        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)

        let orderby_itemname = req.body.itemname;

        //User the connection
        connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id ORDER BY company_name', [],(err,rows) => {
                // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('StockinHistoryPage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
            
        });
    });
}
exports.sortStockinHistoryPage_date = (req,res) => {
    
    pool.getConnection((err,connection) => {

        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)

        let orderby_itemname = req.body.itemname;

        connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id Order by ST.date_added ORDER BY SE.item_id ',[], (err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('StockinHistoryPage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
       
            
        });
    });
}
*/
exports.FindDate = (req,res) => {

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let From_searchTerm = req.body.From_SortDate;
        let To_searchTerm = req.body.To_SortDate;
    
        //User the connection
        connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id AND  CAST(ST.date_added AS DATE) between ? and ? ORDER BY ST.date_added ', [From_searchTerm,To_searchTerm],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('StockinHistorypage', {rows});
            } else{
                console.log(err);
            }
    
            //console.log('The data from user table: \n', rows);
            console.log("YES"+From_searchTerm);
            console.log("YES"+To_searchTerm);

        });
    });
    }
   

//INVENTORY

//View Items in Inventory
exports.PInv = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT *, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item as i,category as c,brand as b WHERE c.category_id = i.category_id AND b.brand_id = i.brand_id  GROUP BY i.item_id  ',(err,rows) => {

            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('productInv', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
 
        });
    });
    };
//View Item Inventory Button
exports.viewiteminv = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT item_id, item_name,i.category_id,i.brand_id,category_name,brand_name,i.description,quantity,price,final_price,stock,i.supp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein,emp_firstname FROM item AS i,category,brand,employee as e WHERE category.category_id = i.category_id AND brand.brand_id = i.brand_id AND e.emp_id = i.emp_id AND item_id = ?', [req.params.id],(err,rows) => {

            // When done with the connection, release it
            //SELECT item.item_id,item.item_name,item.category,item.description,item.quantity,item.price,item.stock,item.datein,item.markup,item.supplier,employee.emp_firstname FROM item,employee WHERE employee.emp_id = item.emp_id AND item.item_id = ?
            connection.release();
            
            if(!err){
                res.render('view-item-inv', {rows});
               
            }
           
             else{
                console.log(err);
            }
        
            console.log('The data from user table: \n', rows);

    
        });
        });
    
    };
//Find item by search
exports.findProdInv = (req,res) => {

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let searchTerm = req.body.search;
    
        //User the connection
        connection.query('SELECT item_id, item_name,item.category_id,item.brand_id,category_name,brand_name,item.description,quantity,price,final_price,stock,supp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item,category,brand WHERE category.category_id = item.category_id AND brand.brand_id = item.brand_id AND (item_name LIKE ? OR category_name LIKE ?) ', ['%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('productInv', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    }

//////EMPLOYEE//////////////////////////////////

 //View Items in Employee
exports.EmployeePage = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM employee',(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('employee', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };

//Find Employee by search
exports.FindEmployee = (req,res) => {

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let searchTerm = req.body.search;
    
        //User the connection
        connection.query('SELECT * FROM employee WHERE emp_firstname LIKE ? OR emp_lastname LIKE ? OR position LIKE ? OR status LIKE ? ', ['%' + searchTerm + '%','%' + searchTerm + '%' ,'%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('employee', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    }

//View Employee page
exports.ViewEmployee = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM employee WHERE emp_id = ?', [req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('view-employee', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };

    
//Edit Employee
exports.EditEmployee = (req,res) => {
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM employee WHERE emp_id = ?',[req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                
                res.render('edit-employee', {rows});
                
              
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    
}

//Update Employee
exports.UpdateEmployee = (req,res) => {

    const{emp_firstname,employeeSuffix,emp_lastname,phone,address,position,email,username,password,status,date} = req.body;
   
   
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('UPDATE employee SET emp_firstname = ?,employeeSuffix = ?, emp_lastname = ?, phone = ?, address = ?, position = ?, email = ?, username = ?, password = ?, status = ?, date = ? WHERE emp_id = ? ',[emp_firstname,employeeSuffix,emp_lastname,phone,address,position,email,username,password,status,date, req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
      
            if(!err){

                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM employee WHERE emp_id = ?',[req.params.id],(err,rows) => {
                        // When done with the connection, release it
                        connection.release();
                
                        if(!err){
                            res.render('edit-employee', {rows, alert: `Successfully updated`});
                        } else{
                            console.log(err);
                        }
                
                        console.log('The data from user table: \n', rows);          
                
                    });
                });

            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}

//Add new Employee 
exports.get_employee = (req,res) => {
    res.render('add-employee');
}


exports.create_employee = (req,res) => {
  const{emp_firstname,employeeSuffix, emp_lastname, phone, address,position,email,username,password,date} = req.body;

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let searchTerm = req.body.search;
    
        //User the connection
        connection.query('INSERT INTO employee SET emp_firstname = ?,employeeSuffix = ?, emp_lastname = ? , phone = ?, address = ?, position = ?, email = ?, username = ?, password = ?', [emp_firstname,employeeSuffix,emp_lastname,phone,address,position,email,username,password],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('add-employee',{rows, alert: `Successfully Added`});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    

}
//////SUPPLIER////////////////////////////////

 //View Items in Supplier
 exports.SupplierPage = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT supp_id, company_name, contact_person, phone, address, remarks, status, emp_id, DATE_FORMAT(date,"%m-%d-%Y") as date FROM supplier',(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('supplier-page', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };

//Find Supplier by search
exports.FindSupplier = (req,res) => {

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let searchTerm = req.body.search;
    
        //User the connection
        connection.query('SELECT supp_id, company_name, contact_person, phone, address, remarks, status, emp_id, DATE_FORMAT(date,"%m-%d-%Y") as date FROM supplier WHERE supp_id LIKE ? OR company_name LIKE ? OR address LIKE ? OR status LIKE ? ', ['%' + searchTerm + '%','%' + searchTerm + '%' ,'%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('supplier-page', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    }

//View Supplier page
exports.ViewSupplier = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT supp_id, company_name, contact_person, phone, address, remarks, status, emp_id, DATE_FORMAT(date,"%m-%d-%Y") as date FROM supplier WHERE supp_id = ?', [req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('view-supplier', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    };

    
//Edit Supplier
exports.EditSupplier = (req,res) => {
    
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT * FROM supplier WHERE supp_id = ?',[req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                
                res.render('edit-supplier', {rows});
                
              
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    
}

//Update Supplier
exports.UpdateSupplier = (req,res) => {

    const{company_name, contact_person, phone, address,remarks,status,date} = req.body;
   
   
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('UPDATE supplier SET company_name = ?, contact_person = ? , phone = ?, address = ?, remarks = ?, status = ?, date = ? WHERE supp_id = ?',[company_name,contact_person,phone,address,remarks,status,date, req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release();
      
            if(!err){

                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM supplier WHERE supp_id = ?',[req.params.id],(err,rows) => {
                        // When done with the connection, release it
                        connection.release();
                
                        if(!err){
                            res.render('edit-supplier', {rows, alert: `Successfully updated`});
                        } else{
                            console.log(err);
                        }
                
                        console.log('The data from user table: \n', rows);          
                
                    });
                });

            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
}

//Add new Supplier 
exports.get_Supplier = (req,res) => {
    res.render('add-supplier');
}


exports.create_Supplier = (req,res) => {
  const{company_name, contact_person, phone, address,remarks,date} = req.body;

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let searchTerm = req.body.search;
    
        //User the connection
        connection.query('INSERT INTO supplier SET company_name = ?, contact_person = ? , phone = ?, address = ?, remarks = ?, date = ?', [company_name,contact_person,phone,address,remarks,date],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('add-supplier',{rows, alert: `Successfully Added`});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    
    
        });
    });
    

}

//Stock Return Page

exports.StockReturnPage = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT *, DATE_FORMAT(st.date_added,"%m/%d/%Y") as formatted_date FROM item as i,stock_entry as se, category as c, employee as e, stockin_transaction as st WHERE se.item_id = i.item_id AND c.category_id = i.category_id AND e.emp_id = st.encoded_by AND st.stockin_trans_id = se.reff_num AND reff_num = ? AND se.item_id = ?',[req.params.reff,req.params.id],(err,rows) => {
            connection.query('SELECT * FROM employee WHERE position = "Admin" ',(err,admin) => {

            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('StockReturnPage', {rows,admin_list:admin});
            } else{
                console.log(err);
            }
    
        });
        });
    });


    };
exports.StockReturnPage_post = (req,res) => {
        //Connect to DB
        const {emp_id, reason, qty_cancelled} = req.body;
        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
    
                connection.query('INSERT INTO cancel_stock_trans SET cancelled_by = ?, reason = ?, qty_cancelled = ? ', [emp_id, reason,qty_cancelled],(err,rows) => {
    
                    // When done with the connection, release it
        
                if(!err){
                    res.render('StockReturnPage', {rows});
                    res.redirect('/StockReturnPage/list');
                    
                } else{
                    console.log(err);
                }
        
            });
            });  
     };
exports.StockReturnPage_list = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection

    
        connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id AND i.stock != 0 ORDER BY ST.date_added',[],(err,rows) => {

            
            // When done with the connection, release it
    
            if(!err){
                res.render('StockReturnPageList', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);


        });
    });  

    };

    exports.findstockreturn_history = (req,res) => {

        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
        
            let searchTerm = req.body.search;
        
            //User the connection
            connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id AND (item_name LIKE ? OR reff_num LIKE ? OR SE.item_id LIKE ?) ORDER BY ST.date_added ', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
                // When done with the connection, release it
                connection.release();
        
                if(!err){
                    res.render('StockReturnPageList', {rows});
                } else{
                    console.log(err);
                }
        
                console.log('The data from user table: \n', rows);
        
    
            });
        });
        }
    
    exports.get_each_return = (req,res) => {
            //Connect to DB
            const { reff_num,item_id} = req.body;
            pool.getConnection((err,connection) => {
                if(err) throw err; //not connected!
                console.log('Connected as ID' + " " + connection.threadId)
                //User the connection
                connection.query('SELECT *, DATE_FORMAT(st.date_added,"%m/%d/%Y") as formatted_date FROM item as i,stock_entry as se, category as c, employee as e, stockin_transaction as st, supplier as s WHERE s.supp_id = st.supplier AND se.item_id = i.item_id AND c.category_id = i.category_id AND e.emp_id = st.encoded_by AND st.stockin_trans_id = se.reff_num AND reff_num = ? AND se.item_id = ?',[req.params.reff,req.params.id],(err,rows) => {
                    connection.query('SELECT * FROM employee WHERE position = "Admin" ',(err,admin) => {
                        connection.query('SELECT * FROM cancel_stock_trans as cst,employee as e WHERE e.emp_id = cst.cancelled_by ORDER BY cancel_stock_id DESC LIMIT 1',(err,quan) => {

                    // When done with the connection, release it
                    connection.release();
            
                    if(!err){
                        res.render('edit-return', {rows,admin_list:admin,quantity:quan});
                    } else{
                        console.log(err);
                    }
                    console.log('WHAT' +  req.params.reff + req.params.id)
                });
                });
            });
        });
         };
        //Add new item 
        exports.post_each_return = (req,res) => {
            const {qty_cancelled} = req.body;
            var type,fprice;
              pool.getConnection((err,connection) => {
                  if(err) throw err; //not connected!
                  console.log('Connected as ID' + " " + connection.threadId)
              
                  let searchTerm = req.body.search;
                  
          
                //   if (req.body.flexRadioDefault == "Small Items") {
                //       type = "Small Items";
                //       fprice = price * (1.08/0.76);
                //   } else {
                //       type = "Big Items";
                //       fprice = price * (1.08/0.86);
                //    }
          
                  //User the connection

                    connection.query('UPDATE cancel_stock_trans SET reff_id = ?, item_id = ?, supp_id = (SELECT supplier FROM stockin_transaction WHERE stockin_trans_id = ?) ORDER BY cancel_stock_id DESC LIMIT 1',[req.params.reff,req.params.id,req.params.reff],(err,rows) => {         
                        connection.query('UPDATE stock_entry SET return_stock = "Yes" WHERE reff_num = ? AND item_id = ? ORDER BY cancel_stock_id DESC LIMIT 1',[req.params.reff,req.params.id],(err,rows) => {         
                            connection.query('UPDATE item i, stock_entry se,stockin_transaction st, cancel_stock_trans as cst SET i.stock = (i.stock-cst.qty_cancelled) WHERE i.item_id = cst.item_id AND cst.reff_id = st.stockin_trans_id AND cst.reff_id = ? AND cst.item_id = ? ORDER BY cancel_stock_id DESC LIMIT 1',[req.params.reff,req.params.id],(err,rows) => {         

                      res.render('edit-return',{alert: 'Item added successfully.'});
                      res.redirect('/StockReturnPage');
                    }); 
                    });
                    console.log('WHAT' +  req.params.reff + req.params.id)
                });
            });   
          }
        
     exports.FindDate_returnpage = (req,res) => {

            pool.getConnection((err,connection) => {
                if(err) throw err; //not connected!
                console.log('Connected as ID' + " " + connection.threadId)
            
                let From_searchTerm = req.body.From_SortDate;
                let To_searchTerm = req.body.To_SortDate;
            
                //User the connection
                connection.query('SELECT SE.item_id,reff_num, item_name,brand_name,category_name,company_name,price,final_price,new_stock_added,emp_firstname,DATE_FORMAT(ST.date_added,"%m/%d/%Y") as datein, TIME_FORMAT(ST.date_added, "%I:%i:%s %p") as timein FROM stockin_transaction AS ST, stock_entry AS SE, item AS I,supplier AS S, brand AS B, category AS C, employee AS E WHERE stockin_trans_id = reff_num AND SE.item_id = I.item_id AND ST.supplier = S.supp_id AND I.brand_id = B.brand_id AND I.category_id = C.Category_id AND ST.encoded_by = E.emp_id AND  CAST(ST.date_added AS DATE) between ? and ? ORDER BY ST.date_added ', [From_searchTerm,To_searchTerm],(err,rows) => {
                    // When done with the connection, release it
                    connection.release();
            
                    if(!err){
                        res.render('StockReturnPageList', {rows});
                    } else{
                        console.log(err);
                    }
            
                    //console.log('The data from user table: \n', rows);
                    console.log("YES"+From_searchTerm);
                    console.log("YES"+To_searchTerm);
        
                });
            });
            }

 exports.StockReturnHistoryPage = (req,res) => {

                //Connect to DB
       pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
            connection.query('SELECT *, DATE_FORMAT(date_cancelled,"%m/%d/%Y") as formatted_date FROM item as i, category as c, employee as e, cancel_stock_trans as cst, brand as b, supplier as supp WHERE cst.item_id = i.item_id AND c.category_id = i.category_id AND e.emp_id = cst.cancelled_by AND b.brand_id = i.brand_id AND supp.supp_id = i.supp_id',(err,rows) => {
               // When done with the connection, release it
             connection.release();
                
         if(!err){
               res.render('StockReturnHistoryPage', {rows});
          } else{
                 console.log(err);
        }
                
        
          });
        });
            
            
  };

/*//Router
router.get('', (req,res) => {
    res.render('home');
});*/
