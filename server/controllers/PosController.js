const { escapeExpression } = require('handlebars');
const mysql = require('mysql');
const router = require('../routes/PosSystem');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});
const puppeteer = require("puppeteer");
 
const fs = require("fs-extra");
   
var path = require('path');
var hbs = require('hbs');


const compile = async function (templateName, rows) {
    const filePath = path.join(process.cwd(), 'views', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf8');
    console.log(html)
    return hbs.compile(html)(rows);
};

exports.dl = (req,res) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed).toDateString();

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
                  //User the connection
             connection.query('SELECT * FROM order_cart as oc, item as i WHERE oc.item_id = i.item_id ',[req.params.id],(err,rows) => {
                connection.query('SELECT order_trans_id FROM order_transaction ORDER BY order_trans_id DESC LIMIT 1 ',[req.params.id],(err,transID) => {
                            connection.query('SELECT cast(SUM(total) as decimal(10, 2)) as total FROM order_cart ',(err,total) => {           
                                 connection.query('SELECT cast((SUM(total)*1.12)*0.1 as decimal(10, 2)) as VAT FROM order_cart',(err,VAT) => {   
                                    connection.query('SELECT cast((SUM(total)*1.12)-((SUM(total)*1.12)*0.1) as decimal(10, 2)) as total_amount FROM order_cart',(err,total_amount) => {
                                        connection.query('SELECT cast((SUM(total)*1.12) as decimal(10, 2)) as total_sales FROM order_cart',(err,total_sales) => {   
   
                                        connection.query('SELECT * FROM order_transaction,employee WHERE encoded_by = emp_id ORDER BY order_trans_id DESC LIMIT 1',(err,encodedby) => {   
                                            connection.query('SELECT order_trans_id,amount_received, amount_change,encoded_by, emp_firstname, emp_lastname FROM order_transaction, employee WHERE order_trans_id = (SELECT order_trans_id FROM order_transaction ORDER BY order_trans_id DESC LIMIT 1) AND encoded_by = emp_id',(err,trans) => {          
       
                      // When done with the connection, release it
                  connection.release();
                  if(!err){
                    res.render('receipt', {rows,transID,total,VAT,total_amount,today,encodedby,trans,total_sales,true: {login: true }});
                    (async function () {
 
                        try {
                     
                            const browser = await puppeteer.launch();
                     
                            const page = await browser.newPage();
                     
                            const content = await compile('receipt', {rows,transID,total,VAT,total_amount,today,trans,total_sales});
        
                            console.log(content)
                     
                            await page.setContent(content);
                     
                            await page.pdf({
                                path: "./Records/Receipt/'Transaction#"+req.params.id+"_"+today+"'.pdf",
                                format: 'A4',
                                printBackground: true
                            })
                     
                            console.log("done creating pdf");
                     
                        } catch (e) {
                            console.log(e);
                        }
                    })();
                   
                    
                        }
          
                      else{
                        console.log(err);
                          }                        
                               
              console.log('The data from user table: \n', rows);
              console.log("DATE"+ today);


              
             
              //console.log('Hello')
     
      //console.log('The data from user table: \n', rowss);
    });
});
});
});
});
});     
});
}); 
}); 
    }

