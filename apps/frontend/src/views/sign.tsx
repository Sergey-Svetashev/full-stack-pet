import { navigate } from "astro:transitions/client";
import { useState } from "react";
import TEXT from "../TEXT.ts";
import { signHandler } from "../api/index.ts";
import { Form } from "../components/form.tsx";
import { ApiError } from "../errors.ts";
import { FormData } from "../models/index.ts";
import {
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  TOKEN_SESSION_KEY,
} from "../utils/constants.ts";

export const SignForm = ({ isIn }: { isIn?: boolean }) => {
  const [state, setState] = useState({
    text: "",
    isRegistered: false,
    isError: false,
  });
  const errorHandler = (e: ApiError) => {
    setState((prev) => ({
      ...prev,
      text: e.message,
      isError: true,
      isRegistered: e.statusCode === 401
    }));
  };

  const onSignInSubmit = (data: FormData) =>
    signHandler(data, SIGN_IN_PATH)
      .then(({ accessToken }) => {
        if (accessToken) sessionStorage.setItem(TOKEN_SESSION_KEY, accessToken);

        navigate("/");
      })
      .catch(errorHandler);

  const onSignUpSubmit = (data: FormData) =>
    signHandler(data, SIGN_UP_PATH)
      .then(() => {
        setState((prev) => ({
          ...prev,
          text: TEXT.sign.signed,
          isRegistered: true,
        }));
      })
      .catch(errorHandler);

  console.log(state.isRegistered, TEXT.sign.signUp, TEXT.sign.signIn);

  return (
    <>
      <Form id="sign" onSubmit={isIn ? onSignInSubmit : onSignUpSubmit} />
      {state.text && (
        <div className="border-solid border-black">{state.text}</div>
      )}
      {state.text && (
        <a href={`/${state.isRegistered ? SIGN_IN_PATH : SIGN_UP_PATH}`}>
          {state.isRegistered ? TEXT.sign.signIn : TEXT.sign.signUp}
        </a>
      )}
    </>
  );
};
