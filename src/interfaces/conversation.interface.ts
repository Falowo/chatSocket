import { IMessage } from "./message.interface";

export interface IConversation {
  _id?: string;
  membersId?: string[] ;
  adminsId?: string[] ;
  groupName?: string;
  groupPicture?: string;
  lastMessageId?: string;
  pendingMessagesIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPConversation {
    _id?: string;
    membersId?: string[] ;
    adminsId?: string[] ;
    groupName?: string;
    groupPicture?: string;
    lastMessageId?: IMessage;
    pendingMessagesIds?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }