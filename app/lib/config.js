// ======= Container for all the environments ===========//
const environment = {};

//======= Staging (default) environment =============//
environment.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "mySecret",
  twilio: {
    accountSid: "ACf1758b9441d0c3e353474b1c12c70d35",
    authToken: "5f7d9ebde228a20536dc35aa58b37389",
    fromPhone: "01789877577",
  },
};

//======= Production environment ==============//
environment.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "mySecret",
  twilio: {
    accountSid: "ACf1758b9441d0c3e353474b1c12c70d35",
    authToken: "5f7d9ebde228a20536dc35aa58b37389",
    fromPhone: "01789877577",
  },
};

//=== Determine which environment was passed as a command-line argument ==//
const currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

//=== Check that the current environment is one of the environments above if not , default to staging ===//

const environmentToExport = environment[currentEnvironment]
  ? environment[currentEnvironment]
  : environment.staging;

module.exports = environmentToExport;
