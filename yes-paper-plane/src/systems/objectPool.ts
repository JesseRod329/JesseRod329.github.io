import Phaser from "phaser";

export class Pool<T extends Phaser.GameObjects.GameObject> {
  private free: T[] = [];
  private used: Set<T> = new Set();

  constructor(private createFn: () => T) {}

  get(): T {
    const obj = this.free.pop() ?? this.createFn();
    this.used.add(obj);
    obj.setActive(true).setVisible(true);
    return obj;
  }

  release(obj: T) {
    obj.setActive(false).setVisible(false);
    this.used.delete(obj);
    this.free.push(obj);
  }

  eachActive(cb: (obj: T) => void) {
    this.used.forEach(cb);
  }
}












