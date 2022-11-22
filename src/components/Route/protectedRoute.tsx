import { useEffect } from "react";
import { appRoutes } from "../../../constants";
import { useSelector, useDispatch } from "react-redux";
import { enumUpdate } from "../../../store/actions/enums";
import useCRUD from "../hooks/useCRUD";

const ProtectedRoute = ({ router, children }: any) => {
  const dispatch = useDispatch();
  //Identify authenticated user
  const { user, enums } = useSelector((state: any) => state);
  const isAuthenticated = !!user.id;

  const { handleGet } = useCRUD({ model: "public", pathOptions: "/enums" });

  useEffect(() => {
    if (!Object.keys(enums || {}).length) {
      handleGet().then(({ data, error }) => {
        if (error) return;
        dispatch(enumUpdate(data));
      });
    }
  }, []);

  let protectedRoutes = {
    student: [appRoutes.logout, appRoutes.classes],
    teacher: [
      appRoutes.home,
      appRoutes.logout,
      appRoutes.registerClass,
      appRoutes.classes,
    ],
    admin: [
      appRoutes.home,
      appRoutes.logout,
      appRoutes.registerTeacher,
      appRoutes.classes,
    ],
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
