import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { appRoutes } from "../../../constants";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const useCRUD = ({ model = '', options = {}, pathOptions = '', headerOptions = {}, immediatlyLoadData = false }) => {
    const router = useRouter();
    const { user } = useSelector((state) => state)
    const { pathname } = router;
    const [loading, setLoading] = useState(immediatlyLoadData);
    const [data, setData] = useState(null);

    const headers = {
        'Content-Type': 'application/json',
        ...(user?.token && {'Authorization': `Bearer ${user?.token}`}),
        ...headerOptions
      };

    const throwError = useCallback((errorParam, displayToast = true) => {
        setLoading(false);
        const { response: { data: errorData = {} } = {} } = errorParam;
        const { code = '', statusCode = null, logout: shouldLogout, message = null } = errorData || {};
    
        if (code && shouldLogout) {
          return pathname === appRoutes.login ? null : router.push(appRoutes.logout);
        }
    
        const errMsg = message || `Ocorreu um erro ${code}`;

        return { error: { message: errMsg } };
      }, []);

    const handleGet = useCallback(
        ({ refetchOptions = null, refetchPathOptions = '', generateLoading = true, displayToast = true, header = {} } = {}) => {

          if (generateLoading) setLoading(true);
          if (!header) header = headers;
    
          // eslint-disable-next-line consistent-return
          return axios
            .get(`${baseURL}/${model}/${refetchPathOptions || pathOptions}`, {
              params: refetchOptions || options,
              headers: header
            })
            .catch(err => throwError(err, displayToast))
            .finally(() => {
              setLoading(false);
            });
        },
        [model, pathOptions]
      );

      const handleCreate = useCallback(
        ({ values = {}, refetchOptions = null, refetchPathOptions = null, generateLoading = true, displayToast = true, header = {} } = {}) => {
          if (generateLoading) setLoading(true);
          if (!header) header = headers;
    
          // eslint-disable-next-line consistent-return
          return axios
            .post(`${baseURL}/${model}/${refetchPathOptions || pathOptions}`, values, {
              params: refetchOptions || options,
              headers
            })
            .catch(err => throwError(err, displayToast))
            .finally(() => {
              setLoading(false);
            });
        },
        [model, pathOptions]
      );

      const handleUpdate = useCallback(
        ({ values = {}, id = '', refetchOptions = null, refetchPathOptions = '', generateLoading = true, displayToast = true, header = {} } = {}) => {

          if (generateLoading) setLoading(true);
          if (!header) header = headers;
    
          // eslint-disable-next-line consistent-return
          return axios
            .patch(`${baseURL}/${model}/${id}${refetchPathOptions || pathOptions}`, values, {
              params: refetchOptions || options,
              headers
            })
            .catch(err => throwError(err, displayToast))
            .finally(() => {
              setLoading(false);
            });
        },
        [model, pathOptions]
      );

      const handleDelete = useCallback(
        ({ values = {}, id = '', refetchOptions = null, refetchPathOptions = null, generateLoading = true, displayToast = true } = {}) => {

          if (generateLoading) setLoading(true);
    
          // eslint-disable-next-line consistent-return
          return axios
            .delete(`${baseURL}/${model}/${id}${refetchPathOptions || pathOptions}`, {
                data: values,
              params: refetchOptions || options,
              headers
            })
            .catch(err => throwError(err, displayToast))
            .finally(() => {
              setLoading(false);
            });
        },
        [model, pathOptions]
      );

      useEffect(() => {
        if(immediatlyLoadData){
          handleGet().then(({data: _data}) => {
            setData(_data);
          })
        }
      }, []);

      return {
        setLoading,
        loading,
        options,
        handleGet,
        handleUpdate,
        handleDelete,
        handleCreate,
        data
      };
}

export default useCRUD;