const axios = require('axios');

// 测试登录请求
const loginData = {
  username: 'fangyou',
  password: '123456'  // 假设密码
};

console.log('=== 发送到后端的数据 ===');
console.log(JSON.stringify(loginData, null, 2));
console.log('\n=== 数据验证 ===');
console.log('username 存在:', !!loginData.username);
console.log('password 存在:', !!loginData.password);
console.log('username 长度:', loginData.username.length);
console.log('password 长度:', loginData.password.length);

// 检查是否有额外空格
console.log('\n=== 空格检查 ===');
console.log('username 前后有空格:', loginData.username !== loginData.username.trim());
console.log('password 前后有空格:', loginData.password !== loginData.password.trim());
console.log('username trim后:', `"${loginData.username.trim()}"`);
