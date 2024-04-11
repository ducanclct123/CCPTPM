export const removeAccents = (str) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export const numberWithCommas = (x) => {
    // Sử dụng toFixed để giữ chính xác 2 số thập phân
    const fixedNumber = parseFloat(x).toFixed(2);
    
    // Loại bỏ số 0 không mong muốn ở phía sau
    const formattedNumber = fixedNumber.replace(/\.?0+$/, '');

    // Sử dụng regular expression để thêm dấu phẩy phân cách hàng nghìn
    return formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};