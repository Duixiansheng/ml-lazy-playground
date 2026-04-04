# 对先生小课堂

这是整理好后可直接上传到 GitHub 仓库、用于 GitHub Pages 部署的静态网站文件夹。

## 这个文件夹里包含什么

- `index.html`
- `styles.css`
- `app.js`

## 怎么发布到 GitHub Pages

1. 在 GitHub 新建一个仓库。
2. 把这个文件夹里的文件上传到仓库根目录。
3. 打开仓库的 `Settings` -> `Pages`。
4. 在 `Build and deployment` 里选择：
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`（或你的默认分支）
   - `Folder`: `/ (root)`
5. 保存后等待几十秒到几分钟，GitHub 会给你一个公开网址。

## 说明

这个版本是纯静态网页，不需要 Python 服务端，适合直接托管到 GitHub Pages。
