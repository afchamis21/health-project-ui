import {format} from 'date-fns'

export class DateUtils {
  public static formatDate(date: Date) {
    return format(date, 'yyyy-MM-dd HH:mm:ss')
  }
}
