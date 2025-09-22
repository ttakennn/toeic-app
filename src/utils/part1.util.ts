/**
 * @description Util class for Part 1
 */
export class Part1Util {
  /*
   * @param difficulty
   * @returns {string}
   * @description Dùng để lấy màu sắc cho difficulty
   * @example
   * Part1Util.getDifficultyColor('Dễ') // #4caf50
   * Part1Util.getDifficultyColor('Trung bình') // #ff9800
   * Part1Util.getDifficultyColor('Khó') // #f44336
   * Part1Util.getDifficultyColor('Không xác định') // #757575
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
}
