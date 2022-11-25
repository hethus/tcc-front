import { useEffect } from "react";
import { appRoutes } from "../../../constants";
import { useSelector, useDispatch } from "react-redux";
import { enumUpdate } from "../../../store/actions/enums";
import useCRUD from "../hooks/useCRUD";

const ProtectedRoute = ({ router, children }: any) => {
  const dispatch = useDispatch();
  //Identify authenticated user
  const { user, enums } = useSelector((state: any) => state); // perguntar como tudo se sincroniza aq
  const isAuthenticated = !!user.id;

  const { handleGet } = useCRUD({ model: "enums" });

  useEffect(() => {
    handleGet().then(({ data, error }) => {
      console.log(data);
      if (error) return;
      dispatch(enumUpdate(data));
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
