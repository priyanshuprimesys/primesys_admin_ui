// import IssueBucket from "../IssueBucket/IssueBucket";
import { IssueHeaderDashboard } from "./Components/IssueHeaderDashboard/IssueHeaderDashboard";
import IssueTable from "./Components/IssueTable/IssueTable";



const IssueDashboard = () =>{

    return (
        <div className="w-full h-full bg-gray-200">
            <IssueHeaderDashboard/>
            <IssueTable/>
        </div>
    )
}


export default IssueDashboard;