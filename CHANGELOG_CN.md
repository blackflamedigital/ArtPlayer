# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- art.play() 方法统一返回 Promise
- play 事件改为异步触发

## [4.5.2] - 2022-6-22

### Added
- 优化自动回放功能，让用户自行选择

## [4.5.0] - 2022-6-21

### Added
- 移除内置广告功能
- 新增广告插件

## [4.4.7] - 2022-6-13

### Added
- 兼容弹幕库 d.ts
- 更新依赖库

## [4.4.6] - 2022-6-11

### Added
- 添加弹幕库 d.ts
- 调整字幕字体大小参数
- 优化正则解析xml弹幕

## [4.4.5] - 2022-6-2

### Added
- 修复迷你模式时，主题色缺失的bug

## [4.4.3] - 2022-05-26

### Added
- 修复弹幕库销毁时，自定义挂载输入框的残留
- 修复迷你模式的尺寸计算错误

## [4.4.2] - 2022-05-20

### Added
- 移除播放器 UI 初始化的 video:loadedmetadata 事件
- 弹幕库暴露 load 方法，用于切换弹幕源
- 添加 error 图标，出现于视频加载错误达到上限后
- 修复 setting 多次初始化时产生的 bug

## [4.4.1] - 2022-05-17

### Added
- 添加 art.isInput 属性，当为 true 的时候不自动隐藏控制栏，如弹幕正在输入时
- 添加 art.isLock 属性，在移动端当为 true 的时候不能操作快进、开始和暂停
- 修复弹幕输入框的固定宽度 bug
- 设置面板支持 range 和 onRange 选项
- 添加 isAndroid 和 isIOS 工具函数
- 弹幕库添加 lockTime 选项，可自定义输入框的锁定时间
- 弹幕库添加 maxLength 选项，控制输入最大可输入字数
- 弹幕库添加 minWidth 选项，控制输入框最小宽度
- 弹幕库添加 maxWidth 选项，控制输入框最大宽度
- 弹幕库添加 mount 选项，控制输入框自定义挂载位置
- 弹幕库添加 beforeEmit 选项，控制弹幕发送前的校验
- 弹幕库添加 theme 选项，控制输入框自定义挂载的主题色

## [4.4.0] - 2022-05-15

### Added
- 设置面板支持 switch 和 onSwitch 选项
- 弹幕库插件添加设置面板和弹幕发送
- 弹幕库的选项添加默认模式和默认字号
- 弹幕库字号支持按播放器的百分百
- 修复翻转设置的图标缺失
- 默认播放器获取了焦点后，不会自动隐藏控制栏
- 删除字幕开关按钮，需要自行配置字幕开关