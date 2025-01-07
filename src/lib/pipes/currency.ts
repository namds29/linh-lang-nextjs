export function formatCurrency (amount: number) {
  const formatter = new Intl.NumberFormat('vi-VN')
  return `${formatter.format(amount)} đ`
}

