import { ServerRoute } from '@hapi/hapi';
import * as otpRoutes from '../module/OTPVerification/OtpRoutes';


const routes: ServerRoute[] = [
  ...otpRoutes.default,
];
export default routes;
