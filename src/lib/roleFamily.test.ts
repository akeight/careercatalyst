import { describe, expect, it } from "vitest";
import {
  suggestMobileSpecialization,
  suggestRoleFamily,
} from "@/lib/roleFamily";

describe("suggestRoleFamily", () => {
  it("suggests frontend from title", () => {
    expect(suggestRoleFamily("Frontend Engineer")).toBe("FRONTEND_ENGINEERING");
  });

  it("suggests mobile from iOS keywords", () => {
    expect(suggestRoleFamily("iOS Developer")).toBe("MOBILE_DEVELOPMENT");
  });

  it("suggests product management", () => {
    expect(suggestRoleFamily("Product Manager Intern")).toBe(
      "PRODUCT_MANAGEMENT",
    );
  });

  it("suggests design", () => {
    expect(suggestRoleFamily("UX Designer")).toBe("UX_UI_PRODUCT_DESIGN");
  });
});

describe("suggestMobileSpecialization", () => {
  it("detects iOS", () => {
    expect(suggestMobileSpecialization("iOS Intern")).toBe("IOS");
  });

  it("detects Android", () => {
    expect(suggestMobileSpecialization("Android Engineer")).toBe("ANDROID");
  });

  it("detects cross-platform", () => {
    expect(
      suggestMobileSpecialization("Mobile Engineer", "React Native required"),
    ).toBe("CROSS_PLATFORM");
  });
});
