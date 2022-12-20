const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Category = require("../models/Category");
const Notification = require("../models/Notification");

const {
  multipleMongooseToObject,
  mongooseToObject,
} = require("../ulti/mongoose");

class productcontroller {
  index(req, res) {
    if (req.cookies.token) {
      var token = req.cookies.token;
      var decodeToken = jwt.verify(token, "mytoken");
      Promise.all([
        User.findOne({ _id: decodeToken }),
        Product.find({}).limit(3),
        Category.find(),
        Notification.find({user: decodeToken}).sort({'createdAt': 1})
      ])
        .then(([user, product, category, noti]) => {
          if (user) {
            req.user = user;
            res.render("home", {
              user: mongooseToObject(user),
              product: multipleMongooseToObject(product),
              category: multipleMongooseToObject(category),
              noti: multipleMongooseToObject(noti),
            });
            // next()
          }
        })
        .catch((err) => console.log(err));
    } else {
      Product.find({})
        .limit(3)
        .then(([product, category]) =>
          res.render("home", {
            product: multipleMongooseToObject(product),
            category: multipleMongooseToObject(category),
          })
        )
        .catch((err) => console.log(err));
    }
  }

  store(req, res, next) {
    var newProduct = new Product({
      name: req.body.name,
      desc: req.body.desc,
      category: req.body.category,
      price: req.body.price,
      image: req.file.filename,
    });
    newProduct
      .save()
      .then(() => res.redirect("back"))
      .catch((error) => {
        console.log(error);
      });
  }

  update(req, res, next) {
    Product.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then((product) => res.redirect("back"))
      .catch(next);
  }

  delete(req, res, next) {
    Product.delete({ _id: req.params.id })
      .then((product) => res.redirect("back"))
      .catch(next);
  }

  force(req, res, next) {
    Product.findOneAndDelete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  restore(req, res, next) {
    console.log('GEt in')
    Product.restore({ _id: req.params.id })
      .then((product) => res.redirect("back"))
      .catch(next);
  }

  show(req, res) {
    if (req.cookies.token) {
      var token = req.cookies.token;
      var decodeToken = jwt.verify(token, "mytoken");
      Promise.all([
        User.findOne({ _id: decodeToken }),
        Product.findById(req.params.id),
        Product.find({}).limit(4),
        Notification.find({user: decodeToken}).sort({'createdAt': 1})
      ])
        .then(([user, product, listProduct, noti]) => {
          if (user) {
            req.user = user;
            res.render("show", {
              user: mongooseToObject(user),
              product: mongooseToObject(product),
              listProduct: multipleMongooseToObject(listProduct),
              noti: multipleMongooseToObject(noti),
              cart: req.session.cart,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Promise.all([Product.findById(req.params.id), Product.find({}).limit(4)])
        .then(([product, listProduct]) => {
          res.render("show", {
            product: mongooseToObject(product),
            listProduct: multipleMongooseToObject(listProduct),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}

const res = require("express/lib/response");
module.exports = new productcontroller();
