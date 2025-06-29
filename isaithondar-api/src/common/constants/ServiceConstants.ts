export const OTP_EXPIRATION_TIME = 3 * 60 * 1000; // 3 minutes
export const OTP_SIZE = 6;
export const PAGE: number = 1; // used for pagination by default
export const PAGE_SIZE: number = 10; // used to get 10 records per page
export const DAYS_TO_ADD = 82;
export const GET_DATE: boolean = true;
export const MANDAY_DIVISOR: number = 3;
export const CACHE_KEY_FIELD = ['id', 'code', 'name', 'nameAr'];
export const ADDITIONAL_CATERING = 'Additional Catering';
export const SNACKS_OTHERS = 'Snacks/Others';
export const TIME_FORMAT: { [key: string]: string } = {
  TWELVE_HOUR: 'hh:mm:ss', // 12 hour format
  TWENTY_FOUR_HOUR: 'HH:mm:ss', // 24 hour format
};
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  MID_MEAL: 'mid-night',
};
export const REQUEST_STATUS: { [key: number]: string } = {
  1: 'pending',
  2: 'cancelled',
  3: 'in-progress',
  4: 'finished',
  5: 'completed',
};
export const ROLE: { [key: number]: string } = {
  1: 'admin',
  2: 'employee',
};
// Define the mapping for additional services
export const ADDITIONAL_SERVICE: { [key: number]: string } = {
  1: 'AdditionalCatering',
  2: 'Refreshmenttrays',
  3: 'BoxMeal',
  4: 'NightMenu',
  5: 'VIPMenu',
  6: 'HolidayMenu',
};

export const USER_TYPE: { [key: number]: boolean } = {
  1: true,
  2: false,
};

export const SERVICES_QUERY: { [key: number]: string } = {
  1: 'laundry',
  2: 'meal',
  3: 'additional',
};

export const LAUNDARY_STATUS = {
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in-progress',
  FINISHED: 'finished',
  COMPLETED: 'completed',
};

export const AS_STATUS = {
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const SERVICE_CATEGORY = {
  LAUNDRY: 'laundry',
  MEAL: 'meal',
  ADDITIONAL: 'additional',
};

export const MANDAYS = 'mandays';

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SEND: 'send',
};

export const ORGANIZATION = {
  SA: 'SA',
  ACGC: 'ACGC',
  QNCS: 'QNCS',
};
export const GET_DATE_KEY = {
  CREATEDATE: 'createdAt',
  REPORTDATE: 'reportDate',
};

export const actionTypes = {
  accept: 1,
  reject: 2,
  send: 3,
};

export const organizationStatusKeys: any = {
  SA: 'sastatus',
  ACGC: 'acgcstatus',
  QNCS: 'qncsstatus',
};

export const organizationPayloadKeys: any = {
  SA: 'saAdminId',
  ACGC: 'acgcAdminId',
  QNCS: 'qncsAdminId',
};

export const CATEGORY_NAME: any = {
  meal: 'Meal',
  additional: 'Additional Service',
  laundry: 'Laundry',
  'mid-night': 'Mid night',
  mandays: 'Mandays',
};

export const COMMUNICATION_SUCESS_STATUS = {
  FAIL: 'fail',
  SUCCESS: 'success',
};
export const COMMUNICATION_ENABLE_DISABLE = {
  TRUE: 'true',
  FALSE: ' false',
};

export const APPROVAL_STATUS_FILTER: any = {
  1: 'approved',
  2: 'rejected',
  3: 'pending',
};

export const SERVICE_CATEGORY_FILTER_ID = {
  LAUNDRY: 1,
  MEAL: 2,
  ADDITIONAL: 3,
};
