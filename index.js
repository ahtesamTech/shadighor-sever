const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 8080;


const db = mysql.createConnection({
   host: 'localhost',
  user: 'shadigho_lr',
  password: 'NcPCpUT6AiL4Kq8',
  database: 'shadigho_lr',
})




app.get('/', (req, res) => {

  const  sql = "SELECT * FROM users";

    
    db.query(sql, (err, rows, fields) => {
        if (err) throw err
      
       
        res.json(rows)
      })
      



  });


// POST endpoint for inserting data
app.post('/register', (req, res) => {
 try {
  
  const userData = req.body;

  const sql = 'INSERT INTO users SET ?';

  db.query(sql, userData, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(err);
    }

    res.status(201).json({ success: true, message: 'User registered successfully' });
  });

 } catch (error) {
  
 }
});


app.post('/login', (req, res)=>{


  try {
    

    const { phone, password } = req.body;

  // Query the database to check if the user exists and the password is correct
  db.query(
    'SELECT * FROM users WHERE phone = ? AND password = ?',
    [phone, password],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else if (results.length > 0) {
        res.json(results)
        console.log(results);
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    }
  );



  } catch (error) {
    
  }

})



// GET endpoint for finding and merging user information based on criteria http://localhost:3000/findUsers?gender=female&ageFrom=20&ageTo=30&religion=Muslim
app.get('/findUsers', (req, res) => {
  try {
    const { gender, ageFrom, ageTo, religion } = req.query;

    // Build the SQL query based on the provided criteria
    let sql = 'SELECT * FROM users WHERE approvel = true';

    if (gender) {
      sql += ` AND gender = '${gender}'`;
    }

    if (ageFrom && ageTo) {
      sql += ` AND age BETWEEN ${ageFrom} AND ${ageTo}`;
    }

    if (religion) {
      sql += ` AND religion = '${religion}'`;
    }

    // If no query parameters are provided, return all approved users
    if (!gender && !ageFrom && !ageTo && !religion) {
      sql = 'SELECT * FROM users WHERE approvel = true';
    }

    db.query(sql, (err, rows, fields) => {
      if (err) {
        console.error('Error querying database:', err.stack);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json(rows);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






// GET endpoint for viewing user profile based on ID
app.get('/viewProfile/:id', (req, res) => {
  try {
    const userId = req.params.id;


    const sql = 'SELECT * FROM users WHERE id = ?';

    db.query(sql, [userId], (err, rows, fields) => {
      if (err) {
        console.error('Error querying database:', err.stack);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if a user with the given ID exists
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json(rows[0]); // Assuming you expect only one result
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// send request ////////////////////////////////

app.post('/sendRequest', (req, res)=>{

  try {
  
    const userData = req.body;
  
    // console.log(userData);
    const sql = 'INSERT INTO request_data SET ?';
  
    db.query(sql, userData, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(err);
      }
  
      res.status(201).json({ success: true, message: 'Request send successfully' });
    });
  
   } catch (error) {
    
   }
})
app.post('/payment', (req, res)=>{

  try {
  
    const userData = req.body;
  
    // console.log(userData);
    const sql = 'INSERT INTO payment SET ?';
  
    db.query(sql, userData, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(err);
      }
  
      res.status(201).json({ success: true, message: 'Request send successfully' });
    });
  
   } catch (error) {
    
   }
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  