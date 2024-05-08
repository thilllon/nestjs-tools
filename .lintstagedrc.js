module.exports = {
  'libs/**/*.{ts,js,tsx,jsx}': [
    (filenames) => {
      console.log(filenames);
      return `prettier --write --list-different ${filenames}`;
    },
    (filenames) => {
      console.log(filenames);
      return `eslint --fix -c .eslintrc.js ${filenames}`;
    },
  ],
};
