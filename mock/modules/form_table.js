import Mock from 'mockjs'

export default [
  // 获取表格数据
  {
    url: '/form_table/get_list',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: Mock.mock({
          'results|10': [{
            id: '@id',
            'status|1': ['published', 'draft', 'deleted'],
            name: '@cname',
            date: '@datetime',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          }],
          total: 100
        })
      }
    }
  },
  // 添加数据
  {
    url: '/form_table/add',
    type: 'post',
    response: config => {
      return {
        code: 200,
        message: '操作成功'
      }
    }
  },
  // 编辑数据
  {
    url: '/form_table/edit',
    type: 'post',
    response: config => {
      return {
        code: 200,
        message: '操作成功'
      }
    }
  },
  // 删除数据
  {
    url: '/form_table/delete',
    type: 'post',
    response: config => {
      return {
        code: 200,
        message: '操作成功'
      }
    }
  },
  // 获取数据详情
  {
    url: '/form_table/get_detail',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: Mock.mock({
          'results|10': [{
            id: '@id',
            'status|1': ['published', 'draft', 'deleted'],
            name: '@cname',
            date: '@datetime'
          }],
          total: 100
        })
      }
    }
  }
]
