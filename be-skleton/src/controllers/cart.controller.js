// 실제로는 유저별 장바구니가 필요하지만 Day 1은 공용 더미
const dummyCart = []

export const getCart = (req, res) => {
  res.json({ cart: dummyCart })
}
