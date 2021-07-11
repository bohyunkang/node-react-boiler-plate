import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
	// 두번째 인자의 option 종류
	// null => 아무나 출입이 가능한 페이지
	// true => 로그인한 유저만 출입이 가능한 페이지
	// false => 로그인한 유저는 출입 불가능한 페이지

	// 세번째 인자의 adminRoute
	// true => 어드민 유저만 들어갈 수 있는 페이지
	// adminRoute = null : 세번째 인자를 입력하지 않으면 null이 기본값이라는 의미

	function AuthenticationCheck(props) {
		const dispatch = useDispatch();

		useEffect(() => {
			dispatch(auth()).then((response) => {
				console.log(response);

				// 로그인 하지 않은 상태
				if (!response.payload.isAuth) {
					if (option) {
						props.history.push("/login");
					}
				} else {
					// 로그인 한 상태
					// 어드민 계정이 아닌데 어드민 페이지에 접근하려고 할 때
					if (adminRoute && !response.payload.isAdmin) {
						props.history.push("/");
					} else {
						// 로그인 한 유저가 로그인 페이지나 회원가입 페이지에 접근하려고 할 때
						if (option === false) {
							props.history.push("/");
						}
					}
				}
			});
		}, []);

		return <SpecificComponent />;
	}
	return AuthenticationCheck;
}
