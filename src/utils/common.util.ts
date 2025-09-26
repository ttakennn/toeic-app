/**
 * @author: Ken
 * @description: Class chứa các hàm common, hỗ trợ cho các component
 */
export class CommonUtil {
  /*
   * @param difficulty
   * @returns {string}
   * @description Dùng để lấy màu sắc cho difficulty
   * @example
   * CommonUtil.getDifficultyColor('Dễ') // #4caf50
   * CommonUtil.getDifficultyColor('Trung bình') // #ff9800
   * CommonUtil.getDifficultyColor('Khó') // #f44336
   * CommonUtil.getDifficultyColor('Không xác định') // #757575
   */
  static getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'Dễ':
      case 'easy':
        return '#4caf50';
      case 'Trung bình':
      case 'medium':
        return '#ff9800';
      case 'Khó':
      case 'hard':
        return '#f44336';
      default:
        return '#757575';
    }
  }

  /**
   * @param categoryId
   * @returns {string}
   * @description Dùng để lấy emoji cho category
   * @example
   * CommonUtil.getCategoryEmoji('basic') // 🎯
   */
  static getCategoryEmoji(categoryId: string) {
    switch (categoryId) {
      case 'basic':
        return '🎯';
      case 'advanced':
        return '🌄';
      case 'simulation':
        return '🔧';
      case 'mixed':
        return '🤝';
      default:
        return '📝';
    }
  }
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

  /**
   * Định dạng thời gian theo phút và giây
   * @param seconds - Thời gian theo giây
   * @returns Thời gian theo phút và giây
   */
  static formatTimeV2(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Lấy thông báo điểm số
   * @param score - Điểm số
   * @returns Thông báo điểm số
   */
  static getScoreMessage(score: number) {
    if (score >= 90) return { message: 'Xuất sắc! 🏆', color: '#4caf50' };
    if (score >= 80) return { message: 'Rất tốt! 🌟', color: '#2196f3' };
    if (score >= 70) return { message: 'Tốt! 👍', color: '#ff9800' };
    if (score >= 60) return { message: 'Khá! 📈', color: '#ff5722' };
    return { message: 'Cần cải thiện! 💪', color: '#f44336' };
  }
}
