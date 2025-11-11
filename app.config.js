require("dotenv").config();

module.exports = ({ config }) => {
  return {
    ...config,
    expo: {
      extra: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
      },
    },
  };
};
