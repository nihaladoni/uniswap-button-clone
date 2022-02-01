import { UserRejectedRequestError } from "@web3-react/injected-connector";

export const getErrorMessage = (obj) => {
  let errorMessage;
  console.log(obj);
  switch (true) {
    case obj instanceof UserRejectedRequestError:
      errorMessage = "You rejected the wallet request";
      break;

    default:
      errorMessage = "Something went wrong";
      break;
  }
  return errorMessage;
};

export const filterList = (arr, criteria) => {
  if (criteria) return arr.filter((d) => d.name === criteria);
};
