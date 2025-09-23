/**
 * @author: Ken
 * @description: Class chứa các hàm common, hỗ trợ cho các component
 */
export class CommonUtil {
  /**
   * Định dạng thời gian theo phút và giây
   * @param seconds - Thời gian theo giây
   * @returns Thời gian theo phút và giây
   */
  static formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
