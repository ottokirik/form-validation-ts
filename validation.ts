import { all, createValidator, ErrorMessages, some, ValidationRules } from './services';
import { ApplicationForm, KnownSpecialty } from './types';
import { exists, contains, inRange, yearsOf } from './utils';

// чистые функции, принимают ApplicationForm возвращают boolean
// имя
export const validateName = ({ name }: ApplicationForm): boolean => exists(name);

// email
export const validateEmail = ({ email }: ApplicationForm): boolean => email.includes('@') && email.includes('.');

// телефон
const onlyInternationalForm = ({ phone }: ApplicationForm): boolean => phone.startsWith('+');
const onlySafeCharacters = ({ phone }: ApplicationForm): boolean => !contains(phone, /[^\d\s\-\(\)\+]/g);

// возраст
const MIN_AGE = 20;
const MAX_AGE = 50;

const validDate = ({ birthDate }: ApplicationForm): boolean => !Number.isNaN(Date.parse(birthDate));
const allowedAge = ({ birthDate }: ApplicationForm): boolean =>
  inRange(yearsOf(Date.parse(birthDate)), MIN_AGE, MAX_AGE);

// специальность
const MAX_SPECIALTY_LENGTH = 50;
const DEFAULT_SPECIALTIES: List<KnownSpecialty> = ['engineer', 'scientist', 'psychologist'];

const isKnownSpecialty = ({ specialty }: ApplicationForm): boolean => DEFAULT_SPECIALTIES.includes(specialty);
const isValidCustom = ({ customSpecialty: custom }: ApplicationForm): boolean =>
  exists(custom) && custom.length <= MAX_SPECIALTY_LENGTH;

// опыт
const MIN_EXPERIENCE_YEARS = 3;

const isNumberLike = ({ experience }: ApplicationForm): boolean => Number.isFinite(Number(experience));
const isExperienced = ({ experience }: ApplicationForm): boolean => Number(experience) >= MIN_EXPERIENCE_YEARS;

// пароль
const MIN_PASSWORD_SIZE = 10;
const atLeastOneCapital = /[A-Z]/g;
const atLeastOneDigit = /\d/gi;

const hasRequiredSize = ({ password }: ApplicationForm): boolean => password.length >= MIN_PASSWORD_SIZE;
const hasCapital = ({ password }: ApplicationForm): boolean => contains(password, atLeastOneCapital);
const hasDigit = ({ password }: ApplicationForm): boolean => contains(password, atLeastOneDigit);

// правила для валидации полей формы
const phoneRules = [onlyInternationalForm, onlySafeCharacters];
const birthDateRules = [validDate, allowedAge];
const specialtyRules = [isKnownSpecialty, isValidCustom];
const experienceRules = [isNumberLike, isExperienced];
const passwordRules = [hasRequiredSize, hasCapital, hasDigit];

export const validatePhone = all(phoneRules);
export const validateBirthDate = all(birthDateRules);
export const validateSpecialty = some(specialtyRules);
export const validateExperience = all(experienceRules);
export const validatePassword = all(passwordRules);

type ApplicationRules = ValidationRules<ApplicationForm>;
type ApplicationErrors = ErrorMessages<ApplicationForm>;

const rules: ApplicationRules = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
  birthDate: validateBirthDate,
  specialty: validateSpecialty,
  experience: validateExperience,
  password: validatePassword,
};

const errors: ApplicationErrors = {
  name: 'Your name is required for this mission.',
  email: 'Correct email format is user@example.com.',
  phone: 'Please, use only “+”, “-”, “(”, “)”, and a whitespace.',
  birthDate: 'We require applicants to be between 20 and 50 years.',
  specialty: 'Please, use up to 50 characters to describe your specialty.',
  experience: 'For this mission, we search for experience 3+ years.',
  password: 'Your password must be longer than 10 characters, include a capital letter and a digit.',
};

export const validateForm = createValidator(rules, errors);