exports.add_all_order_entry = (req,res) => {
        const{supplier,stock,item_id,employee,received} = req.body;                
        
        
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        console.log("EMP"+employee);
       
        //connection.query('UPDATE order_cart SET supplier_id = ?, ref_num = ?, emp_id = ? ',[supplier, employee, req.params.id],(err,rows) => {
            // When done with the connection, release it
            //connection.release();
            connection.query('SELECT order_trans_id FROM order_transaction ORDER BY order_trans_id DESC LIMIT 1',(err,ref) => {
           
               
             connection.query('INSERT INTO order_entry(order_trans_id,item_id,new_stock_added) SELECT order_trans_id, order_cart.item_id,(order_cart.new_stock_added) as new_stock FROM order_transaction,order_cart,item WHERE order_trans_id = (SELECT order_trans_id FROM order_transaction ORDER BY order_trans_id DESC LIMIT 1) AND item.item_id = order_cart.item_id ',[],(err,rows) => {
    
                connection.query('UPDATE item i, order_cart o SET i.stock = (o.old_stock-o.new_stock_added)  WHERE i.item_id = o.item_id',[item_id, req.params.id],(err,rows) => {
                
    
             connection.query('DELETE FROM order_cart',[req.params.id],(err,rows) => {
    
            
            if(!err){
    
                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM order_cart ',[req.params.id],(err,rows) => {
                            if(!err){
                                res.render('receipt',{rows,alert2: `Successfully Added`,modal_message:'HI'});
                                res.redirect('/OrderTransaction');
    
                                
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
    };    

//View Items POS
exports.OrderTransactionPage = (req,res) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed).toDateString();

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        connection.query('SELECT emp_firstname, emp_id from employee WHERE employee.position = "Admin" AND employee.status = "active" ',[req.params.id],(err,emp) => {
            // When done with the connection, release it
            connection.query('SELECT category_name, category_id FROM category',[req.params.id],(err,cat) => {
                connection.query('SELECT brand_name, brand_id FROM brand ',[req.params.id],(err,brand) => {
                    connection.query('SELECT company_name, supp_id FROM supplier WHERE status = "active" ',[req.params.id],(err,supp) => {
                        connection.query('SELECT company_name, supp_id FROM supplier WHERE status = "active" ',[req.params.id],(err,supp) => {

            connection.release();

            if(!err){
                res.render('PAGE-POS-Trans',{admin_list:emp,supplier_list:supp,cat_list:cat,brand_list:brand,date:today});

            } 

            else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', emp);
            //console.log('The data from user table: \n', rows2);
    
    
                  });
            });
        });
    });
       
    });

});
    };

exports.OrderTransactionPage_post = (req,res) => {
        const {encoded_by} = req.body;
      
          pool.getConnection((err,connection) => {
              if(err) throw err; //not connected!
              console.log('Connected as ID' + " " + connection.threadId)
          
              let searchTerm = req.body.search;
              
              //User the connection
              connection.query('INSERT INTO order_transaction SET encoded_by = ?', [encoded_by],(err,rows) => {
      
                  // When done with the connection, release it
                  connection.release()
          
                  if(!err){
                      res.render('PAGE-POS-Trans',{alert: 'Stock added successfully.'});
                      res.redirect('/POSPage');
                  } else{
                      console.log(err);
                  }
          
                  console.log('The data from user table: \n', rows);
                  console.log(encoded_by);
          
          
              });
          });
          
      
      }

/*exports.POSPage = (req,res) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed).toDateString();
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
    
                res.render('PAGE-POS', {rows,reference_num:ref,date:today});
               
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
*/
exports.get_order_entry = (req,res) => {
        //Connect to DB
       
        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
            //User the connection
            connection.query('SELECT *, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item as i,category as c,brand as b,stock_entry as se WHERE c.category_id = i.category_id AND b.brand_id = i.brand_id AND i.item_id = se.item_id AND stock>0  GROUP BY i.item_id',(err,rows) => {
                connection.query('SELECT order_trans_id,encoded_by, emp_firstname, emp_lastname FROM order_transaction, employee WHERE order_trans_id = (SELECT order_trans_id FROM order_transaction ORDER BY order_trans_id DESC LIMIT 1) AND encoded_by = emp_id',(err,trans) => {

                // When done with the connection, release it
                connection.release();
            
    
                if(!err){
    
                res.render('PAGE-order-entry', {rows,transaction_num:trans});
               
                    }
                    else{
                    console.log(err);
                }
            
                //console.log('The data from user table: \n', rows);
        
            });
            });
        });
    
 };


 exports.add_each_item = (req,res) => {
    let add = req.body.add;
    console.log("ADD"+add);
    //Connect to DB
    pool.getConnection((err,connection) => {
    if(err) throw err; //not connected!
    console.log('Connected as ID' + " " + connection.threadId)
    
    
    //User the connection
    //connection.query('UPDATE order_cart SET new_stock_added = new_stock_added-1 WHERE item_id = ?',[req.params.id],(err,rows) => {
    // When done with the connection, release it
    connection.release()
    
    if(!err){
        res.render('PAGE-order-entry');
        res.redirect('/OrderEntry');
    } 
    
    else{
        console.log(err);
    }
    
    //console.log('The data from user table: \n', rows);
    //console.log('Hi');
    
    
    });
   // });
    
    
    };

 exports.add_multiple_item = (req,res) => {
    const {new_stock_added} = req.body;
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        
                //User the connection
        connection.query("INSERT INTO order_cart(item_id,old_stock,new_stock_added,total) SELECT item.item_id,stock,quantity,final_price FROM item WHERE item.item_id = ?",[ req.params.id],(err,rows) => {

                    // When done with the connection, release it
                        //connection.release();
            if(!err){
                res.redirect('/OrderEntry');
                            
                     }
             else{
                 console.log(err);
                                res.redirect('/OrderEntry');
                            }
                     
           
                    
                    console.log('The data from user table2: \n', rows);
                    console.log(err);
                    
            
                });
            });
 
         }; 


exports.find_item = (req,res) => {

            pool.getConnection((err,connection) => {
                if(err) throw err; //not connected!
                console.log('Connected as ID' + " " + connection.threadId)
            
                let searchTerm = req.body.search;
            
                //User the connection
                connection.query('SELECT item_id, item_name,item.category_id,category_name,brand.brand_id,brand_name,description,quantity,final_price,price,stock,supp_id,emp_id, DATE_FORMAT(datein,"%m-%d-%Y") as datein FROM item,category,brand WHERE category.category_id = item.category_id AND brand.brand_id = item.brand_id AND (item_name LIKE ? OR brand_name LIKE ? OR category_name LIKE ?) Group by item_id  ', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
                    connection.query('SELECT stockin_trans_id,supplier, company_name, address FROM stockin_transaction, supplier WHERE stockin_trans_id = (SELECT stockin_trans_id FROM stockin_transaction ORDER BY order_trans_id DESC LIMIT 1) AND supplier = supp_id',(err,ref) => {

                    // When done with the connection, release it
                    connection.release();
            
                    if(!err){
                        res.render('PAGE-order-entry', {rows,reference_num:ref});
                       // res.redirect('/StockInEntry');
                    } else{
                        console.log(err);
                    }
            
                    console.log('The data from user table: \n', rows);
                });
        
                });
            });
            }
       
exports.POSPage = (req,res) => { 
    //Connect to DB
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed).toDateString();
    const{butt} = req.body;   
    pool.getConnection((err,connection) => {
          if(err) throw err; //not connected!
              console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
               connection.query('SELECT * FROM order_cart',(err,rows) => {
                        // When done with the connection, release it
                     if(!err){
                           
                  }
                 connection.query('ALTER IGNORE TABLE order_cart ADD UNIQUE INDEX u(item_id)',(err,rows) => {
                            // When done with the connection, release it
                    if(!err){
            
                              
                     }
                 connection.query('SELECT order_cart.item_id,item_name,item.brand_id,brand_name,category.category_id,category_name,description,quantity,price,final_price,total,order_cart.old_stock,item.emp_id,new_stock_added FROM item,order_cart,category,brand WHERE item.item_id = order_cart.item_id AND item.category_id = category.category_id  AND item.brand_id = brand.brand_id',(err,rows) => {
                                // When done with the connection, release it
    
                  if(!err){
                                  
                 connection.query('SELECT order_trans_id,emp_firstname FROM order_transaction, employee WHERE order_trans_id = (SELECT order_trans_id FROM order_transaction ORDER BY order_trans_id DESC LIMIT 1) AND encoded_by = emp_id',(err,ref) => {
                        connection.query('SELECT order_trans_id,amount_received, amount_change,encoded_by, emp_firstname, emp_lastname FROM order_transaction, employee WHERE order_trans_id = (SELECT order_trans_id FROM order_transaction ORDER BY order_trans_id DESC LIMIT 1) AND encoded_by = emp_id',(err,trans) => {           
                            connection.query('SELECT cast(SUM(total) as decimal(10, 2)) as total FROM order_cart ',(err,total) => {           
                                connection.query('SELECT cast((SUM(total)*1.12)*0.1 as decimal(10, 2)) as VAT FROM order_cart',(err,VAT) => {  
                                    connection.query('SELECT cast((SUM(total)*1.12)-((SUM(total)*1.12)*0.1) as decimal(10, 2)) as total_amount FROM order_cart',(err,total_amount) => {  
 
         

                    connection.release();
                    if(!err){
                         res.render('PAGE-POS', {rows,transaction_num:trans, alert: `Successfully updated`,date:today,total:total,VAT:VAT,total_amount});
                        console.log(ref);
            
                         }
            
                        else{
                          console.log(err);
                            }                        
                                
                             });
                                     
                            });
                        });  
                    });     
                });   
            
                     }  else{
            
                        console.log('error');
                        res.redirect('/OrderEntryCart');
                            
                    }
                    
                console.log('HI The data from user table: \n', rows);
                //console.log('Hello')
                
        
    
             });
            });
         });
        //console.log('The data from user table: \n', rowss);
      });
            
      
                
     
  };

