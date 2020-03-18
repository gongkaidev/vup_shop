布局的传统解决方案 基于盒装模型 ，依赖display+position+float 它对于那些特殊模型非常不方便 比如 垂直居中就不容易实现

.box{
    display:flex;
}
设置flex布局以后 子元素的float clear vertical-align 将会失效

容器属性
flex-direction row|row|column|column
flex-wrap nowrap|wrap|wrap-reverse 换行
flex-flow  row nowrap
justify-content 对齐方式 主轴 水平
flex-start flex-end center space-between space-around
左对齐  右对齐 中间对齐  两端对齐 项目之间间隔相等 每个项目两侧间隔相等

align-items 在交叉轴上如何对齐 竖直
flex-start 从上到下 
flex-end center baseline stretch auto占满容器

align-content
