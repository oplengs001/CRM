var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var UserSchema = mongoose.Schema({
	employee_id : {
		type: Number,
		default: 100
	},
	fullname:{
		type: String,
		index:true
	},
	email:{
		type: String
	},
	position:{
		type: String,
		default: 'Position'
	},
	address:{
		type: String,
		default : 'Address'
	},
	city:{
		type: String,
		default : 'City'
	},
	dateOfBirth : {
		type: String,
		default: 'Date Of Birth'
	},
	mobileNumber : {
		type: String,
		default : 'Mobile Number'
	},
	dateStarted : {
		type: String,
		default : 'Date Started'
	},
	regulizationDate :{
		type: String,
		default : 'regulizationDate'
	},
	sssNumber:{
		type: String,
		default : 'SSS Number'
	},
	TinNumber :{
		type: String,
		default : 'Tin Number'
	},
	philHealthNumber : {
		type: String,
		default : 'Phil Health Number'
	},
	pagibig : {
		type: String,
		default : 'Pag Ibig'
	},
	current_salary : {
		type: Number,
		default : 0
	},
	allowance : {
		type : Number,
		default : 0
	},
	workSchedule : {
		type: String,
		default : '7:00 AM - 4:00 PM'
	},
	employeeStatus : {
		type: String,
		default : 'Probitionary'
	},
	other_allowance : {
		type: Number,
		default: 0
	},
	username:{
		type: String
	},
	password:{
		type: String
	},
	country:{
		type: String
	},
	about:{
		type: String,
		default : 'About'
	},
	role : {
		type : String
	},
	has_avatar : {
		type : Number,
		default : 0
	},
	path: {
		type: String,
		trim: true,
		default: 'http://res.cloudinary.com/mamoyko/image/upload/v1490751022/cffzovccruj0fhbckvtf.png'
	},
	team : {
		type: Schema.Types.ObjectId,
		ref: 'Team'
	},
	account : {
		type: Schema.Types.ObjectId,
		ref : 'Accounts'
	},
	type : {
		type : String,
		default : 'Users'
	}
});	

var User = module.exports = mongoose.model('User',UserSchema);


module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10,function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			newUser.password = hash;
			newUser.save(callback);
		});
	})
}

//module.exports.getCurrentSession = function(username)
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}