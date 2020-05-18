<template>
  <div class="upload">
    <!-- 上传营业执照 start -->
    <div v-for="(item,index) in uploadList" :key="index" class="demo-upload-list">
      <template v-if="item.status === 'finished'">
        <img :src="fileUrlPrefix+'/'+item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)" />
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)" />
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info />
      </template>
    </div>
    <el-upload
      ref="upload"
      list-type="picture-card"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :format="['jpg','jpeg','png','bmp']"
      :max-size="3000"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      type="drag"
      name="uploadFile"
      :action="uploadParam.url+'?ticket='+uploadParam.ticket"
      :headers="uploadParam.headers"
      style="display: inline-block;width:58px;"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <!-- 上传营业执照 end -->
    <!-- 图片预览 start -->
    <el-dialog v-model="ImgModal.visible" title="查看图片">
      <img v-if="ImgModal.visible" :src="fileUrlPrefix+'/'+ImgModal.src" style="width: 100%">
    </el-dialog>
    <!-- 图片预览 end -->
  </div>
</template>
<script>
import API from '@/api/user'
export default {
  componentName: 'UploadList',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      uploadList: [], // 上传列表
      // 上传通用参数
      uploadParam: {
        url: '/mock/uploadFile',
        ticket: '',
        headers: { token: 12300 }
      },
      // 图片弹框预览
      ImgModal: {
        src: '',
        visible: false
      }
    }
  },
  computed: {
    defaultList() {
      var arr = this.value.map(item => {
        var fileName = item.split('/')
        return {
          name: fileName[fileName.length - 1],
          url: item
        }
      })
      console.group('this.value')
      console.dir(arr)
      console.groupEnd('this.value')

      return arr
    },
    fileUrlPrefix() {
      return this.$store.state.user.fileUrlPrefix
    }
  },
  watch: {
    defaultList() {
      this.$nextTick(() => {
        // 赋值后马上更新
        this.uploadList = this.$refs['upload'].fileList
      })
    }
  },
  mounted() {
    this.uploadList = this.$refs['upload'].fileList
  },
  activated() {},
  methods: {
    // 图片预览
    handleView(url) {
      this.ImgModal.src = url
      this.ImgModal.visible = true
    },
    // 图片删除
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList
      this.$refs['upload'].fileList.splice(fileList.indexOf(file), 1)
      this.emitEvent()
    },
    // 上传成功回调
    handleSuccess(res, file) {
      if (res.code === 0 && res.data.url) {
        file.url = res.data.url
      } else {
        this.handleRemove(file)
        this.$Notice.warning({
          title: '错误',
          desc: res.message
        })
      }
      this.emitEvent()
    },
    handleError(error) {
      this.$Notice.warning({
        title: '错误',
        desc: error
      })
    },
    // 上传格式错误
    handleFormatError(file) {
      this.$Notice.warning({
        title: '错误',
        desc: file.name + '文件格式不正确,请选择正确文件格式。'
      })
    },
    // 上传文件大小错误
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '错误',
        desc: file.name + ' 文件太大,不能超过3M.'
      })
    },
    // 上传前处理
    handleBeforeUpload() {
      const check = this.uploadList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传1张'
        })
        return false
      } else {
        return new Promise((resolve, reject) => {
          API.getAuthTicket().then(
            res => {
              if (res.code === 0) {
                this.uploadParam.ticket = res.data.ticket
                resolve(res.data)
              } else {
                this.$Message.error(this.$config.handleMessage(res))
                reject(res.message)
              }
            },
            err => {
              reject(err)
            }
          )
        })
      }
    },
    // 通知父组件更新列表
    emitEvent() {
      var imgUrls = this.uploadList.map(item => {
        return item.url
      })
      this.$emit('uploadevent', imgUrls)
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
