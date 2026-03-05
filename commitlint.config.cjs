module.exports = {
  extends: ["@commitlint/config-conventional"], // https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
  rules: {
    "header-max-length": [2, "always", 100], // 커밋 메시지 header 길이 제한

  },
};
