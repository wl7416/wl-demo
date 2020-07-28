// 保存用户信息等封装的方法
const KEY = "toutiao-pic"

// 保存用户信息
const setUser = ((user) => {
  window.sessionStorage.setItem(KEY, JSON.stringify(user))
})

// 获取用户信息
const getUser = () => {
  const localUser = window.sessionStorage.getItem(KEY)
  return JSON.parse(localUser || '{}')
}


// 删除用户信息
const delUser = () => {
  window.sessionStorage.removeItem(KEY)
}

// 导出封装的方法
export default {
  setUser,
  getUser,
  delUser
}