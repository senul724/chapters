/**
 * Get the browser name from the cookie
 */
type Browsers = "CHROME" | "BRAVE" | "UNKNWOWN" | null;
export const getBrowserName = (): Browsers => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${"browser"}=`);
  if (parts.length !== 2) {
    return null;
  }

  const browser = parts.pop()?.split(";").shift() ?? null;
  if (browser === null) {
    return null;
  }

  switch (browser) {
    case "Chrome":
      return "CHROME";
    case "Brave":
      return "BRAVE";
    default:
      return "UNKNWOWN";
  }
};

/**
 * Get the os name from the cookie
 */
type OSs = "LINUX" | "MAC" | "WINDOWS" | "ANDROID" | "UNKNWOWN" | null;
export const getOsName = (): OSs => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${"os"}=`);
  if (parts.length !== 2) {
    return null;
  }

  const browser = parts.pop()?.split(";").shift() ?? null;
  if (browser === null) {
    return null;
  }

  switch (browser) {
    case "Linux":
      return "LINUX";
    case "Windows":
      return "WINDOWS";
    case "Android":
      return "ANDROID";
    default:
      return "UNKNWOWN";
  }
};
