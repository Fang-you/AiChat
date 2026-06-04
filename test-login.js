// 模拟登录请求查看实际发送的数据
const testData = {
  username: 'fangyou',
  password: '******'
}

console.log('登录请求数据:')
console.log(JSON.stringify(testData, null, 2))
console.log('\n字段检查:')
console.log('- username 字段:', testData.username)
console.log('- password 字段:', testData.password)
console.log('- username 类型:', typeof testData.username)
console.log('- password 类型:', typeof testData.password)
