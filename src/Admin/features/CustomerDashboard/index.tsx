import { useContext } from "react"
import { CustomerDataTable } from "./components/CustomerDataTable/CustomerDataTable"
import UserLogin from "./components/UserLogin/UserLogin"
import WebSiteDataTab from "./components/WebsiteDataTab/WebSiteDataTab"
import { CustomerLoginDetailContext } from "./context/CustomerLoginDetailContext/CustomerLoginDetailContext"

const index = () => {

  const {customerLogged} = useContext(CustomerLoginDetailContext);


  return (
    <>
        <UserLogin/>
        <hr className="my-3 border border-black" />
        {
          customerLogged ?
         <>
          <CustomerDataTable/>
          <hr className="my-3 border border-black" />
          <WebSiteDataTab/>
         </>
         :
         <div className="text-center">
         <h1 className="text-base font-semibold text-black">Please Log in to get Data Insights</h1>
       </div>
        }

    </>
  )
}

export default index
