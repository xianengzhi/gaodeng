<template>
  <el-dialog title="详情" :visible.sync="visible" width="30%">
    <el-table :data="dataList">
      <el-table-column property="date" label="日期" width="150" />
      <el-table-column property="name" label="姓名" width="200" />
      <el-table-column property="address" label="地址" />
    </el-table>
  </el-dialog>
</template>

<script>
import { getDetail } from '@/api/form_table'
export default {
  data() {
    return {
      visible: false,
      id: null,
      dataList: [],
      tableLoading: false,
      pageParam: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {

  },

  methods: {
    // 初始化
    init(id) {
      this.visible = true
      this.id = id
      this.getDetail()
    },
    // 获取表格数据
    getDetail() {
      this.tableLoading = true
      getDetail({
        id: this.id,
        pageIndex: this.pageParam.currentPage
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.data.results
          this.pageParam.total = res.data.total
        } else {
          this.dataList = []
          this.pageParam.total = 0
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 每页数改变
    handleSizeChange(val) {
      this.pageParam.pageSize = val
      this.pageParam.currentPage = 1
      this.getDataList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.pageParam.currentPage = val
      this.getDataList()
    }

  }
}
</script>
