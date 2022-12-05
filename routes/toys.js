const express = require("express");
const { ToysModel, validteToy } = require("../models/toysmodels")
const { auth } = require("../middleware/auth")
const router = express.Router();

router.get("/", async (req, res) => {
  // http://localhost:3002/toys/?perPage=2 אפשר להגדיר כמה אנחנו רוצים שיויו מופיע בדף דפאולט יהיו 10
  let page = Number(req.query.page) || 1;
  let perPage = Number(req.query.perPage) || 10;

  let sort = req.query.sort || "price";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await ToysModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })


    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
  // res.json({ msg: "Foods Work 200" });
})

router.post("/", auth, async (req, res) => {
  let validBody = validteToy(req.body);
  // אם יש טעות יזהה מאפיין אירור בולידבאדי
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    let toy = new ToysModel(req.body)
    toy.user_id = req.tokenData._id;
    // להוסיף את עצמו כרשומה
    await toy.save();
    // אם הצליח נקבל את הבאדים פלוס מאפפין איי די
    // ו _V
    // 201 - הצלחה - ונוספה רשומה חדשה במסד
    res.status(201).json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

//http://localhost:3002/toys/search/?s=fun אפשר לחפש את השם של המשחק או לפי האינפו שלו כדוגמה לגו וכו״ 
router.get("/search", async (req, res) => {
  let perPage = Number(req.query.perPage) || 4;
  let page = Number(req.query.page) || 1;
  let sort = req.query.sort || "price";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let searchQ = req.query.s;
    //i פותר הבעיה של קייסנסיטיב 
    let searchExp = new RegExp(searchQ, "i")
    let data = await ToysModel.find({ $or: [{ name: searchExp }, { info: searchExp }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.get("/price", async (req, res) => {
  //http://localhost:3002/toys/price/?max=100&min=5
  try {
    let min = req.query.min || 5;
    let max = req.query.max || 20;
    // lte -> less than equal -> קטן שווה ל
    let data = await ToysModel.find({ price: { $lte: max, $gte: min } })
      .limit(20)
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})
router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validteToy(req.body);
  // אם יש טעות יזהה מאפיין אירור בולידבאדי
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await ToysModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body)
    // modfiedCount : 1 - אם הצליח לערוך נקבל בצד לקוח בחזרה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//localhost:3002/toys/637a5a3387ca051076e33887
router.delete("/:idDel", auth, async (req, res) => {
  let idDel = req.params.idDel;
  try {
    let data = await ToysModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
    // deleteCount : 1 - אם הצליח למחוק נקבל בצד לקוח בחזרה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


//http://localhost:3002/toys/category/cars ככה יכולים לחפש לפי קטגוריות 
router.get("/category/:catname", async (req, res) => {
  let perPage = Number(req.query.perPage || 10);
  let Page = Number(req.query.perPage || 1);
  let sort = req.query.sort || "price";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let cat = req.params.catname;
    //i פותר הבעיה של קייסנסיטיב 
    let categoExp = new RegExp(cat, "i")
    let data = await ToysModel.find({ category: categoExp })
      .limit(perPage)
      .skip((Page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

module.exports = router;

