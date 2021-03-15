const mysql = require("mysql");

//Connection pool - mysql
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//views Users
exports.view = (req, res) => {
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    //user connection
    connection.query(
      "SELECT * FROM user WHERE status = 'active' ",
      (err, rows) => {
        //when done with the connection , release it -- όταν τελειώσετε με τη σύνδεση, αφήστε την
        connection.release();

        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

//find user by Search

exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    let searchTerm = req.body.search;
    //user connection
    connection.query(
      "SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        //when done with the connection , release it -- όταν τελειώσετε με τη σύνδεση, αφήστε την
        connection.release();

        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};
//add new user for get method
exports.form = (req, res) => {
  res.render("add-user");
};

//add new user -- post method
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    let searchTerm = req.body.search;
    //user connection
    connection.query(
      "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?",
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        //when done with the connection , release it
        connection.release();

        if (!err) {
          res.render("add-user", { alert: "User added succesfully oeo!" });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

//edit user method
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);
    //user connection

    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        //when done with the connection , release it -- όταν τελειώσετε με τη σύνδεση, αφήστε την
        connection.release();

        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

//update user method
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);
    //user connection

    connection.query(
      "UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?",
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        //when done with the connection , release it -- όταν τελειώσετε με τη σύνδεση, αφήστε την
        connection.release();

        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err; //not connected
            console.log("Connected as ID " + connection.threadId);
            //user connection

            connection.query(
              "SELECT * FROM user WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                //when done with the connection , release it -- όταν τελειώσετε με τη σύνδεση, αφήστε την
                connection.release();

                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: `${first_name} has been updated!`,
                  });
                } else {
                  console.log(err);
                }
                console.log("The data from user table: \n", rows);
              }
            );
          });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

//delete user method
exports.delete = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    //user connection
    connection.query(
      "UPDATE user SET status = ? WHERE id = ?",
      ["removed", req.params.id],
      (err, rows) => {
        //when done with the connection , release it -- όταν τελειώσετε με τη σύνδεση, αφήστε την
        connection.release();

        if (!err) {
          let removedUser = encodeURIComponent("User successfully removed.");
          res.redirect("/?removed=" + removedUser);
        } else {
          console.log(err);
        }
        console.log("The data from beer table are: \n", rows);
      }
    );
  });
};

//views AllUsers
exports.viewall = (req, res) => {
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("Connected as ID " + connection.threadId);

    //user connection
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        //when done with the connection , release it -- όταν τελειώσετε με τη σύνδεση, αφήστε την
        connection.release();

        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};
