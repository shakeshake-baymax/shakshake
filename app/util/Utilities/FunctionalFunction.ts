namespace Util {
  export const debounce = (func, debounceTime) => {
    let timeoutId: string | number | NodeJS.Timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(context, args), debounceTime);
    };
  };
}

export default Util;
