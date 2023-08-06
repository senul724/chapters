const errorList = {
  "sww": "something went wrong! try again later",
  "tal": "try again later",
  "highGas": "High network traffic! try again later",
  "iue": "Failed to upload the image !",
  "ua": "You are not authorized to perform this action",
  "inappropriate": "The image contains inappropriate content",
};

export type AvailableErrors = "sww" | "tal" | "highGas" | "iue" | "ua" | "inappropriate";

export function getErrorMsg(errorKey: AvailableErrors) {
  return errorList[errorKey];
}
