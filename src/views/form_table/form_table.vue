<template>
  <div class="form_table">
    <el-card>
      <el-form :inline="true" :model="dataForm">
        <el-form-item label="审批人">
          <el-input v-model="dataForm.user" placeholder="审批人" />
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="dataForm.region" placeholder="活动区域">
            <el-option label="全部" value="" />
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card-table">
      <el-row slot="header">
        <el-col :span="24">
          <el-button type="primary" @click="addHandleClick">添加</el-button>
          <el-button type="danger" @click="deleteHandleClick()">批量删除</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="dataList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="name"
          label="姓名"
        />
        <el-table-column
          prop="status"
          label="状态"
        />
        <el-table-column
          prop="date"
          label="日期"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="checkHandleClick(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteHandleClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next,sizes,jumper"
        :total="pageParam.total"
        :current-page.sync="pageParam.currentPage"
        :page-size="pageParam.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <add-or-edit ref="add_or_edit" />
    <detail ref="detail" />
  </div>
</template>

<script>
import AddOrEdit from './components/AddOrEdit'
import Detail from './components/Detail'
import { getDataList, deleteData } from '@/api/form_table'
export default {
  name: 'FormTable',
  components: { AddOrEdit, Detail },
  data() {
    return {
      dataForm: {
        user: '',
        region: ''
      },
      dataList: [],
      tableLoading: false,
      pageParam: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      multipleSelection: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 多选项改变
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getDataList() {
      this.tableLoading = true
      getDataList({
        ...this.dataFrom,
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
    },
    // 添加弹框
    addHandleClick() {
      this.$refs['add_or_edit'].init()
    },
    // 编辑弹框
    editHandleClick(row) {
      this.$refs['add_or_edit'].init(row)
    },
    // 查看弹框
    checkHandleClick(id) {
      this.$refs['detail'].init(id)
    },
    // 删除提示
    deleteHandleClick(row) {
      let rows = []
      console.log('row', row)
      if (row === undefined) {
        rows = this.multipleSelection
      } else {
        rows = [row]
      }
      if (rows.length === 0) {
        this.$message.error('至少选择一行数据删除！')
        return false
      }
      rows = rows.map(item => {
        return item.id
      })
      this.$confirm(`此操作将删除id为${rows.join(',')}的数据, 是否继续?`, '温馨提示提示', {
        customClass: 'section-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData()
      }).catch(() => {})
    },
    // 删除请求
    deleteData() {
      deleteData({
        ...this.dataForm
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.visible = false
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
