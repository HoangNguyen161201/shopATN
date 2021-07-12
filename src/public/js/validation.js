function validation(option) {
    // kiểm tra thử nó có thông báo lỗi hay koong
    function check(form, e) {
        if (e.element) {
            var element = form.querySelector(e.element);
            element.onblur = function () {
                var test1;
                
                if(e.other){
                    test1 = e.test(element.value,e.other);
                }
                else{

                    test1 = e.test(element.value);
                }
                // kiem tra neu co loi thi thong bao
                if (test1) {
                    if (element.nextElementSibling.innerHTML == '') {
                        element.nextElementSibling.innerHTML = test1;
                        element.style.border = '1px solid red';
                    }
                } else {
                    element.style.cssText = '';
                    element.nextElementSibling.innerHTML = '';
                }
            }
            // khi nhap lai thi het do va thong bao
            element.oninput = function () {
                element.style.cssText = '';
                element.nextElementSibling.innerHTML = '';
            }
        }
    }
    if (option.form) {
        console.log('thanh cong vao form');
        var form = document.querySelector(option.form);
        form.onsubmit = function () {
            var isvalit = true;
            option.rule.forEach(e => {
                if (e.element) {
                    var element = form.querySelector(e.element);
                    var test1;
                    if(e.other){
                        test1 = e.test(element.value,e.other);
                    }
                    else{
    
                        test1 = e.test(element.value);
                    }
                    if (test1) {
                        console.log('false');
                        if (element.nextElementSibling.innerHTML == '') {
                            element.nextElementSibling.innerHTML = test1;
                            element.style.border = '1px solid red';
                        }
                        isvalit = false;
                        // khi nhap lai thi het do va thong bao
                        element.oninput = function () {
                            element.style.cssText = '';
                            element.nextElementSibling.innerHTML = '';
                        }
                    } else {
                        element.style.cssText = '';
                        element.nextElementSibling.innerHTML = '';
                    }
                }
            })
            // kiem tra neu co loi thi khong duoc submit
            if (isvalit == true) {
                return true;
            } else {
                return false;
            }
        }
        if (option.rule) {
            console.log('thanh cong vao rule');
            option.rule.forEach(e => {
                // gọi thông báo lỗi
                check(form, e);
            })
        }
    }
}
// kiểm tra thông tin có bị trống hay là không
validation.isrequire = function (element) {
    if (element) {
        var r = document.querySelector(element);
        return {
            element: element,
            test: function (value) {
                return value.trim() ? undefined : 'This field cannot be left blank';
            }
        }
    }
}
// kiểm tra email có hợp lệ hay là không
validation.checkemail = function (element) {
    if (element) {
        var r = document.querySelector(element);
        return {
            element: element,
            test: function (value) {
                const checkEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                return checkEmail.test(String(value).toLowerCase()) ? undefined : 'Invalid email';
            }
        }
    }
}
// kiểm tra co phai kieu number hay khong
validation.isnumber = function (element) {
    if (element) {
        var r = document.querySelector(element);
        return {
            element: element,
            test: function (value) {
                const checkNumber = new RegExp('^[0-9]+$');

                return checkNumber.test(value) ? undefined : 'Characters must be numbers from 0-9';
            }
        }
    }
}
// kiểm tra có dữ liệu
validation.other = function (element,e) {
    // check min
    return{
        element:element,
        other: e,
        test: function(value,e){
            if(e[0] == 'min'){
                var r = document.querySelector(element).value;
                return value.trim().length >= Number(e[1]) ? undefined: 'This field must be at least '+e[1]+' characters';
            }
        }
    }
}
// kiểm tra money
validation.ismoney = function (element) {
    if (element) {
        var r = document.querySelector(element);
        return {
            element: element,
            test: function (value) {
                const checkNumber = new RegExp('^\d{0,9}(\.\d{0,9}){0,1}$');
                return checkNumber.test(value) ? undefined : 'Invalid character input.';
            }
        }
    }
}