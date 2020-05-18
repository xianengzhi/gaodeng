<template>
  <el-dialog :title="title" :visible.sync="visible" width="30%">
    <el-form ref="data_form" :model="dataForm" :rules="dataFormRules" label-width="100px">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="dataForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="dataForm.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="活动时间" prop="date1">
        <el-col :span="11">
          <el-date-picker v-model="dataForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="dataForm.date2" placeholder="选择时间" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="dataForm.delivery" />
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="dataForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type" />
          <el-checkbox label="地推活动" name="type" />
          <el-checkbox label="线下主题活动" name="type" />
          <el-checkbox label="单纯品牌曝光" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="dataForm.resource">
          <el-radio label="线上品牌商赞助" />
          <el-radio label="线下场地免费" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="营业执照：" prop="licenseImgPath">
        <upload-list
          v-model="dataForm.licenseImgPath"
          @uploadevent="updateLicenseImgPath"
        />
        <div class="brand-text">点击添加图片或将图片拖拽至此处上传，支持jpg / jpeg / png / bmp格式，大小不超过3M</div>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input v-model="dataForm.desc" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import UploadList from './UploadList'
import { addForm, editForm } from '@/api/form_table'
export default {
  components: {
    UploadList
  },
  data() {
    return {
      visible: false,
      from: 'add',
      dataForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        licenseImgPath: [] // 营业执照图片
      },
      dataFormRules: {
        name: [
          { required: true, message: '活动名称为必填', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请至少选择一个活动区域', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.from === 'add' ? '添加' : '编辑'
    }
  },

  methods: {
    // 初始化
    init(row) {
      this.visible = true
      this.from = row === undefined ? 'add' : 'edit'
      this.$nextTick(() => {
        this.$refs['data_form'].resetFields()
        if (this.from === 'edit') {
          this.id = row.id
          this.dataForm = Object.assign({}, row)
        }
      })
    },
    // 提交数据
    submit() {
      this.$refs['data_form'].validate(valid => {
        if (valid) {
          if (this.from === 'add') {
            console.log(this)
            this.addForm()
          } else {
            this.editForm()
          }
        }
      })
    },
    // 添加请求
    addForm() {
      addForm({
        ...this.dataForm
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.visible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 编辑请求
    editForm() {
      editForm({
        id: this.id,
        ...this.dataForm
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.visible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 更新营业执照图片
    updateLicenseImgPath(res) {
      this.dataForm.licenseImgPath = res
    }

  }
}
</script>
