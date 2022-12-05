const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://nicolas3010:nicolasquil@clustercats.7pkwn7o.mongodb.net/idf78');
    console.log("mongo connect atlas")

}