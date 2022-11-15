import type { NextPage } from "next";
import { useRouter } from "next/router";
import {  useDispatch } from "react-redux";
import { appRoutes } from "../constants";

import { userReset } from "../store/actions/users";


const Logout: NextPage = () => {
    const router = useRouter();
  const dispatch = useDispatch();


        dispatch(userReset());
        router.push(appRoutes.login);
      

  return null;
};

export default Logout;
