import { useEffect, useState } from "react";
import { appRoutes } from "../../../constants";
import { useSelector, useDispatch } from "react-redux";
import { enumUpdate } from "../../../store/actions/enums";
import useCRUD from "../hooks/useCRUD";
import { toast } from "react-toastify";

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
    if (user.token === null) {
      return;
    }

    userAuthenticated({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async ({ data }) => {
        if (!data && router.pathname !== appRoutes.login) {
          setIsAuthenticated(false);
          toast.error("Sessão expirada, por favor faça login novamente", {
            toastId: "auth",
            });
            return;
        }
        if (data.message === "User successfully logged in!") {
          setIsAuthenticated(true);
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [router.pathname]);

  useEffect(() => {
    handleGet()
      .then(({ data }) => {
        dispatch(enumUpdate(data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isAuthenticated && !enums]);

  let protectedRoutes = {
    student: [appRoutes.logout, appRoutes.classes],
    teacher: [
      appRoutes.home,
      appRoutes.logout,
      appRoutes.registerClass,
      appRoutes.classes,
      appRoutes.updateClass
    ],
    admin: [
      appRoutes.home,
      appRoutes.logout,
      appRoutes.registerTeacher,
      appRoutes.classes,
      appRoutes.updateClass
    ],
  };

  if (!isAuthenticated && router.pathname !== appRoutes.login) {
    router.push(appRoutes.login);
    return null;
  }
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
