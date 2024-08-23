import { RingBuffer } from "./ring-buffer.js";
import { test, expect } from "vitest";

test("Simple RingBuffer test", () => {
  const buffer = new RingBuffer<number>();

  buffer.enqueue(5);
  expect(buffer.dequeue()).toEqual(5);
  expect(buffer.dequeue()).toEqual(undefined);

  buffer.enqueue(42);
  buffer.enqueue(9);
  expect(buffer.dequeue()).toEqual(42);
  expect(buffer.dequeue()).toEqual(9);
  expect(buffer.dequeue()).toEqual(undefined);

  buffer.enqueue(42);
  buffer.enqueue(9);
  buffer.enqueue(12);
  expect(buffer.at(3)).toEqual(undefined);
  expect(buffer.at(2)).toEqual(12);
  expect(buffer.at(1)).toEqual(9);
  expect(buffer.at(0)).toEqual(42);
  expect(buffer.at(-1)).toEqual(12);
  expect(buffer.at(-4)).toEqual(undefined);
});

test("RingBuffer Contrustor test", () => {
  expect(() => new RingBuffer<number>(-1)).toThrow();

  const rbDefault = new RingBuffer<number>();
  expect(rbDefault.size()).toBe(0);
  expect(rbDefault.capacity()).toBe(6);

  const rbCapacity = new RingBuffer<number>(10);
  expect(rbCapacity.size()).toBe(0);
  expect(rbCapacity.capacity()).toBe(10);

  const rbLargeCapacity = new RingBuffer(1e6);
  expect(rbLargeCapacity.size()).toBe(0);
  expect(rbLargeCapacity.capacity()).toBe(1e6);

  expect(() => new RingBuffer(5.5)).toThrow();

  //@ts-ignore
  expect(() => new RingBuffer({ keys: 1 })).toThrow();
  //@ts-ignore
  expect(() => new RingBuffer([null, 1, 2, 3])).toThrow();
  //@ts-ignore
  expect(() => new RingBuffer([])).toThrow();
});

test("Clear a RingBuffer", () => {
  const queue = new RingBuffer<number>();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  queue.clear();
  expect(queue.size()).toBe(0);
  expect(queue.capacity()).toBe(6);
  queue.trimToSize();
  expect(queue.capacity()).toBe(0);
});

test("Oldest and latest values", () => {
  const queue = new RingBuffer();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  expect(queue.oldest()).toBe(1);
  expect(queue.latest()).toBe(3);
  queue.dequeue();
  expect(queue.oldest()).toBe(2);
  queue.enqueue(4);
  expect(queue.latest()).toBe(4);
  queue.clear();
  expect(queue.latest()).toBeUndefined();
  expect(queue.oldest()).toBeUndefined();
});

test("Trim size of RingBuffer", () => {
  const queue = new RingBuffer<number>();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  expect(queue.capacity()).toBe(6);
  queue.trimToSize();
  expect(queue.capacity()).toBe(3);
  expect(queue.toString()).toBe("[ 1, 2, 3 ]");
  queue.trimToSize();
  expect(queue.capacity()).toBe(3);
  queue.dequeue();
  queue.trimToSize();
  expect(queue.capacity()).toBe(2);
  expect(queue.toString()).toBe("[ 2, 3 ]");
  queue.enqueue(1);
  queue.trimToSize();
  expect(queue.toString()).toBe("[ 2, 3, 1 ]");
});

test("toArray", () => {
  const queue = new RingBuffer<number>();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  expect(queue.toArray()).toEqual([1, 2, 3]);
  queue.dequeue();
  queue.enqueue(1);
  expect(queue.toArray()).toEqual([2, 3, 1]);
});
