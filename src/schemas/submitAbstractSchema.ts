import * as yup from 'yup';

import { SubmitAbstractAuthor, SubmitAbstractFormValues } from '../types/submitAbstract';
import { generateCaptcha } from './conferenceRegistrationSchema';

const authorSchema: yup.ObjectSchema<SubmitAbstractAuthor> = yup
  .object({
    name: yup
      .string()
      .required('Author name is required')
      .trim()
      .min(2, 'Author name must be at least 2 characters'),
    affiliation: yup
      .string()
      .required('Affiliation is required')
      .trim()
      .min(2, 'Affiliation must be at least 2 characters'),
  })
  .required();

export const submitAbstractInitialAuthors: SubmitAbstractAuthor[] = [
  { name: '', affiliation: '' },
];

export const submitAbstractInitialValues: SubmitAbstractFormValues = {
  title: '',
  fullName: '',
  email: '',
  mobileNumber: '',
  registrationNumber: '',
  institute: '',
  authors: submitAbstractInitialAuthors.map(author => ({ ...author })),
  abstractType: '',
  abstractTopics: '',
  abstractTitle: '',
  abstractDescription: '',
  abstractFileName: '',
  captcha: '',
  acceptDeclaration: false,
};

export const submitAbstractSchema = (captchaCode: string) =>
  yup.object({
    title: yup
      .string()
      .required('Title is required')
      .trim()
      .min(3, 'Title must be at least 3 characters'),
    fullName: yup
      .string()
      .required('Full name is required')
      .trim()
      .min(3, 'Full name must be at least 3 characters'),
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email address')
      .trim(),
    mobileNumber: yup
      .string()
      .required('Mobile number is required')
      .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
    registrationNumber: yup
      .string()
      .required('Registration number is required')
      .trim(),
    institute: yup
      .string()
      .required('Institute / Hospital / Organization is required')
      .trim(),
    authors: yup
      .array()
      .of(authorSchema)
      .min(1, 'At least one author is required'),
    abstractType: yup.string().required('Abstract type is required').trim(),
    abstractTopics: yup.string().required('Abstract topics are required').trim(),
    abstractTitle: yup
      .string()
      .required('Abstract title is required')
      .trim()
      .min(3, 'Abstract title must be at least 3 characters'),
    abstractDescription: yup
      .string()
      .required('Description is required')
      .trim()
      .min(20, 'Description must be at least 20 characters'),
    abstractFileName: yup
      .string()
      .required('Please upload your abstract (.doc, .docx, or .pdf)'),
    captcha: yup
      .string()
      .required('CAPTCHA is required')
      .test('captcha-match', 'Invalid CAPTCHA', value =>
        value ? value.trim().toUpperCase() === captchaCode.trim().toUpperCase() : false,
      ),
    acceptDeclaration: yup
      .boolean()
      .oneOf([true], 'You must accept the declaration to proceed'),
  });

export { generateCaptcha };