// exports.add_all_order_entry = (req,res) => {
//     const{supplier,stock,item_id,employee,received} = req.body;                
    
    
// pool.getConnection((err,connection) => {
//     if(err) throw err; //not connected!
//     console.log('Connected as ID' + " " + connection.threadId)
//     //User the connection
//     console.log("EMP"+employee);
   
//     //connection.query('UPDATE order_cart SET supplier_id = ?, ref_num = ?, emp_id = ? ',[supplier, employee, req.params.id],(err,rows) => {
//         // When done with the connection, release it
//         //connection.release();
//         connection.query('SELECT order_trans_id FROM order_transaction ORDER BY order_trans_id DESC LIMIT 1',(err,ref) => {
       
           
//          connection.query('INSERT INTO order_entry(order_trans_id,item_id,new_stock_added) SELECT order_trans_id, order_cart.item_id,(order_cart.new_stock_added) as new_stock FROM order_transaction,order_cart,item WHERE order_trans_id = (SELECT order_trans_id FROM order_transaction ORDER BY order_trans_id DESC LIMIT 1) AND item.item_id = order_cart.item_id ',[],(err,rows) => {

//             connection.query('UPDATE item i, order_cart o SET i.stock = (o.old_stock-o.new_stock_added)  WHERE i.item_id = o.item_id',[item_id, req.params.id],(err,rows) => {
            

