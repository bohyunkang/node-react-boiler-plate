// express 패키지 모듈을 가지고 온다.
const express = require("express");
// express의 함수를 이용해 새로운 express 앱을 만든다.
const app = express();
// 백 서버로 5000번을 설정한다.
const port = 5000;
// body-parser: Body 데이터를 분석(parse)해서 req.body로 출력해주는 패키지
const bodyParser = require("body-parser");

// 만들어놓은 User 모델을 가져온다.
const { User } = require("./models/User");

// body-parser에 옵션을 준다.
// application/x-www-form-urlencoded <- 이 데이터를 분석해서 가지고 올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true }));
// application/json <- 이 데이터를 분석해서 가지고 올 수 있게 해줌
app.use(bodyParser.json());

// mongoose: 몽고DB를 편하게 쓸 수 있는 Object Modeling Tool
const mongoose = require("mongoose");
mongoose
	.connect(
		"mongodb+srv://bohyunkang:abcd1234@boilerplate.vtb4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		}
	)
	.then(() => console.log("몽고DB 연결 완료!"))
	.catch((err) => console.log(err));

// app에서 "Hello World!"를 출력한다.
app.get("/", (req, res) => {
	res.send("Hello World! 안녕하세요!");
});

app.post("/register", (req, res) => {
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

// 5000번 포트에서 이 app을 실행한다.
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
