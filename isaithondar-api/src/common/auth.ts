import bcrypt from 'bcrypt';

const saltRounds = 3;

class Auth {
  static hash = async (text: string): Promise<string> => {
    const hashedText = await bcrypt.hash(text, saltRounds);
    return hashedText;
  };

  static compare = async (
    text: string,
    hashedText: string,
  ): Promise<boolean> => {
    const match = await bcrypt.compare(text, hashedText);
    return match;
  };
}

export default Auth;
