import { Button } from "@chakra-ui/react"
import { useContext } from "react"
import { IssueContext } from "../../context/IssueContext/IssueContext"

export const IssueDashboardButton = () => {

    const {setIssueHeader,setIsExpand} = useContext(IssueContext);

    const handleClick = () =>{
        setIssueHeader("");
        setIsExpand(false);
    }

  return (
    <Button onClick={handleClick} className="mb-3">Dashboard</Button>
  )
}
