const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// salt의 글자수를 설정한다
const saltRounds = 10;

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

// index.js의 user.save 전에 실행되는 함수
userSchema.pre("save", function (next) {
	// this는 상단의 userSchema를 가리킨다.
	var user = this;

	// 사용자가 비밀번호를 수정하려고 할 때 암호화하여라.
	if (user.isModified("password")) {
		// 비밀번호를 암호화 시킨다.
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err);
				user.password = hash;
				// next를 사용하게 되면 바로 user.save 함수로 이동한다.
				next();
			});
		});
	} else {
		// 수정하지 않는 경우에는 바로 index.js의 코드를 실행한다.
		next();
	}
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
