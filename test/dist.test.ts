import { RingBuffer } from "../dist/index.js";
import { RingBuffer as CustomBuffer } from "../dist/index.cjs";
import { test, expect } from "vitest";

test("CJS and ESM can be used interchangeably", () => {
  const buffer = new RingBuffer<number>();
  const buffer2 = buffer;
  buffer.enqueue(5);
  expect(buffer.dequeue()).toEqual(5);
  expect(buffer.dequeue()).toEqual(undefined);

  buffer.enqueue(42);
  buffer2.enqueue(9);
  expect(buffer.dequeue()).toEqual(42);
  expect(buffer.dequeue()).toEqual(9);
  expect(buffer.dequeue()).toEqual(undefined);
  expect(buffer).toBe(buffer2);
});

test("RingBuffer from CJS and ESM should not manipulate the same state", () => {
  const esmBuffer = new RingBuffer<number>();
  const cjsBuffer = new CustomBuffer<number>();

  esmBuffer.enqueue(1);
  esmBuffer.enqueue(2);

  expect(cjsBuffer.size).not.toBe(esmBuffer.size);
});

test("CJS and ESM are not the same object", () => {
  const buffer = new RingBuffer<number>();
  const buffer2 = new CustomBuffer<number>();

  expect(buffer).toMatchObject(buffer2);
  buffer.enqueue(5);
  buffer2.enqueue(5);
  expect(buffer).not.toBe(buffer2);
});
