# er-route

让[ER](https://github.com/ecomfe/er)支持[express](http://expressjs.com/)风格的路由。

## 使用方法

### 安装

    npm i -g edp
    edp import er-route

### 启用

在 **所有`controller.registerAction`调用之前** 执行一下代码：

    require('er-route').enable();

## 路由规则

### 普通路由

和ER的路由一样，通过对URL的完全匹配来确定配置：

    {
        path: '/user/list',
        type: 'user/List'
    }

`er-route`保持与`er`的兼容性，普通路由的表现与原先一致。

### 路由参数

通过`:foo`的形式在路径中增加参数，如：

    {
        path: '/users/:id',
        type: 'user/Form'
    }

当路径为`/users/123`时，会加载`user/Form`模块，同时在`Model`中可以获取`id`属性，与URL中添加`~id=123`效果相同。

路径中也可以带有多个参数：

    {
        path: /users/:type/:id',
        type: 'user/Form'
    }

额外的：

- 可以使用正则来限制参数，如：`path: /users/:id([0-9+])`
- 可以增加`?`指定参数为可选，如：`path: /users/:id/:type?`匹配`/users/123`和`/users/123/edit`
- 可以通过在规则最后增加`*`指定URL后面有任何内容均匹配上，如：`path: /users/:id/*`匹配`/users/123/edit`或者`/users/123/edit/name`等

### 同路径配置

允许一个`path`对应多个配置，通过`controller.checkAuthority`进行判断，根据注册的顺序，第一个能通过`controller.checkAuthority`的配置将被返回，如：

    {
        path: '/users/:id',
        type: 'user/Edit',
        authority: 'EDIT_USER'
    }


    {
        path: '/users/:id',
        type: 'user/VIEW',
        authority: 'VIEW_USER'
    }

这2个配置先后注册，针对`/users/123`这个URL，当用户有`EDIT_USER`权限时会进入修改页，没有则根据是否有`VIEW_USER`权限进入查看页或无权限错误页。

### 路径跳转

当配置了`movedTo`后，可以在`movedTo`的值中通过`${foo}`的形式添加占位符，跳转将填充这些占位符后进行，如：

    {
        path: '/user/edit',
        movedTo: '/users/${id}'
    }

    {
        path: '/users/:id',
        type: 'user/Form'
    }

当访问`/user/edit~id=123`时，会跳转至`/users/123`并匹配第2相配置，加载`user/Form`模块。
