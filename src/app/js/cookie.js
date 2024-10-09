export const getCookie = (name) => {
  if (typeof document === "undefined") {
    return null; // Prevents server-side execution
  }

  const cookieArr = document.cookie.split(";");

  // Loop through the array elements
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    // Removing whitespace at the beginning of the cookie name
    // and compare it with the given string
    if (name === cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
};

export const setCookie = (name, value, days) => {
  if (typeof document === "undefined") {
    return; // Prevents server-side execution
  }

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
};
