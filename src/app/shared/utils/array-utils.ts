export class ArrayUtils {
  private constructor() {
  }

  public static clearArray(array: any[]) {
    while (array.length !== 0) {
      array.pop()
    }
  }
}
