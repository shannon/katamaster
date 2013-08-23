// The Form model
 
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var formSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String,
    steps: [{ type: Schema.Types.ObjectId, ref: 'Step' }],
    firstStep: { type: Schema.Types.ObjectId, ref: 'Step' },
    created: { type: Date, default: Date.now }
});

var stepSchema = new Schema ({
    form: { type : Schema.ObjectId, ref : 'Form' },
    prevStep: { type : Schema.ObjectId, ref : 'Step' },
    nextStep: { type : Schema.ObjectId, ref : 'Step' },
    stance: String, //bow, horse, cat etc
    southpaw: Boolean, //right foot forward
    strike: String, //jab, cross, hook, etc
    block: String, //high, low, middle
    grapple: String, //target: head, arm
    dodge: String, //Slip, duck
    hand: String, //Left, right
    move: Number, //distance
    direction: Number, //degree of movement
    rotation: Number, //degree rotation
    transition: String, //shuffle, step, cross
    created: { type: Date, default: Date.now }
});
 
exports.Form = mongoose.model('Form', formSchema);
exports.Step = mongoose.model('Step', stepSchema);
