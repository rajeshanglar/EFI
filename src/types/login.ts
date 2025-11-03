export interface LoginFormValues {
  email: string;
  password: string;
  loginType: 'member' | 'conference';
  captcha: string;
}

