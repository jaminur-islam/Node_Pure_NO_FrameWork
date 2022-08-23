// ======= Container for all the environments ===========//
const environment = {};

//======= Staging (default) environment =============//
environment.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "mySecret",
};

//======= Production environment ==============//
environment.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "mySecret",
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
