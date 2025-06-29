export const API: string = 'api';

export const API_PATH: string = '/api/1.0';

export const API_METHODS: { [key: string]: string } = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const STRATEGY = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
  MULTIPLE: 'multiple',
};

export const ROLES: { [key: string]: string } = {
  EMPLOYEE: 'employee',
  SUPER_ADMIN: 'superAdmin',
  ADMIN: 'admin',
};

export const CACHEKEY = {
  LAUNDRY: 'laundry',
  MEALTYPE: 'meal',
  LOCATION: 'location',
  ADDITIONAL: 'as',
  ORGANIZATION: 'organization',
  ADMIN: 'admin',
};

export const APPROVALSTATUS: any = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const SERVICES: { [key: string]: string } = {
  LAUNDRY: 'laundry',
  MEAL: 'meal',
  ADDITIONAL_SERVICE: 'additional',
};
