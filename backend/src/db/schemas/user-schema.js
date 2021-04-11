import mongoose from 'mongoose';

const Schema = mongoose.Schema,
	  bcrypt = require('bcrypt'),
	  saltRounds = 10;


const userSchema = new Schema({
	userName: { type: String, required: true, unique: true} ,
	password: { type: String, reqired: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: String,
	addedTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }]
}, {
	timestamps: {}
});

userSchema.pre('save', function(next){
	let user = this;

	if (!user.isModified('password'))
		return next();
	
	bcrypt.genSalt(saltRounds, function(err, salt){
		if (err)
			return next(err);

		bcrypt.hash(user.password, salt, function(err, hash){
			if (err)
				return next(err);

			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, cb){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if (err)
			return cb(err);
		
		cb(null, isMatch);
	});
};

const User = mongoose.model('User', userSchema);

export { User };