import { useContext } from "react";
import { IssueContext } from "../../context/IssueContext/IssueContext";
import { IoMdRefreshCircle } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import { get_issue_message_query_key } from "../../queryKey/queryKey";
import { useToast } from "@chakra-ui/react";

const Header = () =>{

    const {issueHeader} = useContext(IssueContext);
    const toast = useToast();
    const queryClient = useQueryClient();


    const handleClick = () =>{
        queryClient.invalidateQueries({queryKey:[get_issue_message_query_key]});
        toast({
            status:'info',
            title:"Data Fetched now",
            isClosable:true,
            duration:1000
        });
    }   

    return(
        <header className="w-full absolute top-0 z-40 left-0 py-3 pr-12 px-4 bg-dashboardHead">
            <div className="flex justify-between items-center">
                <h2 className="text-white underline underline-offset-2 font-semibold">
                {issueHeader !== '' ?  issueHeader : 'Dashboard'}
                </h2>
                <div>
                    <IoMdRefreshCircle onClick={handleClick} size={26} color="white" className="!bg-dashboardDark rounded cursor-pointer" />
                </div>
            </div>

        </header>
    )
}


export default Header;