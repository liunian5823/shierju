const menuList = [
    {
        title: '首页',
        key: '/home'
    },
    {
        title: 'demo',
        key: '/demo'
    },
    {
        title: '表单',
        key: '/account',
        children: [
            {
                title: '注册',
                key: '/account/reg'
            },
        ]
    },
    {
        title: '登录',
        key: '/login'
    },
    
];
export default menuList;