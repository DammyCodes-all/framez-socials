require("dotenv").config();

module.exports = ({ config }) => {
  return {
    ...config,
    expo: {
      ...(config.expo || {}),
      extra: {
        ...(config.expo?.extra || {}),
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
        eas: {
          projectId: "697cf503-179d-4074-8edf-34d12b8fbcc8",
        },
      },
      android: {
        ...(config.expo?.android || {}),
        package: "com.aluminate.framezsocials",
      },
    },
  };
};
