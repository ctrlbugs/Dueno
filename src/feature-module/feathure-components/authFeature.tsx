
import { Outlet, useLocation } from "react-router-dom";

const AuthFeature = () => {
  const location = useLocation();
  const errorPages = ['/error-404', '/error-500', '/maintance', '/coming-soon'];
  const isErrorPage = errorPages.includes(location.pathname);
  
  return (
   <div className={`main-wrapper ${isErrorPage ? '' : ' auth-cover'}`}>
     <Outlet />
   </div>
  );
};

export default AuthFeature;
