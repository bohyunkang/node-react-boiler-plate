const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// salt의 글자수를 설정한다
const saltRounds = 10;

// jsonwebtoken 패키지를 불러온다.
const jwt = require("jsonwebtoken");

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

userSchema.methods.comparePassword = function (plainPassword, callbackFn) {
	// plainPassword도 암호화를 시켜 기존에 암호화된 비밀번호와 대조한다.
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return callbackFn(err), callbackFn(null, isMatch);
	});
};

userSchema.methods.generateToken = function (callbackFn) {
	var user = this;
	// jsonwebtoken을 이용해서 token을 생성한다.
	// 즉 token은 user._id와 secretToken이 결합되어 만들어진다.
	// 그래서 secretToken을 넣으면 user._id를 알아낼 수 있게 되는 것!
	var token = jwt.sign(user._id.toHexString(), "secretToken");
	user.token = token;
	user.save(function (err, user) {
		if (err) return callbackFn(err);
		callbackFn(null, user);
	});
};

userSchema.statics.findByToken = function (token, callbackFn) {
	var user = this;

	// 토큰을 decode한다.
	jwt.verify(token, "secretToken", function (err, decoded) {
		// 유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인한다.
		user.findOne(
			{
				_id: decoded,
				token: token,
			},
			function (err, user) {
				if (err) return callbackFn(err);
				callbackFn(null, user);
			}
		);
	});
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
