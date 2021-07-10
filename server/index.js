// express 패키지 모듈을 가지고 온다.
const express = require("express");
// express의 함수를 이용해 새로운 express 앱을 만든다.
const app = express();
// 백 서버로 5000번을 설정한다.
const port = 5000;
// body-parser: Body 데이터를 분석(parse)해서 req.body로 출력해주는 패키지
const bodyParser = require("body-parser");
// cookie-parser: 토큰을 쿠키에 저장하기 위해서 필요한 패키지
const cookieParser = require("cookie-parser");

// 환경변수 분기처리 해놓은 파일을 가져온다.
const config = require("./config/key");

// 만들어놓은 auth 미들웨어를 가져온다.
const { auth } = require("./middleware/auth");

// 만들어놓은 User 모델을 가져온다.
const { User } = require("./models/User");

// body-parser에 옵션을 준다.
// application/x-www-form-urlencoded <- 이 데이터를 분석해서 가지고 올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true }));
// application/json <- 이 데이터를 분석해서 가지고 올 수 있게 해줌
app.use(bodyParser.json());
// cookie-parser를 사용한다.
app.use(cookieParser());

// mongoose: 몽고DB를 편하게 쓸 수 있는 Object Modeling Tool
const mongoose = require("mongoose");
mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log("몽고DB 연결 완료!"))
	.catch((err) => console.log(err));

// app에서 "Hello World!"를 출력한다.
app.get("/", (req, res) => {
	res.send("Hello World! 안녕하세요!");
});

app.get("/api/hello", (req, res) => {
	res.send("안녕하세요!!");
});

app.post("/api/users/register", (req, res) => {
	// 회원 가입할 때 필요한 정보들을 client에서 가져와 데이터 베이스에 담는다.
	const user = new User(req.body);
	user.save((err, doc) => {
		// 에러 발생 시 false와 에러메세지를 반환
		if (err) return res.json({ success: false, err });
		// 성공 시 문제없이 반환되었다는 200메세지를 반환
		return res.status(200).json({
			success: true,
		});
	});
});

app.post("/api/users/login", (req, res) => {
	// 1. 요청된 이메일을 데이터베이스에서 있는지 찾는다.
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) {
			return res.json({
				loginSuccess: false,
				message: "제공된 이메일에 해당하는 유저가 없습니다.",
			});
		}
		// 2. 요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인한다.
		// comparePassword 메소드는 User.js에 존재한다.
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch)
				return res.json({
					loginSuccess: false,
					message: "비밀번호가 틀렸습니다",
				});
		});

		// 3. 비밀번호가 일치한다면 토큰을 생성한다.
		user.generateToken((err, user) => {
			if (err) return res.status(400).send(err);

			// 토큰을 쿠키에 저장한다.
			res
				.cookie("x_auth", user.token)
				.status(200)
				.json({ loginSuccess: true, userId: user._id });
		});
	});
});

// 두번째 인자로는 auth라는 미들웨어를 받아온다.
// 미들웨어: 엔드포인트에서 리퀘스트를 받고, 콜백함수를 받기 전에 중간작업을 해준다.
app.get("/api/users/auth", auth, (req, res) => {
	// 아래 함수가 실행된다는 것은 미들웨어인 Authentication이 true라는 뜻
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image,
	});
});

app.get("/api/users/logout", auth, (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{
			token: "",
		},
		(err, user) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).send({
				success: true,
			});
		}
	);
});

// 5000번 포트에서 이 app을 실행한다.
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
