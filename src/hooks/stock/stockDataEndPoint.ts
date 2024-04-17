import { EndPointsTypes } from "@/common/types/routers/endPoints.types";

export const stockEndPoint = {
    SUPPLIERS: {
        url: EndPointsTypes['STOCK_SUPPLIERS_ENDPOINT'],
        queryParams: 'Suppliers',
        updateSucess: "Suppliers updated successfully!",
        updateError: "Suppliers update failed!",
        deleteSucess: "Suppliers deleted successfully!",
        deleteError: "Suppliers delete failed!",
        createSucess: 'Suppliers created successfully!',
        createError: "Suppliers creation failed!",
    },
    ITEM: {
        url: EndPointsTypes['STOCK_ITEM_ENDPOINT'],
        queryParams: 'Item',
        updateSucess: "Item updated successfully!",
        updateError: "Item update failed!",
        deleteSucess: "Item deleted successfully!",
        deleteError: "Item delete failed!",
        createSucess: 'Item created successfully!',
        createError: "Item creation failed!",
    },
    SUPPLIER_BANK: {
        url: EndPointsTypes['STOCK_SUPPLIER_BANK_ENDPOINT'],
        queryParams: 'SupplierBank',
        updateSucess: "Supplier Bank updated successfully!",
        updateError: "Supplier Bank update failed!",
        deleteSucess: "Supplier Bank deleted successfully!",
        deleteError: "Supplier Bank delete failed!",
        createSucess: 'Supplier Bank created successfully!',
        createError: "Supplier Bank creation failed!",
    },
    SUPPLIER_AUTO_ORDER: {
        url: EndPointsTypes['STOCK_SUPPLIER_AUTO_ORDER_ENDPOINT'],
        queryParams: 'SupplierAutoOrder',
        updateSucess: "Supplier Auto Order updated successfully!",
        updateError: "Supplier Auto Order update failed!",
        deleteSucess: "Supplier Auto Order deleted successfully!",
        deleteError: "Supplier Auto Order delete failed!",
        createSucess: 'Supplier Auto Order created successfully!',
        createError: "Supplier Auto Order creation failed!",
    },
    SUPPLIER_CONTACT: {
        url: EndPointsTypes['STOCK_SUPPLIER_CONTACT_ENDPOINT'],
        queryParams: 'SupplierContact',
        updateSucess: "Supplier Contact updated successfully!",
        updateError: "Supplier Contact update failed!",
        deleteSucess: "Supplier Contact deleted successfully!",
        deleteError: "Supplier Contact delete failed!",
        createSucess: 'Supplier Contact created successfully!',
        createError: "Supplier Contact creation failed!",
    },
    CATEGORY: {
        url: EndPointsTypes['STOCK_CATEGORY_ENDPOINT'],
        queryParams: 'Category',
        updateSucess: "Category updated successfully!",
        updateError: "Category update failed!",
        deleteSucess: "Category deleted successfully!",
        deleteError: "Category delete failed!",
        createSucess: 'Category created successfully!',
        createError: "Category creation failed!",
    },
    SUB_CATEGORY: {
        url: EndPointsTypes['STOCK_SUB_CATEGORY_ENDPOINT'],
        queryParams: 'SubCategory',
        updateSucess: "Sub Category updated successfully!",
        updateError: "Sub Category update failed!",
        deleteSucess: "Sub Category deleted successfully!",
        deleteError: "Sub Category delete failed!",
        createSucess: 'Sub Category created successfully!',
        createError: "Sub Category creation failed!",
    },
    PRODUCT: {
        url: EndPointsTypes['STOCK_PRODUCT_ENDPOINT'],
        queryParams: 'Product',
        updateSucess: "Product updated successfully!",
        updateError: "Product update failed!",
        deleteSucess: "Product deleted successfully!",
        deleteError: "Product delete failed!",
        createSucess: 'Product created successfully!',
        createError: "Product creation failed!",
    },
    ORDER: {
        url: EndPointsTypes['STOCK_ORDER_ENDPOINT'],
        queryParams: 'Order',
        updateSucess: "Order updated successfully!",
        updateError: "Order update failed!",
        deleteSucess: "Order deleted successfully!",
        deleteError: "Order delete failed!",
        createSucess: 'Order created successfully!',
        createError: "Order creation failed!",
    },
    ORDER_CONTROLLER: {
        url: EndPointsTypes['STOCK_ORDER_CONTROLLER_ENDPOINT'],
        queryParams: 'OrderController',
        updateSucess: "Order Controller updated successfully!",
        updateError: "Order Controller update failed!",
        deleteSucess: "Order Controller deleted successfully!",
        deleteError: "Order Controller delete failed!",
        createSucess: 'Order Controller created successfully!',
        createError: "Order Controller creation failed!",
    },
}