//          connection.query('DELETE FROM order_cart',[req.params.id],(err,rows) => {

        
//         if(!err){

//             pool.getConnection((err,connection) => {
//                 if(err) throw err; //not connected!
//                 console.log('Connected as ID' + " " + connection.threadId)
//                 //User the connection
//                 connection.query('SELECT * FROM order_cart ',[req.params.id],(err,rows) => {
//                         if(!err){
//                             res.render('PAGE-POS',{rows,alert2: `Successfully Added`,modal_message:'HI'});
//                             res.redirect('/OrderTransaction');

                            
//                         }
            
//                         else{
//                         console.log(err);
//                     }
            
//                     console.log('The data from user table: \n', rows);          
            
//               });
//            });
            

//         } else{
//             console.log(err);
//         }

//         console.log('The data from user table: \n', rows);

//         console.log('idd \n', stock);
        
        
//     });
//     });
// });
// });
// });


//});



    //}

exports.amn_received = (req,res) => {
        const{supplier,stock,item_id,employee,received} = req.body;                
        
        
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection
        console.log("EMP"+employee);
       
        //connection.query('UPDATE order_cart SET supplier_id = ?, ref_num = ?, emp_id = ? ',[supplier, employee, req.params.id],(err,rows) => {
            // When done with the connection, release it
            //connection.release();           
            connection.query('UPDATE order_transaction SET total = (SELECT SUM(total) as total FROM order_cart ORDER BY order_trans_id DESC LIMIT 1)  ORDER BY order_trans_id DESC LIMIT 1',[req.params.id],(err,rows) => { 
                connection.query('UPDATE order_transaction SET amount_due = (SELECT cast((SUM(total)*1.12)-((SUM(total)*1.12)*0.1) as decimal(10, 2)) as total_amount FROM order_cart ORDER BY order_trans_id DESC LIMIT 1)  ORDER BY order_trans_id DESC LIMIT 1',[req.params.id],(err,rows) => {         

                connection.query('UPDATE order_transaction SET less_withholding_tax = (SELECT (SUM(total)*1.12)*0.1 as VAT FROM order_cart) ORDER BY order_trans_id DESC LIMIT 1',[req.params.id],(err,rows) => {         
            connection.query('UPDATE order_transaction SET amount_received = ? ORDER BY order_trans_id DESC LIMIT 1',[received,req.params.id],(err,rows) => {         
                connection.query('UPDATE order_transaction SET amount_change = (amount_received-amount_due) ORDER BY order_trans_id DESC LIMIT 1',[req.params.id],(err,rows) => {         
            if(!err){
    
                pool.getConnection((err,connection) => {
                    if(err) throw err; //not connected!
                    console.log('Connected as ID' + " " + connection.threadId)
                    //User the connection
                    connection.query('SELECT * FROM order_transaction ',[req.params.id],(err,rows) => {
                            if(!err){
                                res.render('PAGE-POS',{rows,alert2: `Successfully Added`,modal_message:'HI'});
                                res.redirect('/POSPage');
    
                                
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

//Delete 
exports.delete_all_order_entry = (req,res) => {

//Connect to DB
pool.getConnection((err,connection) => {
if(err) throw err; //not connected!
console.log('Connected as ID' + " " + connection.threadId)


//User the connection
connection.query('DELETE FROM order_cart WHERE item_id = ?',[req.params.id],(err,rows) => {
// When done with the connection, release it
connection.release()

if(!err){
    res.redirect('/POSPage');
} 

else{
    console.log(err);
}

console.log('The data from user table: \n', rows);
//console.log('Hi');


});
});


};
exports.add_order_entry = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
    if(err) throw err; //not connected!
    console.log('Connected as ID' + " " + connection.threadId)
    
    
    //User the connection
    connection.query('UPDATE order_cart,item SET new_stock_added = (new_stock_added+1),total = item.final_price*order_cart.new_stock_added WHERE item.item_id = order_cart.item_id AND new_stock_added<old_stock AND order_cart.item_id = ?',[req.params.id],(err,rows) => {

    // When done with the connection, release it
    connection.release()
    
    if(!err){
        res.redirect('/POSPage');
       
        
    } 
    
    else{
        console.log(err);
    }
    
    //console.log('Hi');
    
});
});
    };
exports.minus_order_entry = (req,res) => {

        //Connect to DB
        pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        
        
        //User the connection
        connection.query('UPDATE order_cart,item SET new_stock_added = (new_stock_added-1),total = item.final_price*order_cart.new_stock_added WHERE new_stock_added > 0 AND item.item_id = order_cart.item_id AND order_cart.item_id = ?',[req.params.id],(err,rows) => {
        // When done with the connection, release it
        connection.release()
        
        if(!err){
            res.redirect('/POSPage');
        } 
        
        else{
            console.log(err);
        }
        
        console.log('The data from user table: \n', rows);
        //console.log('Hi');
        
        
        });
        });
        
        
        };

//Transaction Page 
exports.TransactionPage = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection

    
        connection.query('SELECT oe.item_id,ot.order_trans_id, encoded_by,DATE_FORMAT(ot.date_added,"%m-%d-%Y") as datein,new_stock_added, final_price, type_of_transaction,total,amount_received,amount_change,emp_firstname,emp_lastname,item_name,category_name,brand_name FROM order_transaction as ot,employee as e, order_entry as oe, item as i, category as c, brand as b WHERE e.emp_id = ot.encoded_by AND oe.order_trans_id = ot.order_trans_id AND oe.item_id = i.item_id AND i.category_id = c.category_id AND i.brand_id = b.brand_id AND cancelled = "No"  ORDER BY ot.date_added DESC',[],(err,rows) => {

            
            // When done with the connection, release it
    
            if(!err){
                res.render('TransactionPage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);


        });
    });  

    };

//Find stock by search
exports.find_trans = (req,res) => {

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        let searchTerm = req.body.search;
        //User the connection
        connection.query('SELECT oe.item_id,ot.order_trans_id, encoded_by,DATE_FORMAT(ot.date_added,"%m-%d-%Y") as datein,new_stock_added, final_price, type_of_transaction,total,amount_received,amount_change,emp_firstname,emp_lastname,item_name,category_name,brand_name FROM order_transaction as ot,employee as e, order_entry as oe, item as i, category as c, brand as b WHERE e.emp_id = ot.encoded_by AND oe.order_trans_id = ot.order_trans_id AND oe.item_id = i.item_id AND i.category_id = c.category_id AND i.brand_id = b.brand_id AND (item_name LIKE ? OR ot.order_trans_id LIKE ? OR (CONCAT("ID",oe.item_id)) LIKE ?) ORDER BY ot.date_added ', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('TransactionPage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);

        });
    });
    }
exports.FindDate = (req,res) => {

        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
        
            let From_searchTerm = req.body.From_SortDate;
            let To_searchTerm = req.body.To_SortDate;
        
            //User the connection
            connection.query('SELECT oe.item_id,ot.order_trans_id, encoded_by,DATE_FORMAT(ot.date_added,"%m-%d-%Y") as datein,new_stock_added, final_price, type_of_transaction,total,amount_received,amount_change,emp_firstname,emp_lastname,item_name,category_name,brand_name FROM order_transaction as ot,employee as e, order_entry as oe, item as i, category as c, brand as b WHERE e.emp_id = ot.encoded_by AND oe.order_trans_id = ot.order_trans_id AND oe.item_id = i.item_id AND i.category_id = c.category_id AND i.brand_id = b.brand_id AND  CAST(ot.date_added AS DATE) between ? and ? ORDER BY ot.date_added ', [From_searchTerm,To_searchTerm],(err,rows) => {
                // When done with the connection, release it
                connection.release();
        
                if(!err){
                    res.render('TransactionPage', {rows});
                } else{
                    console.log(err);
                }
        
                //console.log('The data from user table: \n', rows);
                console.log("YES"+From_searchTerm);
                console.log("YES"+To_searchTerm);
    
            });
        });
        }


exports.delete_add_all_order_entry = (req,res) => {
            //Connect to DB
            pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
            
            
            //User the connection
            connection.query('DELETE FROM order_cart',[req.params.id],(err,rows) => {
            // When done with the connection, release it
            connection.release()
            
            if(!err){
                res.redirect('/POSPage');
            } 
            
            else{
                console.log(err);
            }
            
            console.log('The data from user table: \n', rows);
            //console.log('Hi');
            
            
            });
            });
            
            
            };
exports.ReturnOrderPage = (req,res) => {
    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection

    
        connection.query('SELECT * FROM order_transaction, employee WHERE encoded_by = emp_id AND cancelled = "No" AND total > 1   ORDER BY order_trans_id DESC',[],(err,rows) => {

            // When done with the connection, release it
    
            if(!err){
                res.render('PAGE-order-return', {rows});
            } else{
                console.log(err);
            }

        });
    });          
            
 };
 exports.add_trans_to_cancel_order_entry = (req,res) => {
    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        connection.query('SELECT * FROM employee WHERE position = "Admin" ',[req.params.id],(err,admin) => {

                // When done with the connection, release it
    
            if(!err){
                res.render('PAGE-cancel-trans', {admin_list:admin});
                
            } else{
                console.log(err);
            }
    
        });
        });
      
 };
 exports.post_add_trans_to_cancel_order_entry = (req,res) => {
    //Connect to DB
    const {emp_id, reason} = req.body;
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)

            connection.query('INSERT INTO cancel_transaction SET emp_id = ?, reason = ?, order_trans_id = NULL ', [emp_id, reason],(err,rows) => {

                // When done with the connection, release it
    
            if(!err){
                res.render('PAGE-cancel-trans', {rows});
                res.redirect('/ReturnOrderPage');
                
            } else{
                console.log(err);
            }
    
        });
        });  
 };
 exports.get_cancel_order_entry = (req,res) => {
    //Connect to DB
   
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection

    
        connection.query('SELECT * FROM order_entry WHERE order_trans_id = ?',[req.params.id],(err,rows) => {
            connection.query('SELECT * FROM item, order_entry WHERE item.item_id = order_entry.item_id AND order_trans_id = ?',[req.params.id],(err,rows) => {
                connection.query('SELECT * FROM order_transaction, order_entry,item WHERE item.item_id = order_entry.item_id AND order_entry.order_trans_id = order_transaction.order_trans_id AND order_transaction.order_trans_id = ?',[req.params.id],(err,rows) => {
                    connection.query('SELECT * FROM employee WHERE position = "Admin" ',[req.params.id],(err,admin) => {

                // When done with the connection, release it
    
            if(!err){
                res.render('edit-return-order', {rows,admin_list:admin});
                
            } else{
                console.log(err);
            }
    

        });
        });
    });
});  
});                  
 };
