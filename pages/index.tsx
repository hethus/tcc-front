import type { NextPage } from "next";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { appRoutes } from "../constants";

const Home: NextPage = () => {
  const { id, token } = useSelector((state: any) => state.user);

  const router = useRouter();

  useEffect(() => {
    if(id && token) {
      router.push(appRoutes.home);
    }
    router.push(appRoutes.login);
  })

  return null;
};

export default Home;
