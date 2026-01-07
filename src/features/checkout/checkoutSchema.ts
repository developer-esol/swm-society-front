import * as Yup from 'yup';

export const checkoutValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  // First name and last name are not required - removed from validation
  firstName: Yup.string(),
  lastName: Yup.string(),
  // House number can be alphanumeric (numbers or names like "Oak House")
  houseNumber: Yup.string()
    .matches(/^[0-9a-zA-Z\s\-\/]+$/, 'House number/name can contain letters, numbers, spaces, hyphens, and slashes')
    .required('House number/name is required'),
  apartmentName: Yup.string(),
  streetName: Yup.string()
    .required('Street name is required'),
  city: Yup.string()
    .required('City is required'),
  postalCode: Yup.string()
    .required('Postal code is required'),
  country: Yup.string()
    .required('Country is required'),
  // Remove payment field validation - no payment processing needed
  paymentMethod: Yup.string(),
  cardName: Yup.string(),
  cardNumber: Yup.string(),
  expiryMonth: Yup.string(),
  expiryYear: Yup.string(),
  cvv: Yup.string(),
});
