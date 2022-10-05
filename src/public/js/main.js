document.addEventListener('DOMContentLoaded', function(){
    // Get ID of product to modal for editing
    $(document).on("click", ".open-modal-edit-product", function () {
        var productId = $(this).data('id');
        var productName = $('#' + productId + '-name').text();
        var productDesc = $('#' + productId + '-desc').text();
        var productPrice = $('#' + productId + '-price').text();

        $('#edit-product-name').attr('value', productName);
        document.getElementById('edit-product-desc').value = productDesc;
        document.getElementById('edit-product-price').value = productPrice;
        document.getElementById('editProductLabel').innerHTML = 'Edit food <b> '+productName+'</b>';
        // document.getElementById('edit-product-image').value = productImage;

            
        // var btnEditProduct = document.getElementById('btn-edit-product')
        var editProductForm = document.forms['edit-product-form'];
        editProductForm.setAttribute('action', '/product/update/' + productId)
        // btnEditProduct.onclick = function(){
            // editProductForm.action = '/product/update/' + productId;
        //     editProductForm.submit();
        // }
    })
})