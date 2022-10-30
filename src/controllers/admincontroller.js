const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const jwt = require("jsonwebtoken");

const {
  multipleMongooseToObject,
  mongooseToObject,
} = require("../ulti/mongoose");

class admincontroller {
  index(req, res) {
    var token = req.cookies.token;
    var decodeToken = jwt.verify(token, "mytoken");
    Promise.all([
      User.findOne({ _id: decodeToken }),
      Product.find({}),
      Category.find(),
    ])
      .then(([user, product, category]) => {
        res.render("admin", {
          user: mongooseToObject(user),
          product: multipleMongooseToObject(product),
          category: multipleMongooseToObject(category),
          layout: "dashboard",
        });
      })
      .catch((error) => {
        console.error(error);
        res.redirect("/login");
      });
  }
  // create(req, res) {
  //     res.render('admin/product-mgmt')
  // }
  // update(req, res) {
  //     Product.findOne({ _id: req.params.id })
  //         .then(product => {
  //             if (!product) {
  //                 res.render('admin/product-mgmt', {
  //                     msg: 'Product not found!'
  //                 })
  //             } else {
  //                 res.render('admin/product-mgmt', {
  //                     product: mongooseToObject(product),
  //                     messages: req.flash('success')
  //                 })
  //             }
  //         })
  // }
  // createCategory(req, res) {
  //     res.render('admin/category-mgmt')
  // }
  // updateCategory(req, res) {
  //     Category.findOne({ _id: req.params.id })
  //         .then(category => {
  //             if (!category) {
  //                 res.render('admin/category-mgmt', {
  //                     msg: 'Category not found!'
  //                 })
  //             } else {
  //                 res.render('admin/category-mgmt', {
  //                     category: mongooseToObject(category),
  //                     messages: req.flash('success')
  //                 })
  //             }
  //         })
  // }

  productTable(req, res, next) {
    var token = req.cookies.token;
    var decodeToken = jwt.verify(token, "mytoken");
    Promise.all([
      User.findOne({ _id: decodeToken }),
      Category.find({}),
      Product.find().populate("category"),
      // Product.findDeleted({}).populate('category')
    ])
      .then(
        ([
          user,
          category,
          product,
          // foodDeleted
        ]) => {
          res.render("admin/product-mgmt", {
            user: mongooseToObject(user),
            category: multipleMongooseToObject(category),
            product: multipleMongooseToObject(product),
            // foodDeleted: multipleMongooseToObject(foodDeleted),
            layout: "dashboard",
          });
        }
      )
      .catch((error) => {
        console.error(error);
        //res.redirect('/login')
      });
  }

  categoryTable(req, res, next) {
    var token = req.cookies.token;
    var decodeToken = jwt.verify(token, "mytoken");
    Promise.all([
      User.findOne({ _id: decodeToken }),
      Category.find(),
      // Category.findDeleted(),
    ])
      .then(
        ([
          user,
          category,
          // categoryDeleted
        ]) => {
          res.render("admin/category-mgmt", {
            user: mongooseToObject(user),
            category: multipleMongooseToObject(category),
            // categoryDeleted: multipleMongooseToObject(categoryDeleted),
            layout: "dashboard",
          });
        }
      )
      .catch((error) => {
        console.error(error);
        res.redirect("/login");
      });
  }

  userTable(req, res, next) {
    var token = req.cookies.token;
    var decodeToken = jwt.verify(token, "mytoken");
    Promise.all([
      User.findOne({ _id: decodeToken }),
      Category.find(),
      User.find(),
      // User.findDeleted(),
    ])
      .then(([user, category, users]) => {
        res.render("admin/user-mgmt", {
          user: mongooseToObject(user),
          users: multipleMongooseToObject(users),
          category: multipleMongooseToObject(category),
          layout: "dashboard",
        });
      })
      .catch((error) => {
        console.error(error);
        res.redirect("/login");
      });
  }

  deletedProductTable(req, res, next) {
    var token = req.cookies.token;
    var decodeToken = jwt.verify(token, "mytoken");
    Promise.all([
      User.findOne({ _id: decodeToken }),
      Category.find(),
      Product.findDeleted({}).populate("category"),
      // Product.findDeleted({}).populate('category')
    ])
      .then(
        ([
          user,
          category,
          product,
          // foodDeleted
        ]) => {
          res.render("admin/delete-product-table", {
            user: mongooseToObject(user),
            category: multipleMongooseToObject(category),
            product: multipleMongooseToObject(product),
            // foodDeleted: multipleMongooseToObject(foodDeleted),
            layout: "dashboard",
          });
        }
      )
      .catch((error) => {
        console.error(error);
        //res.redirect('/login')
      });
  }

  deletedCategoryTable(req, res, next) {
    var token = req.cookies.token;
    var decodeToken = jwt.verify(token, "mytoken");
    Promise.all([
      User.findOne({ _id: decodeToken }),
      Category.findDeleted(),
      // Category.findDeleted(),
    ])
      .then(
        ([
          user,
          category,
          // categoryDeleted
        ]) => {
          res.render("admin/delete-category-table", {
            user: mongooseToObject(user),
            category: multipleMongooseToObject(category),
            // categoryDeleted: multipleMongooseToObject(categoryDeleted),
            layout: "dashboard",
          });
        }
      )
      .catch((error) => {
        console.error(error);
        res.redirect("/login");
      });
  }

  deletedUserTable(req, res, next) {
    var token = req.cookies.token;
    var decodeToken = jwt.verify(token, "mytoken");
    Promise.all([
      User.findOne({ _id: decodeToken }),
      Category.find(),
      User.find(),
      // User.findDeleted(),
    ])
      .then(([user, category, users]) => {
        res.render("admin/delete-user-table", {
          user: mongooseToObject(user),
          users: multipleMongooseToObject(users),
          category: multipleMongooseToObject(category),
          layout: "dashboard",
        });
      })
      .catch((error) => {
        console.error(error);
        res.redirect("/login");
      });
  }
}

const res = require("express/lib/response");
module.exports = new admincontroller();
