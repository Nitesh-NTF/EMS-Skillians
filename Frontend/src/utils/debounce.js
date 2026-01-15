export const debounce = (fn, delay = 1000) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("call")
      fn(...args);
    }, delay);
  };
};