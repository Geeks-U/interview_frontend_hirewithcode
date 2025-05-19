### Scripts 说明

* `start`：启动本地开发环境
* `build`：打包生产环境（可通过 `app.json` 写入打包配置）
* `deploy`：部署到 Vercel

  * 可通过 `vercel.json` 写入部署配置
  * 执行 `vercel --prod`，会在当前目录查找 `.vercel` 文件夹以识别部署目标项目
  * 若未找到 `.vercel`，Vercel 会新建一个默认项目（通常命名为根目录名称）
  * `.vercel` 文件夹需通过 `vercel link` 命令生成
  * 该命令会上传执行路径下所有文件，所以需要切换到dist目录下执行或者通过配置文件写入部署上传的目录

---