class NoNullError extends Error {
  constructor() {
    super("do not use null, use undefined instead");
    Object.setPrototypeOf(this, NoNullError.prototype);
  }
}

export class RingBuffer<T> {
  //rewrite to # instead of private
  #head: number;
  #tail: number;
  #length: number;
  #maxCapacity: number;
  #arr: (T | undefined)[];
  constructor(maxCapacity = 6) {
    if (typeof maxCapacity !== "number") throw new TypeError("only number inputs");
    if (maxCapacity < 0) throw new RangeError("no negative capacities");
    this.#head = 0;
    this.#maxCapacity = maxCapacity;
    this.#arr = new Array<T | undefined>(this.#maxCapacity);
    this.#tail = 0;
    this.#length = 0;
  }
  /**
   * Enqueue an element.
   */
  enqueue(item: T): void {
    if (this.#length === this.#maxCapacity) {
      this.#maxCapacity = !this.#maxCapacity ? 1 : this.#maxCapacity;
      const rate = this.#maxCapacity >= 100 ? 1.5 : 2;
      const newCapacity = Math.floor(this.#maxCapacity * rate);
      this.#resize(newCapacity);
    }

    this.#arr[this.#tail] = item;
    this.#tail = (this.#tail + 1) % this.#maxCapacity;
    this.#length++;
  }

  /**
   * Remove an element from the start of the queue.
   */
  dequeue(): T | undefined {
    if (this.#length === 0) return undefined;
    const value = this.#arr[this.#head] as T;
    this.#arr[this.#head] = undefined;
    this.#head = (this.#head + 1) % this.#maxCapacity;
    this.#length--;
    return value;
  }

  /**
   * Clears the RingBuffer, resetting all elements and maintaining the current capacity.
   */
  clear(): void {
    this.#length = this.#head = this.#tail = 0;
    this.#arr.fill(undefined);
  }

  /**
   * Returns the item located at the specified index.
   *
   * @param {number} index - The zero-based index of the desired code unit. A negative index will count back from the last item.
   */
  at(index: number): T | undefined {
    //Break out logic and put is a private and then return a number instead.
    if (index >= this.#length || -index > this.#length) return undefined;
    if (index >= 0) return this.#arr[this.#head + index] as T;

    const reverseIdx = (this.#head + this.#length + index) % this.#maxCapacity;
    return this.#arr[reverseIdx] as T;
  }

  /**
   * Returns the current number of elements in the RingBuffer.
   */
  size(): number {
    return this.#length;
  }

  /**
   * Returns the maximum capacity of the RingBuffer.
   */
  capacity() {
    return this.#maxCapacity;
  }

  /**
   * Returns the oldest element in the RingBuffer.
   */
  oldest(): T | undefined {
    return this.at(0);
  }

  /**
   * Returns the lastest element in the RingBuffer.
   */
  latest(): T | undefined {
    return this.at(-1);
  }

  /**
   * Resizes the RingBuffer to match the current number of elements, reducing its capacity to the current size.
   * If the buffer is already at full capacity, method will not perform any resizing.
   */
  trimToSize(): void {
    if (this.#length <= this.#maxCapacity) {
      this.#resize(this.#length);
    }
  }

  /**
   * Prints out the RingBuffer as a string
   */
  toString(): string {
    return `[ ${this.#arr.join(", ")} ]`;
  }

  /**
   * Returns a copy of the ring buffer as JavaScript standard array.
   */
  toArray(): T[] {
    const newArr = new Array<T | undefined>(this.#length);
    this.#copyElementsToAnArray(newArr);
    return newArr as T[];
  }

  #resize(newCapacity: number): void {
    const newArr = new Array<T | undefined>(newCapacity);
    this.#copyElementsToAnArray(newArr);
    this.#head = 0;
    this.#tail = this.#length;
    this.#maxCapacity = newCapacity;
    this.#arr = newArr;
  }

  #copyElementsToAnArray(targetArr: Array<T | undefined>) {
    for (let i = 0; i < this.#length; i++) {
      targetArr[i] = this.#arr[(this.#head + i) % this.#maxCapacity];
    }
  }
}
