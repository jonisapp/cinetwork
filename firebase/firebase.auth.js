import firebase from '../firebase/config';
import getFacebookToken from '../auth/facebook.auth';

async function loginWithFacebook() {
  const token = await getFacebookToken();
  console.log(token);
  if(!!token) {
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    firebase.auth().signInWithCredential(credential).catch((err) => {
      console.log(err.message);
    });
  }
}

export default loginWithFacebook;