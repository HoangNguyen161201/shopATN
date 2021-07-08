
class checkAc{
    checkAccount(x){
        if(x.admin){
            return [1,[x.admin]];
        }
        else{
            if(x.staff){
                return [2,x.staff];
            }
            else{
                return 0;
            }
        }
    }
    logged(x){
        if(x.admin || x.staff){
            return 1;
        }
        else{
            return 0;
        }
    }
    avoidStaff(x,y){
        if(x.staff){
            return y.redirect('/login');
        }
        else{
            return 0;
        }
    }
    checkAllow(r,page){
        if(r[0] == 1 || (r[0] == 2 && r[1][2].includes(page))){
            return true;
        }
        else{
            return false;
        }
    }
}
module.exports = new checkAc;