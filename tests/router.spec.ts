import router from "@/router";
import { describe, expect, it } from "vitest";
import type { RouteRecordNormalized } from "vue-router";

describe("router", () => {
  it("defines the /home route", () => {
    const homeRoute = router
      .getRoutes()
      .find((route: RouteRecordNormalized) => route.path === "/home");
    expect(homeRoute).toBeTruthy();
    expect(homeRoute?.name).toBe("Home");
  });

  it("redirects / to /home", () => {
    const rootRoute = router
      .getRoutes()
      .find((route: RouteRecordNormalized) => route.path === "/");
    expect(rootRoute?.redirect).toBe("/home");
  });
});
