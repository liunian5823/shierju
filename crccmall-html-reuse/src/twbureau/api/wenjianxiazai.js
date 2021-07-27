import httpsapi from '@/twbureau/api/api';
export default {
    exports(url, param) {
        console.log(url)
        httpsapi
          .File(url, param)
          .then(response => {
            console.log(response)
            // var a = response.headers["content-disposition"].split(
            //   "filename*=UTF-8''"
            // )[1];
            var title = decodeURIComponent('循环物资台帐表.xls');
            var url = window.URL.createObjectURL(new Blob([response]));
            var link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
    
            link.setAttribute("download", title);
            document.body.appendChild(link);
            link.click();
          })
          .catch(err => {
            console.log(err);
          });
      },
}