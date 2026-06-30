// @ts-expect-error using npx
import type { ReactDoctorConfig } from "react-doctor/api";

export default {
  ignore: {
    files: ["src/routes/**", "src/components/ui/**", "src/i18n/globals.d.ts"],
  },
} satisfies ReactDoctorConfig;
