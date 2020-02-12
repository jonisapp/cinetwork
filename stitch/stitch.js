import { Stitch, AnonymousCredential, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";

var stitchClient;
var mongodbClient;

Stitch.initializeDefaultAppClient('cinetwork-zffgc').then(client => {
  stitchClient = client;
  stitchClient.auth.loginWithCredential(new AnonymousCredential());
  mongodbClient = stitchClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('cinetwork');
});

export const mongodb = () => {
  return mongodbClient;
}