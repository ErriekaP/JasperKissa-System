CREATE TABLE `inventorymanagement`.`item` (`item_id` INT NOT NULL AUTO_INCREMENT , `item_name` VARCHAR(200) NOT NULL , `item_category` VARCHAR(50) NOT NULL , `supplier` VARCHAR(50) NOT NULL , `price` FLOAT NOT NULL , `stock` INT NOT NULL , `desc` TEXT NOT NULL , `date` DATE NOT NULL ) ENGINE = InnoDB;<script>

    const tableEl = document.querySelector('table');
    tableEl.addEventListener('click', onDeleteRow);
  function onDeleteRow(e){
    if(!e.target.classList.contains("hidebtn")){
      return;
    }
    const btn = e.target;
    btn.closest("tr").remove();

  }



  </script>

    DELETE FROM stock_cart WHERE item_id NOT IN (

      <div class="col-6">
    <div class="form-floating">
      <select class="form-select" id="floatingSelectGrid" value="{{this.supplier}}" name="supplier" >
        <option selected>Supplier</option>
            {{#each this.supplier_list}}
                 <option value="{{this.company_name}}"> {{this.company_name}}</option>
            {{/each}}      
             
      </select>
    </div>
     </div>

     ALTER TABLE item ADD supplier CHAR(10)


         //Add new item 
    exports.create_stock = (req,res) => {
  
        pool.getConnection((err,connection) => {
            if(err) throw err; //not connected!
            console.log('Connected as ID' + " " + connection.threadId)
            
        
            let searchTerm = req.body.search;
    
            //User the connection
            connection.query('INSERT INTO stock_in(item_id) SELECT item_id FROM stock_cart',[ req.params.id],(err,rows) => {
                // When done with the connection, release it
                connection.release()
        
                if(!err){
                    res.render('add-all-stockin');
                    res.redirect('/StockinCartPage');
                } else{
                    console.log(err);
                }
        
                console.log('The data from user table: \n', rows);
                
        
            });
        });
        
    
    }


                connection.query('UPDATE order_transaction t1 SET t1.total_due = (SELECT SUM(t3.total) as total FROM order_entry t2, order_cart t3 WHERE t1.order_trans_id = t2.order_trans_id AND t2.item_id = t3.item_id)',[req.params.id],(err,rows) => {
UPDATE order_transaction t1 SET t1.total_due = (SELECT SUM(t3.total) as total FROM order_entry t2, order_cart t3 WHERE t1.order_trans_id = t2.order_trans_id AND t2.item_id = t3.item_id ORDER BY t1.order_trans_id DESC LIMIT 1)

,total_time_work =(NOW()-(SELECT g1.total_time_work FROM attendance_records AS g1 JOIN attendance_records AS g2 ON g2.attendanceID = g1.attendanceID WHERE g1.employeeID = ? OR g2.employeeID = ? ORDER BY g1.total_time_work DESC LIMIT 1))