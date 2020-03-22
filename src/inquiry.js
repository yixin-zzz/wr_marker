const inquirer = require('inquirer');

const {
  handleOperation
} = require('./parser');

const qset1 = [
  {
    type: 'list',
    name: 'operation',
    message: '选择操作: ',
    choices: [
      {
        key: '0',
        name: '获取书架列表',
        value: '0'
      },
      {
        key: '1',
        name: '获取书本个人划线',
        value: '1'
      },
      {
        key: '2',
        name: '获取书本热门划线',
        value: '2'
      }
    ]
  },
  {
    type: 'input',
    name: 'bookId',
    message: '请输入书本的id: ',
    when: function (answers) {
      return answers.operation !== '0';
    }
  }
]

const qset2 = [
  {
    type: 'confirm',
    name: 'continue',
    message: '是否继续操作: ',
    default: false
  }
]

const start = () => {
  return inquirer.prompt(qset1)
    .then(result => {
      return result;
    })
    .then(res => {
      const { operation, ...rest } = res;
      return handleOperation(operation, rest);
    })
    .then(() => {
      return forward();
    })
    .then((res) => {
      if (res) {
        start();
      } else {
        console.log('拜拜，下次见');
      }
    })
}

const forward = () => {
  return inquirer.prompt(qset2)
  .then(result => {
    return result.continue;
  })
}

module.exports = {
  start
}