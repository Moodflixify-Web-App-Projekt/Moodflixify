const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name:{type:String,required:true},
    year:{type:Number,required:true},
    director:{type:String,required:true},
    mood:{type:String,required:true, enum: ['Happy', 'Sad', 'Normal', 'Stressed', 'Relaxed', 'Angry']},
});

module.exports = mongoose.model('Movie', movieSchema);