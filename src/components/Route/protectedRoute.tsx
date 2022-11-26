import { useEffect, useState } from "react";
import { appRoutes } from "../../../constants";
import { useSelector, useDispatch } from "react-redux";
import { enumUpdate } from "../../../store/actions/enums";
import useCRUD from "../hooks/useCRUD";

const ProtectedRoute = ({ router, children }: any) => {
  const dispatch = useDispatch();
  //Identify authenticated user
  const { user, enums } = useSelector((state: any) => state);
  const { handleGet: userAuthenticated } = useCRUD({
    model: "auth",
    pathOptions: "is-authenticated",
  });
  const { handleGet } = useCRUD({ model: "enums" });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    userAuthenticated(
      {
        header: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    ).then(({ data }) => {
      if (data.message === "User successfully logged in!") {
        setIsAuthenticated(true);
        return;
      }
      console.log("n deu erro");
      setIsAuthenticated(false);
    })
    .catch((error) => {
      console.log("deu erro");
      console.log(error);
      setIsAuthenticated(false);
    });
  }, [router.pathname]);

  useEffect(() => {
    handleGet().then(({ data }) => {
      dispatch(enumUpdate(data));
    }).catch((error) => {
      console.log(error);
    });
  }, [isAuthenticated && !enums]);

  let protectedRoutes = {
    student: [appRoutes.logout],
    teacher: [appRoutes.home, appRoutes.logout, appRoutes.registerClass],
    admin: [appRoutes.home, appRoutes.logout, appRoutes.registerTeacher],
  };

  if (!isAuthenticated && router.pathname !== appRoutes.login) {
    router.push(appRoutes.login);
    return null;
  }

  if (
    isAuthenticated &&
    !protectedRoutes[user?.userType].find((url) => url === router.pathname)
  ) {
    router.push(protectedRoutes[user?.userType][0]);
    return null;
  }

  if (isAuthenticated && router.pathname === appRoutes.login) {
    router.push(appRoutes.home);
    return null;
  }

  return children;
};

export default ProtectedRoute;
