
export const loadLocalStore = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch(e) {
    return undefined;
  }
}

export const saveToLocalStore = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch(e) {
    //ignore errors
  }
}
