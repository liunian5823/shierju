import { getUrlByParam } from '@/utils/urlUtils';
import { filterNull } from '@/framework/axios';

function exportFile(url, param) {
    window.location.href = SystemConfig.configs.axiosUrlQM + getUrlByParam(url, filterNull(param))
}

export {
    exportFile
}