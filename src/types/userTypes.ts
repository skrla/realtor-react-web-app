import { FieldValue } from "firebase/firestore";

export type FormDataType = {
  email: string;
  password: string;
  name?: string;
};

export type FormDataCopyType = {
  email: string;
  name?: string;
  timestamp: any;
};

export type UserType = {
  id: string;
  email: string;
  name: string;
  timestamp: any;
};
