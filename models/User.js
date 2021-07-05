const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50,
	},
	email: {
		type: String,
		// trim 속성: 사용자가 이메일을 입력하다가 공백(스페이스)를 입력하게 되면 이를 무시할지 말지 결정해 줌.
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		minlength: 5,
	},
	lastname: {
		type: String,
		maxlength: 50,
	},
	role: {
		type: Number,
		default: 0,
	},
	imgae: String,
	token: {
		type: String,
	},
	tokenExp: {
		type: Number,
	},
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
