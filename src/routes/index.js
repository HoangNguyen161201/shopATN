// Connect other routers and controllers
const managerProducts = require('./managerProducts');
const managerCategories = require('./managerCategories');
const managerSuppliers = require('./managerSuppliers');
const managerCustomers = require('./managerCustomers');
const managerInvoices = require('./managerInvoices');
const managerAccount = require('./managerAccount');
const controllerChat =  require('../app/controllers/controllerChat');
const controllerHome = require('../app/controllers/controllerHome');
const controllerExcel = require('../app/controllers/controllerExcel');
const heleperCheckout = require('../app/helpers/checkAccount');
const login = require('./login');

function mainroute(app){
    
    // middleware
    var myLogger = function (req, res, next) {
        if (heleperCheckout.logged(req.cookies) != 1){
            res.redirect('/login');
        }
        else{
            next();
        }
    }

    app.use([
        '/managerProduct',
        '/managerCategories',
        '/managerSuppliers',
        '/managerInvoices',
        '/managerAccounts',
        '/exportData',
        '/chat'
    ],myLogger);

    app.get('/',controllerHome.show);
    // Specify the beginning of the url to the routers 
    app.use('/managerProduct',managerProducts);
    app.use('/managerCategories',managerCategories);
    app.use('/managerSuppliers',managerSuppliers);
    app.use('/managerCustomers',managerCustomers);
    app.use('/managerInvoices',managerInvoices);
    app.use('/managerAccounts',managerAccount);
    app.use('/login',login);
    app.get('/chat',controllerChat.show);
    // Process and save excel file to the server
    app.get('/exportData1',controllerExcel.exportData);
    // Display the export excel page
    app.get('/exportData',controllerExcel.show);
    // 404
    app.get('*',(req,res)=>{
        res.render('404',{layout:false});
    })

}

module.exports = mainroute;