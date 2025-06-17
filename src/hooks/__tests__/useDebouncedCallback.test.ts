import { renderHook, act } from "@testing-library/react";
import { useDebouncedCallback } from "../useDebouncedCallback";

jest.useFakeTimers();

describe("useDebouncedCallback hook", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should debounce function calls", () => {
    const mockFn = jest.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebouncedCallback(mockFn, delay));

    act(() => {
      result.current("test1");
      result.current("test2");
      result.current("test3");
    });

    expect(mockFn).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(mockFn).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test3");
  });

  it("should reset timer on subsequent calls", () => {
    const mockFn = jest.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebouncedCallback(mockFn, delay));

    act(() => {
      result.current("test1");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    act(() => {
      result.current("test2");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockFn).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test2");
  });

  it("should handle multiple arguments", () => {
    const mockFn = jest.fn();
    const delay = 300;

    const { result } = renderHook(() => useDebouncedCallback(mockFn, delay));

    act(() => {
      result.current("arg1", "arg2", "arg3");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", "arg3");
  });

  it("should handle no arguments", () => {
    const mockFn = jest.fn();
    const delay = 200;

    const { result } = renderHook(() => useDebouncedCallback(mockFn, delay));

    act(() => {
      result.current();
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(mockFn).toHaveBeenCalledWith();
  });

  it("should call latest callback when dependencies change", () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const delay = 300;

    const { result, rerender } = renderHook(
      ({ callback }) => useDebouncedCallback(callback, delay),
      { initialProps: { callback: mockFn1 } }
    );

    act(() => {
      result.current("test");
    });

    rerender({ callback: mockFn2 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockFn1).toHaveBeenCalledWith("test");
    expect(mockFn2).not.toHaveBeenCalled();
  });

  it("should update when delay changes", () => {
    const mockFn = jest.fn();

    const { result, rerender } = renderHook(({ delay }) => useDebouncedCallback(mockFn, delay), {
      initialProps: { delay: 300 },
    });

    act(() => {
      result.current("test");
    });

    rerender({ delay: 100 });

    act(() => {
      result.current("test2");
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockFn).toHaveBeenCalledWith("test2");
  });

  it("should clean up timeout on unmount", () => {
    const mockFn = jest.fn();
    const delay = 500;

    const { result, unmount } = renderHook(() => useDebouncedCallback(mockFn, delay));

    act(() => {
      result.current("test");
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockFn).not.toHaveBeenCalled();
  });

  it("should handle zero delay", () => {
    const mockFn = jest.fn();
    const delay = 0;

    const { result } = renderHook(() => useDebouncedCallback(mockFn, delay));

    act(() => {
      result.current("test");
    });

    expect(mockFn).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("should maintain function reference stability when dependencies don't change", () => {
    const mockFn = jest.fn();
    const delay = 300;

    const { result, rerender } = renderHook(() => useDebouncedCallback(mockFn, delay));

    const firstRef = result.current;
    rerender();
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });

  it("should update function reference when dependencies change", () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      { initialProps: { callback: mockFn1, delay: 300 } }
    );

    const firstRef = result.current;

    rerender({ callback: mockFn2, delay: 300 });
    const secondRef = result.current;

    expect(firstRef).not.toBe(secondRef);
  });
});
