const xlsx = require('xlsx');
const path = require('path');
class fileExcel {
    exportExcel(data, workSheetColumnNames, workSheetName, filePath) {
        const workBook = xlsx.utils.book_new();
        const workSheetData = [
            workSheetColumnNames,
            ...data
        ];
        const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
        xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
        xlsx.writeFile(workBook, path.resolve(filePath));
    }

    exportProduct(products, workSheetColumnNames, workSheetName, filePath) {
        var i = 0;
        for (i; i < products.length; i++) {
            products[i] = [
                products[i]._id,
                products[i].name,
                products[i].new_price,
                products[i].old_price,
                products[i].quantity,
                products[i].quantity_sold,
                products[i].content,
                products[i].id_category,
                products[i].id_supplier,
                products[i].img,
                
            ];
        }
        var data = products;
        this.exportExcel(data, workSheetColumnNames, workSheetName, filePath);

    }
    exportCustomer(customers, workSheetColumnNames, workSheetName, filePath) {
        var i = 0;
        for (i; i < customers.length; i++) {
            customers[i] = [
                customers[i]._id,
                customers[i].name,
                customers[i].email,
                customers[i].numberPhone,
            ];
        }
        var data = customers;
        this.exportExcel(data, workSheetColumnNames, workSheetName, filePath);
    }
    exportCategory(categories, workSheetColumnNames, workSheetName, filePath) {
        var i = 0;
        for (i; i < categories.length; i++) {
            categories[i] = [
                categories[i]._id,
                categories[i].name,
            ];
        }
        var data = categories;
        this.exportExcel(data, workSheetColumnNames, workSheetName, filePath);
    }
    exportInvoice(invoices, workSheetColumnNames, workSheetName, filePath) {
        var i = 0;
        for (i; i < invoices.length; i++) {
            invoices[i] = [
                invoices[i]._id,
                invoices[i].id_order,
                invoices[i].id_product,
                invoices[i].quantity_pr,
                invoices[i].id_customer,
                new Date(invoices[i].date_to_order).toLocaleDateString(),
                invoices[i].total,
            ];
        }
        var data = invoices;
        this.exportExcel(data, workSheetColumnNames, workSheetName, filePath);
    }
    exportAccount(accounts, workSheetColumnNames, workSheetName, filePath) {
        var i = 0;
        for (i; i < accounts.length; i++) {
            accounts[i] = [
                accounts[i]._id,
                accounts[i].name,
                accounts[i].email,
                accounts[i].password,
                accounts[i].role,
                accounts[i].permission.toString()
            ];
        }
        var data = accounts;
        this.exportExcel(data, workSheetColumnNames, workSheetName, filePath);
    }
    exportSupplier(suppliers, workSheetColumnNames, workSheetName, filePath) {
        var i = 0;
        for (i; i < suppliers.length; i++) {
            suppliers[i] = [
                suppliers[i]._id,
                suppliers[i].name,
                suppliers[i].email,
                suppliers[i].img
            ];
        }
        var data = suppliers;
        this.exportExcel(data, workSheetColumnNames, workSheetName, filePath);
    }
}


module.exports = new fileExcel;