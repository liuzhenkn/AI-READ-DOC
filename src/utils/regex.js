const email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
const password = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[`~!@#$%^&*()_\-+=<>.?:"{}].*).{6,20}$/

export default {
  email,
  password
}