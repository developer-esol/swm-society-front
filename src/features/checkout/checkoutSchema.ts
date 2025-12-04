import * as Yup from 'yup';

export const checkoutValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  houseNumber: Yup.string()
    .required('House number is required'),
  apartmentName: Yup.string(),
  streetName: Yup.string()
    .required('Street name is required'),
  city: Yup.string()
    .required('City is required'),
  postalCode: Yup.string()
    .required('Postal code is required'),
  country: Yup.string()
    .required('Country is required'),
  paymentMethod: Yup.string()
    .oneOf(['credit', 'cash'], 'Invalid payment method')
    .required('Payment method is required'),
  cardName: Yup.string().when('paymentMethod', {
    is: 'credit',
    then: (schema) => schema
      .required('Name on card is required')
      .matches(/^[a-zA-Z\s'-]*$/, 'Invalid name format'),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardNumber: Yup.string().when('paymentMethod', {
    is: 'credit',
    then: (schema) => schema
      .required('Card number is required')
      .matches(/^\d{16}$/, 'Card number must be 16 digits'),
    otherwise: (schema) => schema.notRequired(),
  }),
  expiryMonth: Yup.string().when('paymentMethod', {
    is: 'credit',
    then: (schema) => schema
      .required('Expiry month is required')
      .notOneOf(['MM'], 'Please select a valid month'),
    otherwise: (schema) => schema.notRequired(),
  }),
  expiryYear: Yup.string().when('paymentMethod', {
    is: 'credit',
    then: (schema) => schema
      .required('Expiry year is required')
      .notOneOf(['YY'], 'Please select a valid year'),
    otherwise: (schema) => schema.notRequired(),
  }),
  cvv: Yup.string().when('paymentMethod', {
    is: 'credit',
    then: (schema) => schema
      .required('CVV is required')
      .matches(/^\d{3,4}$/, 'CVV must be 3-4 digits'),
    otherwise: (schema) => schema.notRequired(),
  }),
});
