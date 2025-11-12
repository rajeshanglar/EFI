export interface SubmitAbstractAuthor {
  name: string;
  affiliation: string;
}

export interface SubmitAbstractFormValues {
  title: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  registrationNumber: string;
  institute: string;
  authors: SubmitAbstractAuthor[];
  abstractType: string;
  abstractTopics: string;
  abstractTitle: string;
  abstractDescription: string;
  abstractFileName: string;
  captcha: string;
  acceptDeclaration: boolean;
}

