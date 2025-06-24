export const timestampToDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  return `${Y}-${M}-${D} ${h}:${m}`;
};

/**
 * 格式化对话时间（企业微信风格）
 * @param {Date | string | number} timestamp - 时间戳或日期对象
 * @returns {string} 格式化后的时间字符串
 */
export const formatChatTime = (timestamp: Date | string | number): string => {
  // 处理 Unix 时间戳（秒）
  const date =
    timestamp instanceof Date
      ? timestamp
      : new Date(
          typeof timestamp === 'number' && timestamp < 10000000000
            ? timestamp * 1000
            : timestamp,
        );

  if (isNaN(date.getTime())) {
    return '无效时间';
  }

  const now = new Date();

  // 计算时间差（单位：毫秒）
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  // 今天的时间显示格式：HH:mm
  if (diffDays === 0) {
    return formatTime(date);
  }
  // 昨天的显示格式：昨天 HH:mm
  else if (diffDays === 1) {
    return `昨天 ${formatTime(date)}`;
  }
  // 一周内的显示格式：星期X HH:mm
  else if (diffDays < 7) {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${weekdays[date.getDay()]} ${formatTime(date)}`;
  }
  // 今年的显示格式：M月D日 HH:mm
  else if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${formatTime(date)}`;
  }
  // 更早的显示格式：YYYY年M月D日 HH:mm
  else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${formatTime(date)}`;
  }
};

/**
 * 格式化时间部分（HH:mm）
 * @param {Date} date - 日期对象
 * @returns {string} 时间字符串
 */
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
