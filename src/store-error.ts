export default (
  e: { name: string; message: string },
  effectName: string
): void => {
  e.name = `StoreError > ${e.name}`;
  e.message = `${e.message} (in ${effectName})`;
  console.error(e);
};
