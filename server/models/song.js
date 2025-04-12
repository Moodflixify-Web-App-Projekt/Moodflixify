const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name:{type:String,required:true},
    album:{type:String,required:true},
    artist:{type:String,required:true},
    year:{type:Number,required:true},
    mood:{type:String,required:true, enum: ['Happy', 'Sad', 'Normal', 'Stressed', 'Relaxed', 'Angry']},
});

module.exports = mongoose.model('Song', songSchema);