//Add new item 
exports.cancel_order_entry = (req,res) => {
    const { order_trans_id,new_stock_added} = req.body;
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
            connection.query('UPDATE cancel_transaction SET order_trans_id = ? ORDER BY order_cancel_id DESC LIMIT 1',[req.params.id],(err,rows) => {         
                connection.query('UPDATE order_transaction SET cancelled = "Yes" WHERE order_trans_id = ?',[req.params.id],(err,rows) => {         
                    connection.query('UPDATE item i, order_entry oe,order_transaction ot SET i.stock = (i.stock+oe.new_stock_added) WHERE i.item_id = oe.item_id AND oe.order_trans_id = ot.order_trans_id AND oe.order_trans_id = ?',[req.params.id],(err,rows) => {         
             
              res.render('edit-return-order',{alert: 'Item added successfully.'});
              res.redirect('/OrderTransaction');
            }); 
            });
        });
        });
        
  }

//Cancelled Order Page 
exports.CancelledOrderPage = (req,res) => {

    //Connect to DB
    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
        //User the connection

    
        connection.query('SELECT * FROM cancel_transaction',[],(err,rows) => {
            connection.query('SELECT * FROM item as i, order_entry as oe, cancel_transaction as ct, order_transaction as ot, employee as e, brand as b, category as c WHERE i.item_id = oe.item_id AND oe.order_trans_id = ct.order_trans_id AND e.emp_id = ct.emp_id AND i.category_id = c.category_id AND i.brand_id = b.brand_id AND ot.order_trans_id = ct.order_trans_id',[req.params.id],(err,rows) => {

            
            // When done with the connection, release it
    
            if(!err){
                res.render('CancelledOrdersPage', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
        });
        });
    });  

    };
