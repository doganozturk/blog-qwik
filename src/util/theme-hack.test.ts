import { themeHack } from "./theme-hack";

describe("themeHack", () => {
  let localStorageMock: Storage;
  let rafCount: number;

  beforeEach(() => {
    rafCount = 0;

    // Setup localStorage mock
    localStorageMock = {
      getItem: vi.fn().mockReturnValue(""),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
      key: vi.fn(),
      length: 0,
    };

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

    // Mock requestAnimationFrame to count calls but not execute callback
    window.requestAnimationFrame = vi.fn(() => {
      rafCount++;
      return rafCount;
    });

    // Setup DOM
    document.body.innerHTML = '<div class="theme-container"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("should be a valid JavaScript string", () => {
    expect(typeof themeHack).toBe("string");
    expect(() => new Function(themeHack)).not.toThrow();
  });

  it("should check localStorage and apply theme class when container exists", () => {
    // Setup
    localStorageMock.getItem = vi.fn().mockReturnValue("dark");

    // Mock RAF to execute callback once
    window.requestAnimationFrame = vi.fn((cb) => cb());

    const themeContainer = document.querySelector(".theme-container");

    // Execute
    new Function(themeHack)();

    // Assert
    expect(localStorageMock.getItem).toHaveBeenCalledWith("theme");
    expect(themeContainer?.classList.contains("dark")).toBe(true);
  });

  it("should not add theme class when theme value is empty", () => {
    // Setup
    localStorageMock.getItem = vi.fn().mockReturnValue("");

    // Mock RAF to execute callback once
    window.requestAnimationFrame = vi.fn((cb) => cb());

    const themeContainer = document.querySelector(".theme-container");

    // Execute
    new Function(themeHack)();

    // Assert
    expect(themeContainer?.classList.length).toBe(1);
    expect(themeContainer?.classList.contains("theme-container")).toBe(true);
  });

  it("should request animation frame when theme-container is missing", () => {
    // Setup
    document.body.innerHTML = "";

    // Execute
    new Function(themeHack)();

    // Assert
    expect(window.requestAnimationFrame).toHaveBeenCalled();
    expect(rafCount).toBe(1);
  });
});
