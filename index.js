// express 패키지 모듈을 가지고 온다.
const express = require("express");
// express의 함수를 이용해 새로운 express 앱을 만든다.
const app = express();
// 백 서버로 5000번을 설정한다.
const port = 5000;

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

// 5000번 포트에서 이 app을 실행한다.
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
