/** 
• author v
• thumbnail
• pet name
• localization
• date
• owner name
• phone
• description
• img 1
• img 2
• img 3
• img 4
• found
• tags
• created at
• updated at
**/
var mongoose = require('mongoose');


var postSchema = new mongoose.Schema({
    author:{
        type: String
        /**
         * type: mongoose.Schema.Types.ObjectId, ref: 'User'
         */
        
    },
    thumbnail: {
        type:String
    },
    petname: {
        type: String,
    },
    location: {
                type: [Number, Number],
                index: '2d'
            
    },
    email: {
        type: String,
        index: true,
        unique: true
    },
    password: String,
    date:{
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type:Date,
        default:Date.now
    },
    owner_name: String,
    phone: String, 
    description: String,
    img:{
        type:[String]
    },
    found:Boolean,
    tags: [String],
    
  
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;