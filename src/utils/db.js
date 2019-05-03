const sqlite3 = require("sqlite3").verbose();
let db;

// 连接数据库
function conn() {
  if (!db || !db.open) {
    db = new sqlite3.Database(":memory:", err => {
      if (err) {
        console.error(err.message);
        return false;
      }
      console.log("Connected to the in-memory SQlite database.");
    });
  }
  return db;
}

function close() {
  if (db && db.open) {
    db.close();
  }
}
// 初始化数据表
export const initTable = "innitialize sqlite3";
// export const initTable = () => {
//   return new Promise((resolve, reject) => {
//     let db = conn()
//     console.log(db)
//     // db.serialize(() => {
//     //     db.run('CREATE TABLE IF NOT EXISTS outlet (id int primary key,ministry_id int, ministry_code varchar(64),  ministry_name varchar(255), code varchar(64), outlet varchar(255), location varchar(255), phone varchar(50), lga_name varchar(50))')
//     //     db.run('CREATE TABLE IF NOT EXISTS service (revenue int primary key, code varchar(25), name varchar(64), amount varchar(10))')
//     //     db.run('CREATE TABLE IF NOT EXISTS drugs (revenue int primary key, code varchar(25), name varchar(64), amount varchar(10))')
//     //     db.run('CREATE TABLE IF NOT EXISTS cart (id int primary key, customer int, code varchar(25), subtotal varchar(10), discount varchar(10), vat varchar(10), remark varchar(255), date varchar(10), status int)')
//     //     db.run('CREATE TABLE IF NOT EXISTS customers (id int primary key, names varchar(25), gender varchar(10), dob varchar(10), mstatus varchar(10), email varchar(50), phone varchar(25), address varchar(255))')
//     //     db.run('CREATE TABLE IF NOT EXISTS cartItems (id int primary key, orderid int, names varchar(25), qty int, discount varchar(10), total varchar(10), remark varchar(255))')
//     //     db.run('CREATE TABLE IF NOT EXISTS users (id int primary key, names varchar(25), email varchar(50), phone varchar(25), username varchar(25), password varchar(255))')
//     //   resolve()
//     // })
//     close();
//   })
// }

export const queryAllService = () => {
  return new Promise((resolve, reject) => {
    let db = conn();
    db.all(
      "select revenue, code, name, amount from service order by name asc",
      (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      }
    );
    close();
  });
};

export const queryAllDrugs = () => {
  return new Promise((resolve, reject) => {
    let db = conn();
    db.all(
      "select revenue, code, name, amount from drugs order by name asc",
      (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      }
    );
    close();
  });
};

export const queryAllCart = () => {
  return new Promise((resolve, reject) => {
    let db = conn();
    db.all(
      "select id, customer, code, subtotal, discount, vat, remark, date, status from cart order by date asc",
      (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      }
    );
  });
};

export const queryAllProduct = () => {
  return new Promise((resolve, reject) => {
    let db = conn();
    db.all("select id, name from ProductTable", (err, rows) => {
      if (err) reject(err);
      resolve(rows || []);
    });
  });
};

export const insertProduct = (table, fields) => {
  return new Promise((resolve, reject) => {
    // let db = conn()
    // var a = [];
    // var c = "";
    // var v = "";
    // for (key in fields) {
    //     c += key+ ", ";
    //     v += ":"+key+ ", ";
    //     a[":"+key] = fields[key];
    // }
    // c = rtrim(c,', ');
    // v = rtrim(v,', ');
    // let prepare = db.prepare('replace into '+ table +' ('+ c +') values ('+ v +')')
    // prepare.run(a)
    // prepare.finalize(err => {
    //   if (!err) resolve()
    // })
  });
};
