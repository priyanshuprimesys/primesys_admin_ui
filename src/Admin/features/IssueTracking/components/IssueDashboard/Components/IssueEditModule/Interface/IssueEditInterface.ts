import { SuccessInterface } from "../../../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"
import { ICommentResponse } from "./IssueCommentInterface"
import { ICommentInterface } from "./IssueCreateInterface"

export interface IIssueUpdateEditInterface{
    issueId: string,
    updatedBy: string,
    issue: {
        wMsgId: string,
        sender: string,
        groupName: string,
        senderName: string,
        message: string,
        noteId: string,
        postTime: number,
        isIssue: boolean,
        issueStatus: string,
        priority: string,
        category: string,
        assignee: string,
        previousAssignee: string,
        comments: ICommentInterface[],
        tags: string[],
        attachments: string[],
        dueDate: number,
        reopenCount: number,
        statusHistory: [],
        transferHistory: [],
        activeStatus: boolean,
        actionBy: string,
        divisionId: string
    }
}



export interface IssueUpdateEditResponse extends SuccessInterface{
    data:{
        result: ICommentResponse
    },
    errors:{
        message: string
    }
}