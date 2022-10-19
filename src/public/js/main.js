document.addEventListener('DOMContentLoaded', function () {

    // Delete food
    var productId;
    var deleteFoodForm = document.forms['delete-food-form'];
    var btnDeleteFood = document.getElementById('btn-delete-food');

    $('#deletefoodModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        productId = button.data('id');
    });

    btnDeleteFood.onclick = function(){
        deleteFoodForm.action = '/product/' + productId + '?_method=DELETE';
        deleteFoodForm.submit();
    }

    // Get ID of category to modal for editing
    $(document).on("click", ".open-modal-edit-category", function () {
        var categoryId = $(this).data('id');
        var categoryName = $('#' + categoryId + '-name').text();
        var categoryImage = $('#' + categoryId + '-image').attr('src');

        $('#edit-category-name').attr('value', categoryName);
        // document.getElementById('edit-category-name').value = categoryName;
        document.getElementById('editCategoryLabel').innerHTML = 'Edit Category <b> ' + categoryName + '</b>';
        document.getElementById('edit-category-image').setAttribute('src', categoryImage);

        // var btnEditCategory = document.getElementById('btn-edit-category')
        var editCategoryForm = document.forms['edit-category-form'];
        editCategoryForm.setAttribute('action', '/category/update/' + categoryId)
        // btnEditCategory.onclick = function(){
        //     editCategoryForm.action = '/category/' + categoryId + '?_method=PUT';
        //     editCategoryForm.submit();
        // }
    })

    // Get ID of product to modal for editing
    $(document).on("click", ".open-modal-edit-product", function () {
        var productId = $(this).data('id');
        var productName = $('#' + productId + '-name').text();
        // var productCategory = $('#' + productId + '-category-name').text();
        var productDesc = $('#' + productId + '-desc').text();
        var productPrice = $('#' + productId + '-price').text();
        var productImage = $('#' + productId + '-image').attr('src');

        document.getElementById('edit-product-name').value = productName;
        // document.getElementById('edit-product-category-name').value = productCategory;
        document.getElementById('edit-product-desc').value = productDesc;
        document.getElementById('edit-product-price').value = productPrice;
        document.getElementById('editProductLabel').innerHTML = 'Edit Food <b> ' + productName + '</b>';
        document.getElementById('edit-preview-image').setAttribute('src', productImage);

        var editProductForm = document.forms['edit-product-form'];
        editProductForm.setAttribute('action', '/product/update/' + productId)

        var editCategoryOptions = document.getElementsByClassName('edit-category-options');
        for (var i = 0; i < editCategoryOptions.length; i++) {
            if (editCategoryOptions[i].innerHTML == categoryName) {
                var selectedOptions = editCategoryOptions[i]
                selectedOptions.setAttribute('selected', 'selected')
                break;
            }
        }
    })
})
