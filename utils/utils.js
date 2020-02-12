export const createTextIndex = (fieldValue) => {
  let searchIndex = {};
  for(let i = 0; i < fieldValue.length; ++i) {
    searchIndex[fieldValue.slice(0, i+1).toLowerCase().trim()] = true; 
  }
  return searchIndex;
};