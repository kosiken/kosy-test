import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";

let reactotron;
if (Reactotron.setAsyncStorageHandler) {
  reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage).configure({
    name: "KosyApp",
  });
} else {
  reactotron = Reactotron.configure({
    name: "KosyApp",
  });
}
reactotron = reactotron
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: { veto: () => false }, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect();

export default reactotron;
