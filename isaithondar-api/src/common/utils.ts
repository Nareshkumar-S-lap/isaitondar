import { v4 as uuidv4 } from 'uuid';
import libphonenumber from 'google-libphonenumber';
import config from 'config';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

class Utils {

  static uuid = (): string => uuidv4();

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  static isValidPhoneNumber(
    phoneNumber: string,
  ): boolean | { success: false; errorMessage: string } {
    try {
      const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
      const parsedNumber = phoneUtil.parse(phoneNumber);
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (error: any) {
      return false;
    }
  }
  static formatPhoneNumber(inputPhoneNumber: string): {
    success: boolean;
    phoneNumber?: string;
    errorMessage?: string;
  } {
    try {
      const phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

      const parsedPhoneNumber = phoneNumberUtil.parse(
        inputPhoneNumber,
        config.get('defaultRegion'),
      );

      // Format to E.164 without spaces
      const formattedPhoneNumber = phoneNumberUtil.format(
        parsedPhoneNumber,
        libphonenumber.PhoneNumberFormat.E164,
      );

      // Check if the formatted number is valid
      const isValid = phoneNumberUtil.isValidNumber(
        phoneNumberUtil.parse(
          formattedPhoneNumber,
          config.get('defaultRegion'),
        ),
      );

      return { success: isValid, phoneNumber: formattedPhoneNumber };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message,
      };
    }
  }

  static getMobileNumber = (number: any) => {
    const getRawInput = phoneUtil.parseAndKeepRawInput(number);
    return `${getRawInput.getCountryCode()}${getRawInput.getNationalNumber()}`;
  };

  static isValid = (number: string) =>
    phoneUtil.isPossibleNumberString(number, config.get('defaultRegion'));

  static parse(number: string) {
    if (Utils.isValid(number)) {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(
        number,
        config.get('defaultRegion'),
      );
      return {
        mobile: `+${phoneNumber.getCountryCode()}${phoneNumber.getNationalNumber()}`,
        valid: true,
        countryCode: phoneNumber.getCountryCode(),
        nationalNumber: phoneNumber.getNationalNumber(),
        rawInput: phoneNumber.getRawInput(),
      };
    }
    return {
      valid: false,
    };
  }
}

export default Utils;
