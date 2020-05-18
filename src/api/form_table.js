import request from '@/utils/request'

// 获取表格数据
export function getDataList(params) {
  return request({
    url: '/mock/form_table/get_list',
    method: 'get',
    params
  })
}
// 添加数据
export function addForm(data) {
  return request({
    url: '/mock/form_table/add',
    method: 'post',
    data
  })
}
// 编辑数据
export function editForm(data) {
  return request({
    url: '/mock/form_table/edit',
    method: 'post',
    data
  })
}
// 删除数据
export function deleteData(data) {
  return request({
    url: '/mock/form_table/delete',
    method: 'post',
    data
  })
}

// 获取数据详情
export function getDetail(params) {
  return request({
    url: '/mock/form_table/get_detail',
    method: 'get',
    params
  })
}

