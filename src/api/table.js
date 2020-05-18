import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/mock/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
