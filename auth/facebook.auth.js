import * as Facebook from 'expo-facebook';

Facebook.initializeAsync('581958291988571');

export default getFacebookToken = async () => {
  try {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '581958291988571',
      {
        permissions: ['public_profile']
      }
    );
    console.log(token);
    if(type === 'success') {
      return token;
    }
  } catch({ message }){
    throw new Error(message);
  }
}
