// Generating Transaction id with mixture of current date userId and random Number
export const generateTransactionId = (id: string): string => {
  return `trxid${Date.now()}${Math.floor(Math.random() * 100)}${id.slice(
    18
  )}`;
};