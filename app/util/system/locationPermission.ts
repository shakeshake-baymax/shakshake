import * as Location from "expo-location";
class LocationPermission {
  async apply() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      return true;
    } else {
      return false;
    }
  }
  async getLocation() {
    let { coords } = await Location.getCurrentPositionAsync({});
    console.log(coords);
  }
}
const _Location = new LocationPermission();
export default _Location;
