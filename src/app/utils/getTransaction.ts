// Generating Transaction id with mixture of current date userId and random Number
export const generateTransactionId = (id: string): string => {
  return `trans_${Date.now()}_${Math.floor(Math.random() * 1000)}_${id.slice(
    18
  )}`;
};