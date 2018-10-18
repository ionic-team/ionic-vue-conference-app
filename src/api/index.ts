import locations from './data/locations.json';

export async function getLocations() {
  return Promise.resolve(locations);
}
