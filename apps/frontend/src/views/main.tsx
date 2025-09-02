import { useEffect, useState } from "react";
import { accessCheck } from "../api/index.ts";
import { SIGN_IN_PATH, TOKEN_SESSION_KEY } from "../utils/constants.ts";

export const MainForm = () => {
  const [accessCheckResult, setAccessCheckResult] = useState({
    text: "Loading...",
    isError: false,
  });
  const accessToken = sessionStorage.getItem(TOKEN_SESSION_KEY);

  useEffect(() => {
    (async () => {
      try {
        const { email, accessToken: token } = await accessCheck(accessToken);
        sessionStorage.setItem(TOKEN_SESSION_KEY, token);

        setAccessCheckResult((state) => ({
          ...state,
          text: `Hello ${email}`,
          isError: false,
        }));
      } catch (e) {
        if (e instanceof Error) {
          setAccessCheckResult((state) => ({
            ...state,
            text: e.message,
            isError: true,
          }));
        }
      }
    })();
  }, []);

  return (
    <>
      <h1>
        Mailing Form <b>TBD</b>
      </h1>
      <div className="border border-solid border-black p-5 rounded-lg">
        {<p>{accessCheckResult.text}</p>}
        <br />
        {accessCheckResult.isError && <a href={`/${SIGN_IN_PATH}`}>Sign In</a>}
      </div>
    </>
  );
};
