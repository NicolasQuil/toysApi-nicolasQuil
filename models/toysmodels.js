const mongoose = require("mongoose");
// מודול לוולדזציה של מידע שמגיע מצד לקוח
// בבקשות פוסט ופוט לעריכה
const Joi = require("joi");

const ToysSchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    price: Number,
    img_url: String,
    date_create: { type: Date, default: Date.now() },
    user_id: String
})


exports.ToysModel = mongoose.model("toys", ToysSchema);

// פונקציה שמשתמש בג'וי שעושה וולדזציה בצד שרת
// למידע של הבאדי שהגיע מהצד לקוח
exports.validteToy = (reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(150).required(),
        info: Joi.string().min(2).max(350).required(),
        category: Joi.string().min(2).max(50).required(),
        price: Joi.number().min(1).max(9999).required(),
        img_url: Joi.string().min(2).max(300).allow(null, "")
    })
    return joiSchema.validate(reqBody);
}