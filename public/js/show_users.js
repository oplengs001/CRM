 $(document).on('ready', function(event) {
    $('#sample_1').on('click', '#deletebtn', function() {
        var account_id = $(this).attr("data-id");
        $.ajax({
            url: '/admin/delete_team/post/' + account_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response){
                window.location.href = '/admin/accounts';
            }
        });
    });
});