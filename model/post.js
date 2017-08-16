var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PostSchema = new mongoose.Schema({
	post : {
		type: String
	},
	dateCreated : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	user : {
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	account: {
		type: Schema.Types.ObjectId,
		ref: 'Accounts'
	}
});

var Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.createPost = function(newPost, callback){
	
	newPost.save(function(err,postObj){
		if (err) throw err;
		if(postObj){
			if(typeof callback == 'function'){
				callback(null, postObj._id); 
			}
		}
	});

}