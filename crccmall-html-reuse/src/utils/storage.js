const session = {
    // 获取session
    getItem: function (key) {
        return window.sessionStorage.getItem(key);
    },

    // 设置session
    setItem: function (key, data) {
        const str = JSON.stringify(data);
        window.sessionStorage.setItem(key, str)
    },

    // 移除session
    removeItem: function (key) {
        window.sessionStorage.removeItem(key)
    },

    // 清除session
    clear: function () {
        window.sessionStorage.clear()
    }
}

const local = {
    // 获取local
    getItem: function (key) {
        return window.localStorage.getItem(key);
    },

    // 设置local
    setItem: function (key, data) {
        const str = JSON.stringify(data);
        window.localStorage.setItem(key, str)
    },

    // 移除local
    removeItem: function (key) {
        window.localStorage.removeItem(key)
    },

    // 清除local
    clear: function () {
        window.localStorage.clear()
    }
}

export { session, local };