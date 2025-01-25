$(function(){

    setTimeout(
      function(){
        load_sidebar(2);
        // Añadir event listener para cuando se haga clic en el nombre del usuario
        $('.user-edit').on('click', function() {
          let userId = $(this).data('id');    // Obtener el ID del usuario
          get_user_info(userId);
        });
      }, 
    150);

    //--START new_order2.html

    $('#btn_new_order2_save').click(function(){
      //window.location.replace("new_order1.html");
      save_new_order1_and_2();
    })
    //--FINISH new_order2.html

    //--START button Sign in from index.html
    $('#sign-in').click(function(){
      sign_in();
    });

    //--FINISH button Sign in from index.html

    //--START button Save role from m_roles.html
    $('#btn-save-roles-maintenance').click(function(){
      role_page_save_button();
    });
    //--FINISH button Save role from m_roles.html

    //--START button Save user from m_users.html
    $('#btn-save-users-maintenance').click(function(){
      users_page_save_button();
    });
    //--FINISH button Save user from m_users.html

    //--START button Save company from m_companies.html
    $('#btn-save-companies-maintenance').click(function(){
      companies_page_save_button();
    });
    //--FINISH button Save company from m_companies.html

    //--START button Save carriers from m_carriers.html
    $('#btn-save-carriers-maintenance').click(function() {
      carriers_page_save_button();
    });
    //--FINISH button Save role from m_carriers.html

    //--START button Save referral from m_referral_source.html
    $('#btn-save-referral-source').click(function() {
      referral_source_save_button();
    });
    //--FINISH button Save referral from m_referral_source.html

    //--START button Save customer from m_customer.html
    $('#btn-save-customer').click(function() {
      customer_save_button();
    });
    //--FINISH button Save customer from m_customer.html

    //--START button Next from new_order1.html
    // Guardar datos y pasar a la siguiente página
  $('#btn_new_order1_next').click(function(){
    // Crear un objeto con los datos del formulario
    var formData = {
      phone: $('#new_order1_phone').val(),
      name: $('#name').val(),
      company_name: $('#company_name').val(),
      customer_asigned_to: $('#customer_asigned_to').val(),
      first_available_pickup_date: $('#first_available_pickup_date input').val(),
      transport_type: $('#new_order1_tranport_type').val(),
      referral_source: $('#customer-referral-select').val(), //NUEVO CAMBIO PARA GUARDAR EL referral source de la orden
      assigned_user: $('#new_order1_assigned_user').val(),
      assigned_team: $('#new_order1_assigned_team').val()
    };

    // Convertir el objeto a un string JSON y guardarlo en sessionStorage
    sessionStorage.setItem('newOrderData', JSON.stringify(formData));

    // Redirigir a la siguiente página
    window.location.replace("new_order2.html");
  });
  //--FINISH button Next from new_order1.html

  // Event listener for role change
    $('#role-select').on('change', function() {
      load_role_permissions($(this).val());
    });

    // Event listener for save button on m_permissions.html
    $('#save-permissions').click(function() {
      save_permissions();
    });

    $('#btn-save-vehicle').click(function() {
        vehicles_save_button();
    });

    // Event listener para el botón de guardar
    $('#btn-save-interested-carrier').click(function() {
        interested_carrier_save_button();
    });

    $('#btn-save-driver').click(function() {
        drivers_save_button();
    });

    $('#btn-save-insurance-policy').click(function() {
        insurance_policy_save_button();
    });

    // CALL INTERNAL NOTES MODAL
    $('#internal-notes-btn').click(function() {
        internal_notes_new_button();
    });

    // CALL INTERNAL NOTES SAVE BUTTON IN MODAL
    $('#save-note-btn').click(function() {
        internal_notes_modal_save_button();
    });

    // CALL INTERNAL NOTES LOADING
    $('#custom-internal-notes-tab').click(function(){
        load_internal_notes();
    });

    // CALL ORDER VIEW SAVE BUTTON
    $('#btn-save-order').on('click', saveOrderFunction);

    // CALL ORDER VIEW VEHICLES MODAL
    $('#vehicles-btn-new').click(function(){
        order_vehicles_new_button();
    });

    // Función para cargar los detalles del vehículo seleccionado
    $('#order-modal-select-vehicle').on('change', getVehicleDetails);

    // Función para agregar un vehiculo a la orden
    $('#order-modal-save-vehicle-btn').click(function() {
        save_order_vehicle();
    });

});

function new_function(){
    
  var email = $('#email').val();
  var pass = $('#password').val();

  if(email == '' || pass == ''){
    alert('You have to enter email and password!');
  }else{
    $.ajax({
      contentType: "application/x-www-form-urlencoded",
      type: "POST",
      url: "../dist/php/services.php",
      data: ({
        option: 'sign_in',
        email,
        pass                   
      }),
      dataType: "json",        
      success: function(r) {                                                   
        if(r.error == ''){
          alert(r.message);
          window.location.replace('dashboard.html');
        }else{
          alert(r.error);
          window.location.replace('index.html');
        }
      }    
    });
  }
}

function loadOrderInterestedCarriers(orderId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'load_order_interested_carriers',
            order_id: orderId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const table = $('#order-interested-carriers-table').DataTable();
                table.clear();
                
                response.data.forEach(carrier => {
                    table.row.add([
                        carrier.carrier_name,
                        carrier.carrier_status,
                        carrier.contact,
                        carrier.phone,
                        carrier.pickup_date,
                        carrier.delivery_date,
                        `<button class="btn btn-sm btn-danger delete-interested-carrier" data-id="${carrier.id}">
                            <i class="fas fa-trash"></i>
                        </button>`
                    ]);
                });
                
                table.draw();
                
                // Add delete event listener
                $('.delete-interested-carrier').on('click', function() {
                    const carrierId = $(this).data('id');
                    deleteInterestedCarrier(carrierId, orderId);
                });
            }
        }
    });
}

function deleteInterestedCarrier(carrierId, orderId) {
    if (confirm('Are you sure you want to delete this carrier?')) {
        $.ajax({
            type: "POST",
            url: "../dist/php/services.php",
            data: {
                option: 'delete_interested_carrier',
                carrier_id: carrierId,
                order_id: orderId
            },
            dataType: "json",
            success: function(response) {
                if (response.error === '') {
                    loadOrderInterestedCarriers(orderId);
                    alert(response.message);
                } else {
                    alert(response.error);
                }
            }
        });
    }
}

function saveOrderInterestedCarrier(orderId) {
    const carrierData = {
        order_id: orderId,
        carrier_id: $('#ic-carrier-select').val(),
        carrier_status: $('#ic-status').val(),
        carrier_pay: $('#ic-carrier-pay').val().replace('$', '').trim(),
        special_instructions: $('#ic-special-instructions').val(),
        internal_note: $('#ic-internal-note').val(),
        pickup_date: $('#ic-pickup-date-input').val(),
        pickup_window: $('#ic-pickup-window').val(),
        delivery_date: $('#ic-delivery-date-input').val(),
        delivery_window: $('#ic-pickup-window').val(),
        insurance_policy_id: $('#ic-insurance-policy').val(),
        driver_id: $('#ic-driver').val()
    };

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_order_interested_carrier',
            carrier_data: JSON.stringify(carrierData)
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                $('#interested-carrier-modal').modal('hide');
                loadOrderInterestedCarriers(orderId);
                alert(response.message);
            } else {
                alert(response.error);
            }
        }
    });
}

function savePaymentFromOrder(paymentData) {
    if (!paymentData.order_id || !paymentData.payment_date || !paymentData.payment_type || 
        !paymentData.payment_direction || !paymentData.payment_amount) {
        alert('Please fill in all required fields!');
        return;
    }

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_payment',
            payment_data: JSON.stringify(paymentData)
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                $('#payment-modal').modal('hide');
                loadPaymentsByOrder(paymentData.order_id);
                clearPaymentModalForm();
            } else {
                alert(response.error);
            }
        }
    });
}

function clearPaymentModalForm() {
    $('#payment-date-input').val('');
    $('#payment-type').val('').trigger('change');
    $('#payment-direction').val('').trigger('change');
    $('#payment-amount').val('');
    $('#payment-identification').val('');
    $('#payment-note').val('');
}

function deletePayment(paymentId) {
    if (confirm('Are you sure you want to delete this payment? This action cannot be undone.')) {
        $.ajax({
            type: "POST",
            url: "../dist/php/services.php",
            data: {
                option: 'delete_payment',
                payment_id: paymentId
            },
            dataType: "json",
            success: function(response) {
                if (response.error === '') {
                    alert(response.message);
                    load_payments();

                    const orderId = $('#order_view_idOrder').text();
                    loadPaymentsByOrder(orderId);
                } else {
                    alert(response.error);
                }
            }
        });
    }
}

function load_vehicle_action_buttons_functions(){
    $('.delete-vehicle').click(function(){
        if (confirm('Are you sure you want to remove this vehicle?')) {
           const vehicleId = $(this).data('id');
           const orderId = $('#order_view_idOrder').text();
           
           $.ajax({
               type: "POST",
               url: "../dist/php/services.php",
               data: {
                   option: 'delete_order_vehicle',
                   order_id: orderId,
                   vehicle_id: vehicleId
               },
               dataType: "json",
               success: function(response) {
                   if (response.error === '') {
                       loadOrderVehicles();
                   } else {
                       alert(response.error);
                   }
               }
           });
       }
    });
}

// Función para cargar los vehículos de la orden
function loadOrderVehicles() {
   const orderId = $('#order_view_idOrder').text();
   
   $.ajax({
       type: "POST",
       url: "../dist/php/services.php",
       data: {
           option: 'load_order_vehicles',
           order_id: orderId
       },
       dataType: "json",
       success: function(response) {
           if (response.error === '') {
               let html = '';
               response.data.forEach(vehicle => {
                   const inopChecked = vehicle.inop == 1 ? 'checked' : '';
                   html += `
                       <tr>
                           <td>${vehicle.model_year}</td>
                           <td>${vehicle.make}</td>
                           <td>${vehicle.model}</td>
                           <td>${vehicle.vehicle_type}</td>
                           <td>${vehicle.vin || ''}</td>
                           <td>${vehicle.plate_no || ''}</td>
                           <td>${vehicle.lot_no || ''}</td>
                           <td>${vehicle.color || ''}</td>
                           <td>
                               <div class="custom-control custom-switch custom-switch-on-success">
                                   <input type="checkbox" class="custom-control-input" disabled ${inopChecked}>
                                   <label class="custom-control-label"></label>
                               </div>
                           </td>
                           <td>$${parseFloat(vehicle.vehicle_tariff).toFixed(2)}</td>
                           <td>
                               <button class="btn btn-sm btn-danger delete-vehicle" data-id="${vehicle.id}">
                                   <i class="fas fa-trash"></i>
                               </button>
                           </td>
                       </tr>`;
               });
               $('#vehicles-table tbody').html(html);
               load_vehicle_action_buttons_functions();
           } else {
               alert(response.error);
           }
       }
   });
}

function save_order_vehicle(){
    const orderId = $('#order_view_idOrder').text();
    const vehicleData = {
        vehicle_id: $('#order-modal-select-vehicle').val(),
        carrier_pay: $('#carrier_pay').val().replace('$', '').trim(),
        broker_fee: $('#broker_pay').val().replace('$', '').trim(),
        wrecker_fee: $('#wrecker_pay').val().replace('$', '').trim(),
        other_fee: $('#other_pay').val().replace('$', '').trim(),
        vehicle_tariff: $('#total_tariff').val().replace('$', '').trim(),
        vin: $('#order-modal-input-vin').val(),
        plate_no: $('#order-modal-input-plateno').val(),
        lot_no: $('#order-modal-input-lotno').val(),
        color: $('#order-modal-input-color').val(),
        inop: $('#order-modal-input-inop').is(':checked') ? 1 : 0
    };

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_order_vehicle',
            order_id: orderId,
            vehicle_data: JSON.stringify(vehicleData)
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                $('#vehicles-modal').modal('hide');
                loadOrderVehicles();
                alert('Vehicle saved!');

                load_order_view(); // Recargar toda la orden
            } else {
                alert(response.error);
            }
        }
    });
}

function getVehicleDetails(){
    const vehicleId = $('#order-modal-select-vehicle').val();
    const orderId = $('#order_view_idOrder').text();

    if (vehicleId) {
        $.ajax({
            type: "POST",
            url: "../dist/php/services.php",
            data: {
                option: 'get_vehicle_details',
                vehicle_id: vehicleId,
                order_id: orderId
            },
            dataType: "json",
            success: function(response) {
                if (response.error === '') {
                    const vehicle = response.data;
                    $('#order-modal-input-modelyear').val(vehicle.model_year);
                    $('#order-modal-input-make').val(vehicle.make);
                    $('#order-modal-input-model').val(vehicle.model);
                    $('#order-modal-input-type').val(vehicle.vehicle_type);

                    // Si hay datos previos del vehículo en la orden
                   if(vehicle.vin) {
                       $('#order-modal-input-vin').val(vehicle.vin);
                       $('#order-modal-input-plateno').val(vehicle.plate_no);
                       $('#order-modal-input-lotno').val(vehicle.lot_no);
                       $('#order-modal-input-color').val(vehicle.color);
                       $('#order-modal-input-inop').prop('checked', vehicle.inop == 1);
                   }
                } else {
                    alert(response.error);
                }
            }
        });
    }
}

function load_order_vehicle_fees(){
    var carrier_pay = $('#carrier_pay').val();
    var broker_pay = $('#broker_pay').val();
    var wrecker_pay = $('#wrecker_pay').val();
    var other_pay = $('#other_pay').val();
    var total_tariff = $('#total_tariff').val();

    $('#order-modal-input-carrier-pay').val(carrier_pay);
    $('#order-modal-input-broker-fee').val(broker_pay);
    $('#order-modal-input-wrecker-fee').val(wrecker_pay);
    $('#order-modal-input-other-fee').val(other_pay);
    $('#order-modal-input-tariff').val(total_tariff);

}

// Función para cargar vehículos en el select
function loadVehiclesForOrder() {
    
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { 
            option: 'load_vehicles_for_select'
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '<option value="" disabled selected>Select a vehicle</option>';
                response.data.forEach(vehicle => {
                    html += `<option value="${vehicle.id}">
                        ${vehicle.model_year} - ${vehicle.make} - ${vehicle.model} - ${vehicle.vehicle_type}
                    </option>`;
                });
                $('#order-modal-select-vehicle').html(html);

                // Inicializar select2 si lo estás usando
                $('#order-modal-select-vehicle').select2({
                    dropdownParent: $('#vehicles-modal')
                });
            } else {
                alert(response.error);
            }
            load_order_vehicle_fees();
        }
    });
}

function saveOrderFunction() {
    const orderId = $('#order_view_idOrder').text();
    
    // Gather all form data
    const orderData = {
        // Status and Assignment
        order_status: $('#order_status').val(),
        transport_type_id: $('#transport-type').val(),
        shipment_first_avalilable_pickup_date: $('#first_available_pickup_date input').val(),
        referral_source_id: $('#referral-source').val(),
        assigned_user_id: $('#select_assigned_user').val(),
        assigned_team_id: $('#select_assigned_team').val(),
        
        // Financial Information
        total_tariff: $('#total_tariff').val().replace('$', '').trim(),
        carrier_pay: $('#carrier_pay').val().replace('$', '').trim(),
        carrier_pay_terms: $('#select_carrier_pay').val(),
        broker_fee: $('#broker_pay').val().replace('$', '').trim(),
        broker_fee_terms: $('#broker_fee_terms').val(),
        wrecker_fee: $('#wrecker_pay').val().replace('$', '').trim(),
        other_fee: $('#other_pay').val().replace('$', '').trim(),
        special_terms: $('#special_terms').val()
    };

    // Validate required fields
    /*
    if (!orderData.order_status || !orderData.transport_type_id) {
        alert('Please fill in all required fields!');
        return;
    }
    */

    // Convert currency strings to numbers
    const currencyFields = ['total_tariff', 'carrier_pay', 'broker_fee', 'wrecker_fee', 'other_fee'];
    currencyFields.forEach(field => {
        if (orderData[field]) {
            orderData[field] = parseFloat(orderData[field]) || 0;
        }
    });

    // Format date if present
    if (orderData.shipment_first_avalilable_pickup_date) {
        orderData.shipment_first_avalilable_pickup_date = moment(
            orderData.shipment_first_avalilable_pickup_date, 
            'MM/DD/YYYY'
        ).format('YYYY-MM-DD');
    }

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_order',
            order_id: orderId,
            order_data: JSON.stringify(orderData)
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                // Optionally reload order data
                load_order_view();
            } else {
                alert(response.error);
            }
        },
        error: function(xhr, status, error) {
            alert('Error saving order: ' + error);
        }
    });
}

function updateNoteStatus(noteId, status) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'update_note_status',
            note_id: noteId,
            status: status
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
            } else {
                alert(response.error);
                // Revert switch if error
                $(`#noteSwitch${noteId}`).prop('checked', !status);
            }
        }
    });
}

function load_internal_notes() {
    const orderId   = $('#order_view_idOrder').text();
    loadInternalNotes(orderId);
}

function loadInternalNotes(orderId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'load_internal_notes',
            order_id: orderId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '<div class="table-responsive"><table class="table table-bordered">';
                html += '<thead><tr><th>Title</th><th>Note</th><th>Date Created</th><th>Status</th></tr></thead><tbody>';
                
                response.data.forEach(note => {
                    const checked = note.status == 1 ? 'checked' : '';
                    html += `<tr>
                        <td>${note.title}</td>
                        <td>${note.body}</td>
                        <td>${note.date_created}</td>
                        <td>
                            <div class="custom-control custom-switch custom-switch-on-success">
                                <input type="checkbox" class="custom-control-input note-status" 
                                    id="noteSwitch${note.id}" data-id="${note.id}" ${checked}>
                                <label class="custom-control-label" for="noteSwitch${note.id}"></label>
                            </div>
                        </td>
                    </tr>`;
                });
                
                html += '</tbody></table></div>';
                $('#internal-notes-tab').find('.row:eq(1)').html(html);

                // Add event listener for status switches
                $('.note-status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updateNoteStatus(id, newStatus);
                });
            } else {
                alert(response.error);
            }
        }
    });
}

function internal_notes_modal_save_button(){
    const title     = $('#note-title').val();
    const body      = $('#note-body').val();
    const orderId   = $('#order_view_idOrder').text();

    if (!title || !body) {
        alert('Please fill in all fields');
        return;
    }

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_internal_note',
            order_id: orderId,
            title: title,
            body: body
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                $('#internal-notes-modal').modal('hide');
                loadInternalNotes(orderId);
            } else {
                alert(response.error);
            }
        }
    });
}

function internal_notes_new_button(){
    // Clear form
    $('#note-title').val('');
    $('#note-body').val('');
    // Show modal
    $('#internal-notes-modal').modal('show');
}

function order_vehicles_new_button(){
    // Clear form
    $('#order-modal-input-modelyear').val('');
    $('#order-modal-input-make').val('');
    $('#order-modal-input-model').val('');
    $('#order-modal-input-type').val('');
    // Show modal
    $('#vehicles-modal').modal('show');
    loadVehiclesForOrder();
}

function load_payments() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_payments' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '';
                response.data.forEach(payment => {
                    const checked = payment.status == 1 ? 'checked' : '';
                    html += `
                        <tr>
                            <td>${payment.id}</td>
                            <td><a href="order_view.html?id=${payment.order_id}">${payment.order_id}</a></td>
                            <td>${payment.payment_date}</td>
                            <td>${payment.payment_type}</td>
                            <td>${payment.payment_direction}</td>
                            <td>$${parseFloat(payment.payment_amount).toFixed(2)}</td>
                            <td>${payment.identification}</td>
                            <td>
                                <div class="btn-group">
                                    <div class="custom-control custom-switch custom-switch-on-success">
                                        <input type="checkbox" class="custom-control-input payment-status" 
                                            id="customSwitch${payment.id}" data-id="${payment.id}" ${checked}>
                                        <label class="custom-control-label" for="customSwitch${payment.id}"></label>
                                    </div>
                                    <button class="btn btn-sm btn-danger delete-payment ml-2" data-id="${payment.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>`;
                });

                if ($.fn.DataTable.isDataTable('#payments-table')) {
                    $('#payments-table').DataTable().destroy();
                }

                $('#payments-table tbody').html(html);

                $('#payments-table').DataTable({
                    "responsive": true,
                    "lengthChange": false,
                    "autoWidth": false,
                    "searching": true,
                    "buttons": ["csv", "excel", "pdf", "print", "colvis"]
                }).buttons().container().appendTo('#payments-table_wrapper .col-md-6:eq(0)');

                // Add event listeners
                $('.payment-status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updatePaymentStatus(id, newStatus);
                });

                $('.delete-payment').on('click', function() {
                    const id = $(this).data('id');
                    deletePayment(id);
                });
            } else {
                alert(response.error);
            }
        }
    });
}

// Load orders dropdown
function loadOrdersSelect() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_global_search' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '<option value="" disabled selected>Select an order</option>';
                response.data.forEach(order => {
                    html += `<option value="${order.id}">Order #${order.id} - ${order.customer_name}</option>`;
                });
                $('#payment-order-select').html(html);
                $('#payment-order-select').on('change', function() {
                    const orderId = $(this).val();
                    loadPaymentsByOrder(orderId);
                });
            } else {
                alert(response.error);
            }
        }
    });
}
/*
function loadPaymentsByOrder(orderId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { 
            option: 'load_payments_by_order',
            order_id: orderId 
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const table = $('#payments-table').DataTable();
                table.clear();
                
                response.data.forEach(payment => {
                    table.row.add([
                        payment.id,
                        `<a href="order_view.html?id=${payment.order_id}">${payment.order_id}</a>`,
                        payment.payment_date,
                        payment.payment_type,
                        payment.payment_direction,
                        `$${parseFloat(payment.payment_amount).toFixed(2)}`,
                        payment.identification,
                        `<div class="btn-group">
                            <div class="custom-control custom-switch custom-switch-on-success">
                                <input type="checkbox" class="custom-control-input payment-status" 
                                    id="customSwitch${payment.id}" data-id="${payment.id}" 
                                    ${payment.status == 1 ? 'checked' : ''}>
                                <label class="custom-control-label" for="customSwitch${payment.id}"></label>
                            </div>
                            <button class="btn btn-sm btn-danger delete-payment ml-2" data-id="${payment.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>`
                    ]);
                });
                
                table.draw();
                
                // Reattach event listeners
                $('.payment-status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updatePaymentStatus(id, newStatus);
                });

                $('.delete-payment').on('click', function() {
                    const id = $(this).data('id');
                    deletePayment(id);
                });
            } else {
                alert(response.error);
            }
        }
    });
}*/

function loadPaymentsByOrder(orderId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { 
            option: 'load_payments_by_order',
            order_id: orderId 
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                // Determinar qué tabla estamos usando
                const isMaintenanceTable = $('#payments-table').length > 0;
                const table = isMaintenanceTable ? 
                    $('#payments-table').DataTable() : 
                    $('#order-payments-table').DataTable();

                table.clear();
                
                response.data.forEach(payment => {
                    const statusSwitch = `
                        <div class="btn-group">
                            <div class="custom-control custom-switch custom-switch-on-success">
                                <input type="checkbox" class="custom-control-input payment-status" 
                                    id="customSwitch${payment.id}" data-id="${payment.id}" 
                                    ${payment.status == 1 ? 'checked' : ''}>
                                <label class="custom-control-label" for="customSwitch${payment.id}"></label>
                            </div>
                            <button class="btn btn-sm btn-danger delete-payment ml-2" data-id="${payment.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>`;

                    if (isMaintenanceTable) {
                        table.row.add([
                            payment.id,
                            `<a href="order_view.html?id=${payment.order_id}">${payment.order_id}</a>`,
                            payment.payment_date,
                            payment.payment_type,
                            payment.payment_direction,
                            `$${parseFloat(payment.payment_amount).toFixed(2)}`,
                            payment.identification,
                            statusSwitch
                        ]);
                    } else {
                        table.row.add([
                            payment.payment_date,
                            payment.payment_type,
                            payment.payment_direction,
                            `$${parseFloat(payment.payment_amount).toFixed(2)}`,
                            payment.identification,
                            payment.note || '',
                            `<button class="btn btn-sm btn-danger delete-payment" data-id="${payment.id}">
                                <i class="fas fa-trash"></i>
                            </button>`
                        ]);
                    }
                });
                
                table.draw();
                
                // Reattach event listeners
                $('.payment-status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updatePaymentStatus(id, newStatus);
                });

                $('.delete-payment').on('click', function() {
                    const id = $(this).data('id');
                    deletePayment(id);
                });
            } else {
                alert(response.error);
            }
        }
    });
}

// Get payment information for editing
function getPaymentInfo(paymentId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_payment_info',
            payment_id: paymentId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const payment = response.data;
                $('#payment-order-select').val(payment.order_id);
                $('#payment-date-input').val(payment.payment_date);
                $('#payment-type').val(payment.payment_type);
                $('#payment-direction').val(payment.payment_direction);
                $('#payment-amount').val('$' + parseFloat(payment.payment_amount).toFixed(2));
                $('#payment-identification').val(payment.identification);
                $('#payment-note').val(payment.note);
                $('#btn-save-payment').data('payment-id', paymentId);
            } else {
                alert(response.error);
            }
        }
    });
}

// Save or update payment
function payments_save_button() {
    const paymentData = {
        order_id: $('#payment-order-select').val(),
        payment_date: $('#payment-date-input').val(),
        payment_type: $('#payment-type').val(),
        payment_direction: $('#payment-direction').val(),
        payment_amount: $('#payment-amount').val().replace('$', '').trim(),
        identification: $('#payment-identification').val(),
        note: $('#payment-note').val()
    };

    // Validate required fields
    if (!paymentData.order_id || !paymentData.payment_date || !paymentData.payment_type || 
        !paymentData.payment_direction || !paymentData.payment_amount) {
        alert('Please fill in all required fields!');
        return;
    }

    // Validate amount format
    if (isNaN(paymentData.payment_amount)) {
        alert('Please enter a valid payment amount!');
        return;
    }

    const paymentId = $('#btn-save-payment').data('payment-id');

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_payment',
            payment_data: JSON.stringify(paymentData),
            payment_id: paymentId || ''
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                clearPaymentForm();
                load_payments();
            } else {
                alert(response.error);
            }
        }
    });
}

// Update payment status
function updatePaymentStatus(paymentId, newStatus) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'update_payment_status',
            payment_id: paymentId,
            status: newStatus
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
            } else {
                alert(response.error);
                // Revert switch if error
                $(`#customSwitch${paymentId}`).prop('checked', !newStatus);
            }
        }
    });
}

// Clear form fields
function clearPaymentForm() {
    $('#payment-order-select').val('');
    $('#payment-date-input').val('');
    $('#payment-type').val('');
    $('#payment-direction').val('');
    $('#payment-amount').val('');
    $('#payment-identification').val('');
    $('#payment-note').val('');
    $('#btn-save-payment').removeData('payment-id');
}

// Function to load insurance policies
function load_insurance_policies() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { 
            option: 'load_insurance_policies'
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '';
                response.data.forEach(policy => {
                    const checked = policy.status == 1 ? 'checked' : '';
                    html += `
                        <tr>
                            <td>${policy.id}</td>
                            <td><a href="#" class="edit-policy" data-id="${policy.id}">${policy.policy_number}</a></td>
                            <td>${policy.insurance_company}</td>
                            <td>${policy.expiration_date}</td>
                            <td>$${parseFloat(policy.liability_amount).toFixed(2)}</td>
                            <td>$${parseFloat(policy.cargo_amount).toFixed(2)}</td>
                            <td>${policy.date_created}</td>
                            <td>
                                <div class="form-group">
                                    <div class="custom-control custom-switch custom-switch-on-success">
                                        <input type="checkbox" class="custom-control-input policy-status" 
                                               id="customSwitch${policy.id}" data-id="${policy.id}" ${checked}>
                                        <label class="custom-control-label" for="customSwitch${policy.id}"></label>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                });

                // Destroy existing DataTable if it exists
                if ($.fn.DataTable.isDataTable('#insurance-policies-table')) {
                    $('#insurance-policies-table').DataTable().destroy();
                }

                $('#insurance-policies-table tbody').html(html);

                // Reinitialize DataTable
                $('#insurance-policies-table').DataTable({
                    "responsive": true,
                    "lengthChange": false,
                    "autoWidth": false
                });

                // Add event listeners
                $('.policy-status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updatePolicyStatus(id, newStatus);
                });

                $('.edit-policy').on('click', function(e) {
                    e.preventDefault();
                    const id = $(this).data('id');
                    getPolicyInfo(id);
                });
            } else {
                alert(response.error);
            }
        }
    });
}

// Function to save or update insurance policy
function insurance_policy_save_button() {
    const formData = new FormData();
    formData.append('option', 'save_insurance_policy');
    
    const policyData = {
        policy_number: $('#policy-number').val(),
        insurance_company: $('#insurance-company').val(),
        expiration_date: $('#expiration-date').val(),
        liability_amount: $('#liability-amount').val().replace('$', ''),
        cargo_amount: $('#cargo-amount').val().replace('$', ''),
        document_name: $('#document-name').val()
    };

    formData.append('policy_data', JSON.stringify(policyData));
    
    const policyId = $('#btn-save-insurance-policy').data('policy-id');
    if (policyId) {
        formData.append('policy_id', policyId);
    }

    const documentFile = $('#insurance-document')[0].files[0];
    if (documentFile) {
        formData.append('insurance_document', documentFile);
    }

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                clearPolicyForm();
                load_insurance_policies();
            } else {
                alert(response.error);
            }
        }
    });
}

// Function to get insurance policy information
function getPolicyInfo(policyId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_policy_info',
            policy_id: policyId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const policy = response.data;
                $('#policy-number').val(policy.policy_number);
                $('#insurance-company').val(policy.insurance_company);
                $('#expiration-date').val(policy.expiration_date);
                $('#liability-amount').val('$' + parseFloat(policy.liability_amount).toFixed(2));
                $('#cargo-amount').val('$' + parseFloat(policy.cargo_amount).toFixed(2));
                $('#document-name').val(policy.document_name);
                
                // Store policy ID for update
                $('#btn-save-insurance-policy').data('policy-id', policyId);
            } else {
                alert(response.error);
            }
        }
    });
}

// Function to update policy status
function updatePolicyStatus(policyId, newStatus) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'update_policy_status',
            policy_id: policyId,
            status: newStatus
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
            } else {
                alert(response.error);
                // Revert switch if error
                $(`#customSwitch${policyId}`).prop('checked', !newStatus);
            }
        }
    });
}

// Function to clear the form
function clearPolicyForm() {
    $('#policy-number').val('');
    $('#insurance-company').val('');
    $('#expiration-date').val('');
    $('#liability-amount').val('');
    $('#cargo-amount').val('');
    $('#document-name').val('');
    $('#insurance-document').val('');
    $('.custom-file-label').html('Choose file');
    $('#btn-save-insurance-policy').removeData('policy-id');
}

// Function to load drivers list
function load_drivers() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_drivers' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '';
                response.data.forEach(driver => {
                    const checked = driver.status == 1 ? 'checked' : '';
                    html += `
                        <tr>
                            <td>${driver.id}</td>
                            <td><a href="#" class="edit" data-id="${driver.id}">${driver.name}</a></td>
                            <td>${driver.phone}</td>
                            <td>${driver.email}</td>
                            <td>${driver.date_created}</td>
                            <td>
                                <div class="form-group">
                                    <div class="custom-control custom-switch custom-switch-on-success">
                                        <input type="checkbox" class="custom-control-input status" 
                                               id="customSwitch${driver.id}" data-id="${driver.id}" ${checked}>
                                        <label class="custom-control-label" for="customSwitch${driver.id}"></label>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                });

                if ($.fn.DataTable.isDataTable('.table')) {
                    $('.table').DataTable().destroy();
                }

                $('.table tbody').html(html);

                $('.table').DataTable({
                    "responsive": true,
                    "lengthChange": false,
                    "autoWidth": false
                });

                $('.status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updateStatus(id, newStatus, 'drivers');
                });

                $('.edit').on('click', function(e) {
                    e.preventDefault();
                    const id = $(this).data('id');
                    getDriverInfo(id);
                });
            } else {
                alert(response.error);
            }
        }
    });
}

// Function to get driver information for editing
function getDriverInfo(driverId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_driver_info',
            driver_id: driverId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const driver = response.data;
                $('#driver-name-txt').val(driver.name);
                $('#driver-phone-txt').val(driver.phone);
                $('#is-phone-mobile-switch').prop('checked', driver.is_phone_mobile == 1);
                $('#driver-phone2-txt').val(driver.phone2);
                $('#is-phone2-mobile-switch').prop('checked', driver.is_phone2_mobile == 1);
                $('#driver-email-txt').val(driver.email);
                $('#btn-save-driver').data('driver-id', driverId);
            } else {
                alert(response.error);
            }
        }
    });
}

// Function to save/update driver
function drivers_save_button() {
    const driverData = {
        name: $('#driver-name-txt').val(),
        phone: $('#driver-phone-txt').val(),
        is_phone_mobile: $('#is-phone-mobile-switch').is(':checked') ? 1 : 0,
        phone2: $('#driver-phone2-txt').val(),
        is_phone2_mobile: $('#is-phone2-mobile-switch').is(':checked') ? 1 : 0,
        email: $('#driver-email-txt').val()
    };

    const driverId = $('#btn-save-driver').data('driver-id');

    if (!driverData.name) {
        alert('Driver name is required!');
        return;
    }

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_driver',
            driver_data: JSON.stringify(driverData),
            driver_id: driverId || ''
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                clearDriverForm();
                load_drivers();
            } else {
                alert(response.error);
            }
        }
    });
}

// Function to clear the driver form
function clearDriverForm() {
    $('#driver-name-txt').val('');
    $('#driver-phone-txt').val('');
    $('#is-phone-mobile-switch').prop('checked', false);
    $('#driver-phone2-txt').val('');
    $('#is-phone2-mobile-switch').prop('checked', false);
    $('#driver-email-txt').val('');
    $('#btn-save-driver').removeData('driver-id');
}

// Función para guardar/actualizar interested carrier
function interested_carrier_save_button() {
    const carrierData = {
        carrier_id: $('#carrier-select').val(),
        carrier_status: $('#carrier-status').val(),
        contact: $('#contact').val(),
        phone: $('#phone').val(),
        email: $('#carrier-email').val(),
        carrier_pay: $('#carrier-pay').val().replace('$', ''),
        special_instructions: $('#special-instructions').val(),
        internal_note: $('#internal-note').val(),
        pickup_date: $('#pickup-date-input').val(),
        pickup_window: $('#pickup-window').val(),
        delivery_date: $('#delivery-date-input').val(),
        delivery_window: $('#delivery-window').val(),
        insurance_policy_id: $('#insurance-policy').val(),
        driver_id: $('#driver-name').val()
    };

    const carrierId = $('#btn-save-interested-carrier').data('carrier-id');

    if (!carrierData.carrier_id) {
        alert('Carrier selection is required!');
        return;
    }

    const isUpdate = carrierId !== '';

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_interested_carrier',
            carrier_data: JSON.stringify(carrierData),
            id: carrierId || ''
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                load_interested_carriers();
                clear_interested_carrier_form();
            } else {
                alert(response.error);
            }
        },
        error: function() {
            alert('Error saving interested carrier. Please contact your administrator.');
        }
    });
}

// Función para cargar los drivers en el select
function load_drivers_select(selectElementId = '#driver-name') {
   $.ajax({
       type: "POST",
       url: "../dist/php/services.php",
       data: { option: 'load_drivers_select' },
       dataType: "json",
       success: function(response) {
           if (response.error === '') {
               let html = '<option value="" selected disabled>Select a driver</option>';
               response.data.forEach(driver => {
                   html += `<option value="${driver.id}">${driver.name}</option>`;
               });

               const possibleSelectIds = [
                   '#driver-name',     // For m_interested_carrier.html
                   '#ic-driver'        // For order_view.html
               ];

               possibleSelectIds.forEach(selectId => {
                   const $select = $(selectId);
                   if ($select.length) {
                       $select.html(html);
                       
                       // Add event listener for driver phone
                       $select.on('change', function() {
                           const selectedDriverId = $(this).val();
                           if (selectedDriverId) {
                               get_driver_phone(selectedDriverId);
                           }
                       });
                   }
               });
           } else {
               alert(response.error);
           }
       }
   });
}
/*
function load_drivers_select() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_drivers_select' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '<option value="" selected disabled>Select a driver</option>';
                response.data.forEach(driver => {
                    html += `<option value="${driver.id}">${driver.name}</option>`;
                });
                $('#driver-name').html(html);

                // Add event listener for driver selection
                $('#driver-name').on('change', function() {
                    const selectedDriverId = $(this).val();
                    if (selectedDriverId) {
                        get_driver_phone(selectedDriverId);
                    } else {
                        $('#driver-phone').val('');
                    }
                });
            } else {
                alert(response.error);
            }
        }
    });
}
*/

// Función para cargar las pólizas de seguro en el select
function load_insurance_policies_select(selectElementId = '#insurance-policy') {
   $.ajax({
       type: "POST",
       url: "../dist/php/services.php",
       data: {
           option: 'load_insurance_policies_select'
       },
       dataType: "json",
       success: function(response) {
           if (response.error === '') {
               let html = '<option value="" disabled selected>Select an insurance policy</option>';
               response.data.forEach(policy => {
                   html += `<option value="${policy.id}">${policy.policy_number}</option>`;
               });

               const possibleSelectIds = [
                   '#insurance-policy',    // For m_interested_carrier.html
                   '#ic-insurance-policy'  // For order_view.html
               ];

               possibleSelectIds.forEach(selectId => {
                   const $select = $(selectId);
                   if ($select.length) {
                       $select.html(html);
                   }
               });
           } else {
               alert(response.error);
           }
       }
   });
}
/*
function load_insurance_policies_select() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_insurance_policies_select' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '<option value="" selected disabled>Select an insurance policy</option>';
                response.data.forEach(policy => {
                    html += `<option value="${policy.id}">${policy.policy_number}</option>`;
                });
                $('#insurance-policy').html(html);
            } else {
                alert(response.error);
            }
        }
    });
}
*/

// Función para obtener los detalles del carrier seleccionado
function get_carrier_details(carrierId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            //option: 'get_carrier_details',
            option: 'get_carrier_info',
            id: carrierId
        },
        dataType: "json",
        success: function(response) {
          //console.log('Todo bien con ger_carrier_details');
            if (response.error === '') {
                $('#contact').val(response.data.carrier_main_contact);
                $('#phone').val(response.data.phone);
                $('#carrier-email').val(response.data.email);
                //console.log('Todo bien con ger_carrier_details adentro del IF');
            } else {
                alert(response.error);
            }
            //console.log('finalizando ger_carrier_details');
        }
    });
}

// Función para obtener el teléfono del driver seleccionado
function get_driver_phone(driverId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_driver_phone',
            driver_id: driverId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                $('#driver-phone').val(response.data.phone);
            } else {
                alert(response.error);
                $('#driver-phone').val('');
            }
        },
        error: function() {
            $('#driver-phone').val('');
            alert('Error fetching driver phone number');
        }
    });
}

// Función para cargar la lista de interested carriers
function load_interested_carriers() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_interested_carriers' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '';
                response.data.forEach(item => {
                    const checked = item.status == 1 ? 'checked' : '';
                    html += `
                        <tr>
                            <td><a href="#" class="edit" data-id="${item.id}">${item.carrier_name}</a></td>
                            <td>${item.carrier_status}</td>
                            <td>${item.contact}</td>
                            <td>${item.phone}</td>
                            <td>${item.pickup_date}</td>
                            <td>${item.delivery_date}</td>
                            <td>
                                <div class="form-group">
                                    <div class="custom-control custom-switch custom-switch-on-success">
                                        <input type="checkbox" class="custom-control-input status" 
                                               id="customSwitch${item.id}" data-id="${item.id}" ${checked}>
                                        <label class="custom-control-label" for="customSwitch${item.id}"></label>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                });

                // Destruir DataTable existente si ya está inicializada
                if ($.fn.DataTable.isDataTable('#interested-carriers-table')) {
                    $('#interested-carriers-table').DataTable().destroy();
                }

                $('#interested-carriers-table tbody').html(html);

                // Reinicializar DataTable
                $('#interested-carriers-table').DataTable({
                    "responsive": true,
                    "lengthChange": false,
                    "autoWidth": false
                });

                // Event listeners
                $('.status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updateStatus(id, newStatus, 'interested_carriers');
                });

                $('.edit').on('click', function(e) {
                    e.preventDefault();
                    const id = $(this).data('id');
                    get_interested_carrier_info(id);
                });
            } else {
                alert(response.error);
            }
        }
    });
}

// Función para cargar los carriers en el select
function load_carriers_select(selectElementId = '#carrier-select') {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { 
            option: 'load_carriers_select'
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '<option value="" selected disabled>Select a carrier</option>';
                response.data.forEach(carrier => {
                    html += `<option value="${carrier.id}">${carrier.name}</option>`;
                });
                
                // Update all possible carrier selects
                const possibleSelectIds = [
                    '#carrier-select',      // For m_interested_carrier.html
                    '#ic-carrier-select'    // For order_view.html
                ];

                possibleSelectIds.forEach(selectId => {
                    const $select = $(selectId);
                    if ($select.length) {
                        $select.html(html);
                        
                        // Add change event listener for carrier details
                        $select.on('change', function() {
                            get_carrier_details($(this).val());
                        });
                    }
                });
            } else {
                alert(response.error);
            }
        }
    });
}
/*
function load_carriers_select(carrierId = 0) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_carriers_select' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '<option value="" selected disabled>Select a carrier</option>';
                response.data.forEach(carrier => {
                    if (carrierId > 0 && carrierId === carrier.id) {
                        html += `<option value="${carrier.id}" selected>${carrier.name}</option>`;
                    } else {
                        html += `<option value="${carrier.id}">${carrier.name}</option>`;
                    }
                });
                $('#carrier-select').html(html);

                // Event listener para cuando se selecciona un carrier
                
                $('#carrier-select').on('change', function() {
                    get_carrier_details($(this).val());
                });
            } else {
                alert(response.error);
            }
        }
    });
}
*/

// Función para obtener la información de un interested carrier
function get_interested_carrier_info(id) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_interested_carrier_info',
            id: id
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const data = response.data;

                // First, load the list of carriers with the selected carrier ID
                //load_carriers_select(data.carrier_id);

                // Find the option with the value matching data.carrier_id
                const $carrierOption = $('#carrier-select option[value="' + data.carrier_id + '"]');

                // If the option is found, set it as the selected option
                if ($carrierOption.length) {
                    $('#carrier-select').val(data.carrier_id);
                } else {
                    console.error('Invalid carrier ID:', data.carrier_id);
                }

                // Set driver and trigger change event to load phone
                if (data.driver_id) {
                    $('#driver-name').val(data.driver_id).trigger('change');
                } else {
                    $('#driver-name').val('');
                    $('#driver-phone').val('');
                }

                if (data.insurance_policy_id) {
                    $('#insurance-policy').val(data.insurance_policy_id);
                } else {
                    $('#insurance-policy').val('');
                }

                // Set the other form fields
                $('#carrier-status').val(data.carrier_status);
                $('#contact').val(data.contact);
                $('#phone').val(data.phone);
                $('#carrier-email').val(data.email);
                $('#carrier-pay').val(data.carrier_pay);
                $('#special-instructions').val(data.special_instructions);
                $('#internal-note').val(data.internal_note);
                $('#pickup-date-input').val(data.pickup_date);
                $('#pickup-window').val(data.pickup_window);
                $('#delivery-date-input').val(data.delivery_date);
                $('#delivery-window').val(data.delivery_window);
                $('#insurance-policy').val(data.insurance_policy_id);
                $('#driver-name').val(data.driver_id);
                $('#btn-save-interested-carrier').data('carrier-id', id);
            } else {
                alert(response.error);
            }
        }
    });
}

// Función para limpiar el formulario
function clear_interested_carrier_form() {
    //$('#carrier-select').val('').trigger('change');
    $('#carrier-select').val('');
    $('#carrier-status').val('active');
    $('#contact').val('');
    $('#phone').val('');
    $('#carrier-email').val('');
    $('#carrier-pay').val('');
    $('#special-instructions').val('');
    $('#internal-note').val('');
    $('#pickup-date-input').val('');
    $('#pickup-window').val('estimated');
    $('#delivery-date-input').val('');
    $('#delivery-window').val('estimated');
    $('#insurance-policy').val('');
    $('#driver-name').val('').trigger('change');
    $('#driver-phone').val('');
    
    $('#btn-save-interested-carrier').removeData('carrier-id');
}

// Función para cargar la lista de vehículos
function load_vehicles() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { 
            option: 'load_vehicles'
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '';
                response.data.forEach(vehicle => {
                    const checked = vehicle.status == 1 ? 'checked' : '';
                    //console.log(vehicle.link);
                    if(vehicle.link == null){
                         html += `
                            <tr>
                                <td><a href="#" class="edit-vehicle" data-id="${vehicle.id}">${vehicle.id}</a></td>
                                <td>${vehicle.model_year}</td>
                                <td>${vehicle.make}</td>
                                <td>${vehicle.model}</td>
                                <td>${vehicle.vehicle_type}</td>
                                <td><a href='#' target='_blank'></a></td>
                                <td>${vehicle.date_created}</td>
                                <td>
                                    <div class="form-group">
                                        <div class="custom-control custom-switch custom-switch-on-success">
                                            <input type="checkbox" class="custom-control-input vehicle-status" 
                                                   id="customSwitch${vehicle.id}" data-id="${vehicle.id}" ${checked}>
                                            <label class="custom-control-label" for="customSwitch${vehicle.id}"></label>
                                        </div>
                                    </div>
                                </td>
                            </tr>`;
                    }else{

                        html += `
                            <tr>
                                <td><a href="#" class="edit-vehicle" data-id="${vehicle.id}">${vehicle.id}</a></td>
                                <td>${vehicle.model_year}</td>
                                <td>${vehicle.make}</td>
                                <td>${vehicle.model}</td>
                                <td>${vehicle.vehicle_type}</td>
                                <td><a href='${vehicle.link}' target='_blank'>${vehicle.link}</a></td>
                                <td>${vehicle.date_created}</td>
                                <td>
                                    <div class="form-group">
                                        <div class="custom-control custom-switch custom-switch-on-success">
                                            <input type="checkbox" class="custom-control-input vehicle-status" 
                                                   id="customSwitch${vehicle.id}" data-id="${vehicle.id}" ${checked}>
                                            <label class="custom-control-label" for="customSwitch${vehicle.id}"></label>
                                        </div>
                                    </div>
                                </td>
                            </tr>`;
                    }
                });

                // Destruir DataTable existente si ya está inicializada
                if ($.fn.DataTable.isDataTable('#vehicles-table')) {
                    $('#vehicles-table').DataTable().destroy();
                }

                $('#vehicles-table tbody').html(html);

                // Re-inicializar DataTable
                $('#vehicles-table').DataTable({
                    "responsive": true,
                    "lengthChange": false,
                    "autoWidth": false
                }).buttons().container().appendTo('#vehicles-table_wrapper .col-md-6:eq(0)');

                // Agregar event listeners
                $('.vehicle-status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updateVehicleStatus(id, newStatus);
                });

                $('.edit-vehicle').on('click', function(e) {
                    e.preventDefault();
                    const id = $(this).data('id');
                    getVehicleInfo(id);
                });

                // Añadir event listener para cuando se haga clic en el id del vehiculo
                $('#vehicles-table_paginate').click(function(){
                    $('.edit-vehicle').on('click', function(e) {
                        e.preventDefault();
                        const id = $(this).data('id');
                        getVehicleInfo(id);
                    });
                    $('.vehicle-status').on('change', function() {
                        const id = $(this).data('id');
                        const newStatus = $(this).is(':checked') ? 1 : 0;
                        updateVehicleStatus(id, newStatus);
                    });
                }); 
            } else {
                alert(response.error);
            }
        }
    });
}

// Función para obtener información de un vehículo
function getVehicleInfo(vehicleId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_vehicle_info',
            vehicle_id: vehicleId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const vehicle = response.data;
                
                // Llenar el formulario con los datos
                $('#model-year').val(vehicle.model_year);
                $('#make').val(vehicle.make);
                $('#model').val(vehicle.model);
                $('#vehicle-type').val(vehicle.vehicle_type);
                $('#notes').val(vehicle.notes);
                $('#vehicle-link').val(vehicle.link);
                $('#weight').val(vehicle.weight);
                $('#weight-measure').val(vehicle.weight_measure);
                $('#mods').val(vehicle.mods);
                $('#vehicle-length').val(vehicle.vehicle_length);
                $('#vehicle-width').val(vehicle.vehicle_width);
                $('#vehicle-height').val(vehicle.vehicle_height);
                $('#add-on').val(vehicle.add_on);

                // Guardar el ID del vehículo para la actualización
                $('#btn-save-vehicle').data('vehicle-id', vehicleId);
            } else {
                alert(response.error);
            }
        }
    });
}

// Función para actualizar el estado de un vehículo
function updateVehicleStatus(vehicleId, newStatus) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'update_vehicle_status',
            vehicle_id: vehicleId,
            status: newStatus
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
            } else {
                alert(response.error);
                // Revertir el switch si hubo error
                $(`#customSwitch${vehicleId}`).prop('checked', !newStatus);
            }
        }
    });
}

// Función para guardar o actualizar un vehículo
function vehicles_save_button() {
    // Obtener los valores monetarios sin el símbolo $
    //const carrierFee = $('#carrier-fee').val().replace('$', '');
    //const brokerFee = $('#broker-fee').val().replace('$', '');
    //const vehicleTariff = $('#vehicle-tariff').val().replace('$', '');

    const vehicleData = {
        model_year: $('#model-year').val(),
        make: $('#make').val(),
        model: $('#model').val(),
        vehicle_type: $('#vehicle-type').val(),
        notes: $('#notes').val(),
        link: $('#vehicle-link').val(),
        weight: $('#weight').val(),
        weight_measure: $('#weight-measure').val(),
        mods: $('#mods').val(),
        vehicle_length: $('#vehicle-length').val(),
        vehicle_width: $('#vehicle-width').val(),
        vehicle_height: $('#vehicle-height').val(),
        add_on: $('#add-on').val()
    };

    const vehicleId = $('#btn-save-vehicle').data('vehicle-id');

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_vehicle',
            vehicle_data: JSON.stringify(vehicleData),
            vehicle_id: vehicleId || ''
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                clearVehicleForm();
                load_vehicles();
            } else {
                alert(response.error);
            }
        }
    });
}

// Función para limpiar el formulario
function clearVehicleForm() {
    // Limpiar campos básicos
    $('#model-year').val('');
    $('#make').val('');
    $('#model').val('');
    $('#vehicle-type').val('');
    
    
    // Limpiar notas y link
    $('#notes').val('');
    $('#vehicle-link').val('');
    
    // Limpiar información del vehículo
    $('#vin').val('');
    $('#plate-number').val('');
    $('#lot-number').val('');
    $('#color').val('');
    
    // Limpiar peso y medidas
    $('#weight').val('');
    $('#weight-measure').val('lbs'); // Restablecer al valor por defecto
    $('#mods').val('');
    
    // Limpiar dimensiones
    $('#vehicle-length').val('');
    $('#vehicle-width').val('');
    $('#vehicle-height').val('');
    $('#add-on').val('');
    
    // Remover el ID del vehículo almacenado para la edición
    $('#btn-save-vehicle').removeData('vehicle-id');
}

// Functions for permissions management
function load_roles_for_permissions() {
   $.ajax({
       type: "POST",
       url: "../dist/php/services.php",
       data: { option: 'load_roles_for_permissions' },
       dataType: "json",
       success: function(response) {
           if (response.error === '') {
               let html = '<option value="" selected disabled>Select a role</option>';
               response.data.forEach(role => {
                   html += `<option value="${role.id}">${role.name}</option>`;
               });
               $('#role-select').html(html);
           } else {
               alert(response.error);
           }
       }
   });
}

function load_role_permissions(roleId) {
    if (!roleId) return;
    
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'load_role_permissions',
            role_id: roleId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                //console.log('Loaded permissions:', response.data.permissions); // Debug
                renderPermissionsGrid(response.data.menu_items, response.data.permissions);
            } else {
                alert(response.error);
            }
        }
    });
}

function renderPermissionsGrid(menuItems, currentPermissions) {
    let html = '';
    
    // Convertir currentPermissions a un array de números si no lo es ya
    const permissionIds = currentPermissions.map(p => parseInt(p));
    
    // Group menu items by parent
    const menuGroups = menuItems.reduce((acc, item) => {
        if (!item.parent_id) {
            if (!acc.parents) acc.parents = [];
            acc.parents.push(item);
        } else {
            if (!acc.children) acc.children = {};
            if (!acc.children[item.parent_id]) acc.children[item.parent_id] = [];
            acc.children[item.parent_id].push(item);
        }
        return acc;
    }, {});

    // Render parent menu items
    menuGroups.parents?.forEach(parent => {
        html += createMenuItemCard(parent, permissionIds);
        
        // Render children if any
        if (menuGroups.children?.[parent.id]) {
            html += '<div class="col-12"><div class="ml-4">';
            menuGroups.children[parent.id].forEach(child => {
                html += createMenuItemCard(child, permissionIds);
            });
            html += '</div></div>';
        }
    });

    $('#permissions-grid').html(html);

    // Re-initialize switches after rendering
    initializeSwitches(permissionIds);
}

function createMenuItemCard(menuItem, permissionIds) {
    const isPermitted = permissionIds.includes(parseInt(menuItem.id));
    return `
        <div class="col-md-12 mb-2">
            <div class="card menu-item-card ${isPermitted ? 'active' : ''}">
                <div class="card-body p-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="${menuItem.icon}"></i>
                            <span class="ml-2">${menuItem.name}</span>
                        </div>
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input permission-switch" 
                                   id="switch${menuItem.id}" 
                                   data-menu-id="${menuItem.id}"
                                   ${isPermitted ? 'checked' : ''}>
                            <label class="custom-control-label" for="switch${menuItem.id}"></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeSwitches(permissionIds) {
    // Reinicializar todos los switches
    $('.permission-switch').each(function() {
        const menuId = parseInt($(this).data('menu-id'));
        $(this).prop('checked', permissionIds.includes(menuId));
    });

    // Agregar eventos a los switches
    $('.permission-switch').off('change').on('change', function() {
        const menuId = $(this).data('menu-id');
        const isChecked = $(this).is(':checked');
        toggleChildPermissions(menuId, isChecked);
    });
}

function toggleChildPermissions(parentId, state) {
   // Find and toggle all child menu items
   $(`.permission-switch[data-parent="${parentId}"]`).prop('checked', state);
}

function save_permissions() {
   const roleId = $('#role-select').val();
   if (!roleId) {
       alert('Please select a role first');
       return;
   }

   const permissions = [];
   $('.permission-switch:checked').each(function() {
       permissions.push($(this).data('menu-id'));
   });

   $.ajax({
       type: "POST",
       url: "../dist/php/services.php",
       data: {
           option: 'save_permissions',
           role_id: roleId,
           permissions: JSON.stringify(permissions)
       },
       dataType: "json",
       success: function(response) {
           if (response.error === '') {
               alert(response.message);
               load_role_permissions(roleId);
           } else {
               alert(response.error);
           }
       }
   });
}

function updateCustomerStatus(customerId, newStatus) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'update_customer_status',
            customer_id: customerId,
            status: newStatus
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                load_customers(); // Recargar la tabla para mostrar los cambios
            } else {
                alert(response.error);
                // Revertir el switch si hubo error
                $(`#customSwitch${customerId}`).prop('checked', !newStatus);
            }
        },
        error: function() {
            alert('Error updating customer status. Please contact your administrator.');
            // Revertir el switch si hubo error
            $(`#customSwitch${customerId}`).prop('checked', !newStatus);
        }
    });
}

// Función para cargar la lista de equipos en el select
function load_teams_select() {
  $.ajax({
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_teams_select'
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        let teamsHtml = '<option value="" disabled selected>Select a team</option>';
        response.data.forEach(team => {
          teamsHtml += `<option value="${team.id}">${team.name}</option>`;
        });
        $('#customer-team-select').html(teamsHtml);
      } else {
        alert(response.error);
      }
    }
  });
}

// Función para cargar la lista de usuarios en el select
function load_users_select() {
  $.ajax({
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_users_select'
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        let usersHtml = '<option value="" disabled selected>Select a user</option>';
        response.data.forEach(user => {
          usersHtml += `<option value="${user.id}">${user.name}</option>`;
        });
        $('#customer-user-select').html(usersHtml);
      } else {
        alert(response.error);
      }
    }
  });
}

// Función para cargar la lista de fuentes de referencia en el select
function load_referral_sources_select() {
  $.ajax({
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_referral_sources_select'
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        let referralSourcesHtml = '<option value="" disabled selected>Select a referral source</option>';
        response.data.forEach(source => {
          referralSourcesHtml += `<option value="${source.id}">${source.name}</option>`;
        });
        $('#customer-referral-select').html(referralSourcesHtml);
      } else {
        alert(response.error);
      }
    }
  });
}

// Función para cargar la lista de compañías en el select
function load_companies_select() {
  $.ajax({
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_companies_select'
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        let companiesHtml = '<option value="" disabled selected>Select a company</option>';
        response.data.forEach(company => {
          companiesHtml += `<option value="${company.id}">${company.company_name}</option>`;
        });
        $('#customer-company-select').html(companiesHtml);
      } else {
        alert(response.error);
      }
    }
  });
}

// Función para cargar la lista de clientes
function load_customers() {
  $.ajax({
    type: "POST",
    url: "../dist/php/services.php",
    data: { 
      option: 'load_customers'
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        let customersHtml = '';
        response.data.forEach(customer => {
          customersHtml += `
            <tr>
              <td>${customer.id}</td>
              <td><a href="#" class="edit-customer" data-id="${customer.id}">${customer.first_name} ${customer.last_name}</a></td>
              <td>${customer.company_name}</td>
              <td>${customer.phone1}</td>
              <td>${customer.email1}</td>
              <td>${customer.city}</td>
              <td>${customer.assigned_team_name}</td>
              <td>${customer.date_created}</td>
              <td>
                <div class="form-group">
                  <div class="custom-control custom-switch custom-switch-on-success">
                    <input type="checkbox" class="custom-control-input customer-status" id="customSwitch${customer.id}" data-id="${customer.id}" ${customer.status == 1 ? 'checked' : ''}>
                    <label class="custom-control-label" for="customSwitch${customer.id}"></label>
                  </div>
                </div>
              </td>
            </tr>`;
        });

        // Destruir DataTable existente si ya está inicializada
        if ($.fn.DataTable.isDataTable('#customers-table')) {
          $('#customers-table').DataTable().destroy();
        }

        // Actualizar la tabla con los nuevos datos
        $('#customers-table tbody').html(customersHtml);

        // Re-inicializar DataTable
        $('#customers-table').DataTable({
          "searching": true,
          "paging": true,
          "info": true
        });

        // Agregar event listener para cuando el switch cambie
        $('.customer-status').on('change', function() {
          let customerId = $(this).data('id');
          let newStatus = $(this).is(':checked') ? 1 : 0;
          updateCustomerStatus(customerId, newStatus);
        });

        // Agregar event listener para cuando se haga clic en el nombre del cliente
        $('.edit-customer').on('click', function(e) {
          e.preventDefault();
          let customerId = $(this).data('id');
          get_customer_info(customerId);
        });
      } else {
        alert(response.error);
      }
    }
  });
}

// Función para limpiar el formulario de cliente
function clear_customer_form() {
  $('#customer-firstname-txt').val('');
  $('#customer-lastname-txt').val('');
  $('#customer-company-select').val('').trigger('change');
  $('#customer-phone1-txt').val('');
  $('#customer-ismobile1-switch').prop('checked', false);
  $('#customer-email1-txt').val('');
  $('#customer-phone2-txt').val('');
  $('#customer-ismobile2-switch').prop('checked', false);
  $('#customer-email2-txt').val('');
  $('#customer-address1-txt').val('');
  $('#customer-address2-txt').val('');
  $('#customer-city-txt').val('');
  $('#customer-state-txt').val('');
  $('#customer-zip-txt').val('');
  $('#customer-country-txt').val('');
  $('#customer-referral-select').val('').trigger('change');
  $('#customer-user-select').val('').trigger('change');
  $('#customer-team-select').val('').trigger('change');
  // Limpiar el Summernote correctamente
  $('#customer-additional-info-txt').summernote('code', '');
  $('#btn-save-customer').data('customer-id', '');
}

// Función para guardar un nuevo cliente o actualizar uno existente
function customer_save_button() {
  let customerData = {
    first_name: $('#customer-firstname-txt').val(),
    last_name: $('#customer-lastname-txt').val(),
    company_id: $('#customer-company-select').val(),
    phone1: $('#customer-phone1-txt').val(),
    is_mobile1: $('#customer-ismobile1-switch').is(':checked') ? 1 : 0,
    email1: $('#customer-email1-txt').val(),
    phone2: $('#customer-phone2-txt').val(),
    is_mobile2: $('#customer-ismobile2-switch').is(':checked') ? 1 : 0,
    email2: $('#customer-email2-txt').val(),
    address1: $('#customer-address1-txt').val(),
    address2: $('#customer-address2-txt').val(),
    city: $('#customer-city-txt').val(),
    state: $('#customer-state-txt').val(),
    zip: $('#customer-zip-txt').val(),
    country: $('#customer-country-txt').val(),
    referral_source_id: $('#customer-referral-select').val(),
    assigned_user_id: $('#customer-user-select').val(),
    assigned_team_id: $('#customer-team-select').val(),
    additional_info: $('#customer-additional-info-txt').summernote('code')
  };

  let customerId = $('#btn-save-customer').data('customer-id');

  $.ajax({
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'save_customer',
      customer_data: JSON.stringify(customerData),
      customer_id: customerId || ''
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        alert(response.message);
        load_customers(); // Recargar la lista de clientes
        clear_customer_form(); // Limpiar el formulario
      } else {
        alert(response.error);
      }
    }
  });
}

// Función para obtener la información de un cliente
function get_customer_info(customerId) {
  $.ajax({
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_customer_info',
      customer_id: customerId
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        let customer = response.data;
        $('#customer-firstname-txt').val(customer.first_name);
        $('#customer-lastname-txt').val(customer.last_name);
        $('#customer-company-select').val(customer.company_id).trigger('change');
        $('#customer-phone1-txt').val(customer.phone1);
        $('#customer-ismobile1-switch').prop('checked', customer.is_mobile1 == 1);
        $('#customer-email1-txt').val(customer.email1);
        $('#customer-phone2-txt').val(customer.phone2);
        $('#customer-ismobile2-switch').prop('checked', customer.is_mobile2 == 1);
        $('#customer-email2-txt').val(customer.email2);
        $('#customer-address1-txt').val(customer.address1);
        $('#customer-address2-txt').val(customer.address2);
        $('#customer-city-txt').val(customer.city);
        $('#customer-state-txt').val(customer.state);
        $('#customer-zip-txt').val(customer.zip);
        $('#customer-country-txt').val(customer.country);
        $('#customer-referral-select').val(customer.referral_source_id).trigger('change');
        $('#customer-user-select').val(customer.assigned_user_id).trigger('change');
        $('#customer-team-select').val(customer.assigned_team_id).trigger('change');
        // Establecer contenido en Summernote
        $('#customer-additional-info-txt').summernote('code', customer.additional_info);

        $('#btn-save-customer').data('customer-id', customer.id);
      } else {
        alert(response.error);
      }
    }
  });
}

// Función para guardar/actualizar team
function team_save_button() {
    const teamData = {
        name: $('#team-name-txt').val(),
        description: $('#team-description-txt').val(),
        members: $('#team-members-select').val()
    };

    const teamId = $('#btn-save-team').data('team-id');

    if (!teamData.name) {
        alert('Team name is required!');
        return;
    }

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_team',
            name: teamData.name,
            description: teamData.description,
            members: JSON.stringify(teamData.members),
            id: teamId || ''
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                window.location.replace('m_teams.html');
            } else {
                alert(response.error);
            }
        },
        error: function() {
            alert('Error saving team. Please contact your administrator.');
        }
    });
}

// Función para obtener información de un team
function getTeamInfo(teamId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_team_info',
            id: teamId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const team = response.data;
                $('#team-name-txt').val(team.name);
                $('#team-description-txt').val(team.description);
                
                // Actualizar select de miembros
                if (team.member_ids) {
                    const memberIds = team.member_ids.split(',');
                    $('#team-members-select').val(memberIds).trigger('change');
                } else {
                    $('#team-members-select').val(null).trigger('change');
                }

                $('#btn-save-team').data('team-id', teamId);
            } else {
                alert(response.error);
            }
        }
    });
}

// Función para cargar los teams
function load_teams() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_teams' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '';
                response.data.forEach(team => {
                    const checked = team.status == 1 ? 'checked' : '';
                    html += `
                        <tr>
                            <td>${team.id}</td>
                            <td><a href="#" class="edit" data-id="${team.id}">${team.name}</a></td>
                            <td>${team.description}</td>
                            <td>${team.members || ''}</td>
                            <td>${team.date_created}</td>
                            <td>
                                <div class="form-group">
                                    <div class="custom-control custom-switch custom-switch-on-success">
                                        <input type="checkbox" class="custom-control-input status" 
                                               id="customSwitch${team.id}" data-id="${team.id}" ${checked}>
                                        <label class="custom-control-label" for="customSwitch${team.id}"></label>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                });

                // Destruir DataTable existente si ya está inicializada
                if ($.fn.DataTable.isDataTable('.table')) {
                    $('.table').DataTable().destroy();
                }

                // Actualizar la tabla
                $('.table tbody').html(html);

                // Re-inicializar DataTable
                $('.table').DataTable({
                    "searching": true,
                    "paging": true,
                    "info": true
                });

                // Agregar event listeners
                $('.status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updateStatus(id, newStatus, 'teams');
                });

                $('.edit').on('click', function(e) {
                    e.preventDefault();
                    const id = $(this).data('id');
                    getTeamInfo(id);
                });
            } else {
                alert(response.error);
            }
        }
    });
}

function referral_source_save_button() {
    const name = $('#referral-name-txt').val();
    const description = $('#referral-description-txt').val();
    const id = $('#btn-save-referral-source').data('referral-id');

    if (!name) {
        alert('Name is required!');
        return;
    }

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_referral_source',
            name: name,
            description: description,
            id: id || ''
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                window.location.replace('m_referral_source.html');
            } else {
                alert(response.error);
            }
        },
        error: function() {
            alert('Error saving referral source. Please contact your administrator.');
        }
    });
}

function getReferralSourceInfo(id) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_referral_source_info',
            id: id
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const data = response.data;
                $('#referral-name-txt').val(data.name);
                $('#referral-description-txt').val(data.description);
                $('#btn-save-referral-source').data('referral-id', id);
            } else {
                alert(response.error);
            }
        }
    });
}

function load_referral_sources() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_referral_sources' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '';
                response.data.forEach(source => {
                    const checked = source.status == 1 ? 'checked' : '';
                    html += `
                        <tr>
                            <td>${source.id}</td>
                            <td><a href="#" class="edit" data-id="${source.id}">${source.name}</a></td>
                            <td>${source.description}</td>
                            <td>${source.date_created}</td>
                            <td>
                                <div class="form-group">
                                    <div class="custom-control custom-switch custom-switch-on-success">
                                        <input type="checkbox" class="custom-control-input status" 
                                               id="customSwitch${source.id}" data-id="${source.id}" ${checked}>
                                        <label class="custom-control-label" for="customSwitch${source.id}"></label>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                });

                // Destruir DataTable existente si ya está inicializada
                if ($.fn.DataTable.isDataTable('.table')) {
                    $('.table').DataTable().destroy();
                }

                // Actualizar la tabla
                $('.table tbody').html(html);

                // Re-inicializar DataTable
                $('.table').DataTable({
                    "searching": true,
                    "paging": true,
                    "info": true
                });

                // Agregar event listeners
                $('.status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updateStatus(id, newStatus, 'referral_source');
                });

                $('.edit').on('click', function(e) {
                    e.preventDefault();
                    const id = $(this).data('id');
                    getReferralSourceInfo(id);
                });
            } else {
                alert(response.error);
            }
        }
    });
}

// Función para guardar/actualizar carrier
function carriers_page_save_button() {
    const carrierData = {
        name: $('#carrier-name-txt').val(),
        mc_number: $('#carrier-mcnumber-txt').val(),
        phone: $('#carrier-phone-txt').val(),
        email: $('#carrier-email-txt').val(),
        address: $('#carrier-address-txt').val(),
        carrier_main_contact: $('#carrier-main-contact-txt').val(),
        contact_phone: $('#carrier-contact-phone-txt').val(),
        dispatcher: $('#carrier-dispatcher-txt').val(),
        dispatcher_phone: $('#carrier-dispatcher-phone-txt').val(),
        dispatcher_email: $('#carrier-dispatcher-email-txt').val(),
        billing_contact: $('#carrier-billing-contact-txt').val(),
        billing_email: $('#carrier-billing-email-txt').val()
    };

    const carrierId = $('#btn-save-carriers-maintenance').data('carrier-id');

    if (!carrierData.name || !carrierData.mc_number) {
        alert('Name and MC Number are required!');
        return;
    }

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_carrier',
            carrierData: carrierData,
            carrierId: carrierId || ''
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                window.location.replace('m_carriers.html');
            } else {
                alert(response.error);
            }
        },
        error: function() {
            alert('Error saving carrier. Please contact your administrator.');
        }
    });
}

// Función para obtener información de un carrier
function getCarrierInfo(carrierId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_carrier_info',
            id: carrierId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const carrier = response.data;
                $('#carrier-name-txt').val(carrier.name);
                $('#carrier-mcnumber-txt').val(carrier.mc_number);
                $('#carrier-phone-txt').val(carrier.phone);
                $('#carrier-email-txt').val(carrier.email);
                $('#carrier-address-txt').val(carrier.address);
                $('#carrier-main-contact-txt').val(carrier.carrier_main_contact);
                $('#carrier-contact-phone-txt').val(carrier.contact_phone);
                $('#carrier-dispatcher-txt').val(carrier.dispatcher);
                $('#carrier-dispatcher-phone-txt').val(carrier.dispatcher_phone);
                $('#carrier-dispatcher-email-txt').val(carrier.dispatcher_email);
                $('#carrier-billing-contact-txt').val(carrier.billing_contact);
                $('#carrier-billing-email-txt').val(carrier.billing_email);

                $('#btn-save-carriers-maintenance').data('carrier-id', carrierId);
            } else {
                alert(response.error);
            }
        }
    });
}

// Función para cargar los carriers
function load_carriers() {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: { option: 'load_carriers' },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '';
                response.data.forEach(carrier => {
                    const checked = carrier.status == 1 ? 'checked' : '';
                    html += `
                        <tr>
                            <td>${carrier.id}</td>
                            <td><a href="#" class="edit" data-id="${carrier.id}">${carrier.name}</a></td>
                            <td>${carrier.date_created}</td>
                            <td>${carrier.mc_number}</td>
                            <td>${carrier.phone}</td>
                            <td>${carrier.carrier_main_contact}</td>
                            <td>
                                <div class="form-group">
                                    <div class="custom-control custom-switch custom-switch-on-success">
                                        <input type="checkbox" class="custom-control-input status" 
                                               id="customSwitch${carrier.id}" data-id="${carrier.id}" ${checked}>
                                        <label class="custom-control-label" for="customSwitch${carrier.id}"></label>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                });

                // Destruir DataTable existente si ya está inicializada
                if ($.fn.DataTable.isDataTable('.table')) {
                  $('.table').DataTable().destroy();
                }

                // Actualizar la tabla
                $('.table tbody').html(html);

                // Re-inicializar DataTable
                $('.table').DataTable({
                  "searching": true,  // Habilitar búsqueda
                  "paging": true,     // Habilitar paginación
                  "info": true        // Mostrar información
                });

                // Agregar event listeners
                $('.status').on('change', function() {
                    const id = $(this).data('id');
                    const newStatus = $(this).is(':checked') ? 1 : 0;
                    updateStatus(id, newStatus, 'carriers');
                });

                $('.edit').on('click', function(e) {
                    e.preventDefault();
                    const id = $(this).data('id');
                    getCarrierInfo(id);
                });
            } else {
                alert(response.error);
            }
        }
    });
}

function companies_page_save_button(){
    var companyTxt = $('#company-name-txt').val();
    var companyId = $('#btn-save-companies-maintenance').data('company-id'); // Obtener el ID de la compañia si existe

    if(companyTxt == ''){
      alert('Company name can\'t be blank!');
    }else{
      $.ajax({
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_companies_software',
            companyTxt: companyTxt,
            companyId: companyId || ''  // Si no hay ID, se envía una cadena vacía
        },
        dataType: "json",        
        success: function(r) {                                                   
            if(r.error == ''){
                alert(r.message);
                window.location.replace('m_companies.html');
            }else{
                alert(r.error);
                //window.location.replace('index.html');
            }
        },
        error: function() {
            alert('Error saving data please call your ADMINISTRATOR!.');
        }
      });
    }
}

// Función para cargar los las compañias en su campo editable en m_companies.html.
function getCompanyInfo(Id) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_companies_info',
      id: Id
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        $('#company-name-txt').val(response.data.name);

        // Store the user ID for updating purposes
        $('#btn-save-companies-maintenance').data('company-id', Id);
      } else {
        alert(response.error);
      }
    }
  });
}

//FUNCION PARA CAMBIAR EL STATUS DE UN MANTENIMIENTO
function updateStatus(Id, newStatus, table) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: ({
      option: 'update_status',
      id: Id,
      status: newStatus,
      table: table
    }),
    dataType: "json",        
    success: function(response) {
      if(response.error == ''){
        alert(response.message);
      } else {
        alert(response.error);
      }
    },
    error: function() {
      alert('Error en la función!!!.');
    }
  });
}

//FUNCION PARA CARGAR LAS COMPAÑIAS EN m_companies.html
function load_companies() {

  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: ({
        option: 'load_companies'    
      }),
    dataType: "json",
    success: function (response) {
      if (response.error === '') {
        let Html = '';
        response.data.forEach(company => {
          const checked = company.status == 1 ? 'checked' : '';
          Html += `
            <tr>
              <td>${company.id}</td>
              <td><a href="#" class="edit" data-id="${company.id}">${company.company_name}</a></td>
              <td>${company.date_created}</td>
              <td>
                <div class="form-group">
                  <div class="custom-control custom-switch custom-switch-on-success">
                    <input type="checkbox" class="custom-control-input status" id="customSwitch${company.id}" data-id="${company.id}" ${checked}>
                    <label class="custom-control-label" for="customSwitch${company.id}"></label>
                  </div>
                </div>
              </td>
            </tr>`;
        });
        //$('tbody').html(usersHtml);

        // Destruir DataTable existente si ya está inicializada
        if ($.fn.DataTable.isDataTable('.table')) {
          $('.table').DataTable().destroy();
        }

        // Insertamos las filas generadas en el tbody de la tabla
        $('.table tbody').html(Html);

        // Re-inicializar DataTable
        $('.table').DataTable({
          "searching": true,  // Habilitar búsqueda
          "paging": true,     // Habilitar paginación
          "info": true        // Mostrar información
        });

        // Añadir event listener para cuando el switch cambie
        $('.status').on('change', function() {
          let Id = $(this).data('id');   // Obtener el ID del usuario
          let newStatus = $(this).is(':checked') ? 1 : 0;  // Obtener el nuevo estado

          // Llamar a la función para actualizar el estado
          updateStatus(Id, newStatus,'companies_software');
        });

        // Añadir event listener para cuando se haga clic en el nombre del rol
        $('.edit').on('click', function() {
          let Id = $(this).data('id');    // Obtener el ID del usuario
          getCompanyInfo(Id);
        });

      } else {
        alert(response.error);
      }
    }
  });
}

function load_select_referral_sources(selectedId = 0) {
    selectedId = parseInt(selectedId) || 0;
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'load_referral_sources'
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let html = '<option value="" disabled selected>Select a referral source</option>';
                response.data.forEach(source => {
                
                    if (selectedId !== 0 && selectedId == source.id) {
                       
                        html += `<option value="${source.id}" selected>${source.name}</option>`;
                    } else {
                        
                        html += `<option value="${source.id}">${source.name}</option>`;
                    }
                });
                $('#referral-source').html(html);
            } else {
                alert(response.error);
            }
        }
    });
}

function load_order_view() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (!orderId) {
        alert('No order ID specified');
        return;
    } else {
        $('#order_view_idOrder').html(orderId);
    }
    
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_order_info',
            order_id: orderId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const order = response.data;
                
                // Cargar los selects con los valores seleccionados
                load_select_transport_type(order.transport_type_id, '#transport-type');
                load_select_user(order.assigned_user_id,'#select_assigned_user');
                load_select_referral_sources(order.order_referral_source_id);
               
                // Obtener y cargar el equipo del usuario asignado
                if (order.assigned_user_id) {
                    $.ajax({
                        type: "POST",
                        url: "../dist/php/services.php",
                        data: {
                            option: 'get_user_team',
                            user_id: order.assigned_user_id
                        },
                        dataType: "json",
                        success: function(teamResponse) {
                            if (teamResponse.error === '' && teamResponse.data) {
                                load_select_team(teamResponse.data.id, '#select_assigned_team');
                            } else {
                                load_select_team(0, '#select_assigned_team');
                            }
                        }
                    });
                }

                // Llenar los campos con los datos disponibles
                $('#order-created').val(order.creation_date);
                $('#order-status').val(order.status);
                $('#first-available-pickup-date').val(order.pickup_date);
                
                // Información financiera
                $('#total_tariff').val('$' + order.total_tariff);
                $('#carrier_pay').val('$' + order.carrier_pay);
                $('#select_carrier_pay').val(order.carrier_pay_terms).trigger('change');;
                $('#broker_pay').val('$' + order.broker_fee);
                $('#broker_fee_terms').val(order.broker_fee_terms).trigger('change');;
                $('#wrecker_pay').val('$' + order.wrecker_fee);
                $('#other_pay').val('$' + order.other_fee);
                $('#special_terms').val(order.special_terms);
                
                // Información del cliente
                $('#customer-name').text(order.customer_name || '');
                $('#customer-phone').text(order.customer_phone || '');
                $('#customer-email').text(order.customer_email || '');
                
                // Información de origen
                $('#origin-contact').text(order.origin_contact_name || '');
                $('#origin-address').text(order.origin_address || '');
                $('#origin-city').text(order.origin_city || '');
                $('#origin-state').text(order.origin_state || '');
                $('#origin-postal-code').text(order.origin_contact_postal_code || '');
                
                // Información de destino
                $('#destination-contact').text(order.destination_contact_name || '');
                $('#destination-address').text(order.destination_address || '');
                $('#destination-city').text(order.destination_city || '');
                $('#destination-state').text(order.destination_state || '');
                $('#destination-postal-code').text(order.destination_contact_postal_code || '');

                // Información del cliente (campos deshabilitados)
                $('#customer_name').val(order.customer_name || '').prop('disabled', true);
                $('#customer_phone').val(order.customer_phone || '').prop('disabled', true);
                $('#customer_email').val(order.customer_email || '').prop('disabled', true);
                $('#saved_cc').val(order.customer_saved_cc || '').prop('disabled', true);
                
                // Mantener el select del cliente deshabilitado también si existe
                $('#select_customer').val(order.customer_name).prop('disabled', true).trigger('change');
                
            } else {
                alert(response.error);
            }
        },
        error: function(xhr, status, error) {
            alert('Error loading order data: ' + error);
        }
    });
}

/*
function load_order_view() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (!orderId) {
        alert('No order ID specified');
        return;
    }else{
        $('#order_view_idOrder').html(orderId);
    }
    
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_order_info',
            order_id: orderId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                const order = response.data;
                
                // Cargar los selects con los valores seleccionados
                load_select_transport_type(order.transport_type_id, '#transport-type');
                load_select_user(order.assigned_user_id,'#select_assigned_user');
                console.log('Referral Source ID: '+order.order_referral_source_id);
                load_select_referral_sources(order.order_referral_source_id);
               
                 // Obtener y cargar el equipo del usuario asignado
                
                if (order.assigned_user_id) {
                    
                    $.ajax({
                        type: "POST",
                        url: "../dist/php/services.php",
                        data: {
                            option: 'get_user_team',
                            user_id: order.assigned_user_id
                        },
                        dataType: "json",
                        success: function(teamResponse) {
                            
                            if (teamResponse.error === '' && teamResponse.data) {
                                load_select_team(teamResponse.data.id, '#select_assigned_team');
                                
                            }else{
                                load_select_team(0, '#select_assigned_team');
                            }
                        }
                    });
                }

                // Llenar los campos con los datos disponibles
                //console.log(order.creation_date);
                $('#order-created').val(order.creation_date);
                $('#order-status').val(order.status);
                $('#first-available-pickup-date').val(order.pickup_date);
                
                // Información del cliente
                $('#customer-name').text(order.customer_name || '');
                $('#customer-phone').text(order.customer_phone || '');
                $('#customer-email').text(order.customer_email || '');
                
                // Información de origen
                $('#origin-contact').text(order.origin_contact_name || '');
                $('#origin-address').text(order.origin_address || '');
                $('#origin-city').text(order.origin_city || '');
                $('#origin-state').text(order.origin_state || '');
                $('#origin-postal-code').text(order.origin_contact_postal_code || '');
                
                // Información de destino
                $('#destination-contact').text(order.destination_contact_name || '');
                $('#destination-address').text(order.destination_address || '');
                $('#destination-city').text(order.destination_city || '');
                $('#destination-state').text(order.destination_state || '');
                $('#destination-postal-code').text(order.destination_contact_postal_code || '');
                
            } else {
                alert(response.error);
            }
        },
        error: function(xhr, status, error) {
            alert('Error loading order data: ' + error);
        }
    });
}
*/

// Función para cargar los datos de global search al iniciar.
function load_global_search() {
    let table = $('#example1').DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "buttons": ["csv", "excel", "pdf", "print", "colvis"]
    });

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'load_global_search'
        },
        dataType: "json",
        beforeSend: function() {
            $('.loader').show();
        },
        success: function(response) {
            if (response.error === '') {
                table.clear().draw();
                
                response.data.forEach(function(order) {
                    table.row.add([
                        `<a href="order_view.html?id=${order.id}">${order.id}</a>`,
                        order.type,
                        order.date_created,
                        order.status,
                        order.customer_name,
                        order.phone,
                        order.customer_email,
                        order.customer_vehicles
                    ]).draw(false);
                });

                table.buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
                $('.loader').hide();
            }
        }
    });
}

function save_new_order1_and_2(){
  // Recuperar los datos de sessionStorage
  var storedData = sessionStorage.getItem('newOrderData');

  if(storedData) {
    // Parsear el string JSON a un objeto
    var formData = JSON.parse(storedData);

    // Usar los datos para llenar los campos o para lo que necesites
    //console.log(formData);

    // Ejemplo: Mostrar el nombre en un campo de la nueva página
    //console.log('Teléfono: ' + formData.phone);
  } else {
    console.log("No data found in sessionStorage");
  }

  var newData = {
    origin_saved_contact: $('#contact_origin').val(),
    origin_auction_site: $('#action_site_origin').val(),
    origin_terminal: $('#terminal_origin').val(),
    origin_type: $('#origin_type_origin').val(),
    origin_address: $('#origin_address1').val(),
    origin_address2: $('#origin_address2').val(),
    origin_city: $('#origin_city_txt').val(),
    origin_state: $('#origin_state_txt').val(),
    origin_contact_postal_code: $('#origin_postal_code_txt').val(),
    origin_country: $('#origin_country_txt').val(),
    origin_contact_name: $('#origin_contact_name_txt').val(),
    origin_contact_phone_1: $('#origin_contact_phone1_txt').val(),
    origin_contact_email: $('#origin_email_txt').val(),
    origin_contact_phone_2: $('#origin_contact_phone2_txt').val(),
    origin_contact_phone_cell: $('#origin_contact_phone_cell_txt').val(),
    origin_company_name: $('#origin_company_name_txt').val(),
    destination_saved_contact: $('#destination_contact').val(),
    destination_auction_site: $('#destination_auction_site').val(),
    destination_terminal: $('#destination_terminal').val(),
    destination_type: $('#destination_origin_type').val(),
    destination_address: $('#destination_address1_txt').val(),
    destination_address2: $('#destination_address2_txt').val(),
    destination_city: $('#destination_city_txt').val(),
    destination_state: $('#destination_state_txt').val(),
    destination_contact_postal_code: $('#destination_postal_code_txt').val(),
    destination_country: $('#destination_country_txt').val(),
    destination_contact_name: $('#destination_contact_name_txt').val(),
    destination_contact_phone_1: $('#destination_contact_phone1_txt').val(),
    destination_contact_email: $('#destination_email_txt').val(),
    destination_contact_phone_2: $('#destination_contact_phone2_txt').val(),
    destination_contact_phone_cell: $('#destination_contact_phone_cell_txt').val(),
    destination_company_name: $('#destination_company_name_txt').val()
  };

  //newData = JSON.stringify(newData);
  //console.log(newData);
  //
  // Merge storedData with newData
  //var finalData = $.extend({}, storedData, newData);
  var finalData = Object.assign({}, formData, newData);

  //console.log(finalData);

  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'save_new_order',
      phone: finalData.phone,
      first_available_pickup_date: finalData.first_available_pickup_date,
      transport_type: finalData.transport_type,
      assigned_user: finalData.assigned_user,
      origin_saved_contact: finalData.origin_saved_contact,
      origin_auction_site: finalData.origin_auction_site,
      origin_terminal: finalData.origin_terminal,
      origin_type: finalData.origin_type,
      origin_address: finalData.origin_address,
      origin_address2: finalData.origin_address2,
      origin_city: finalData.origin_city,
      origin_state: finalData.origin_state,
      origin_contact_postal_code: finalData.origin_contact_postal_code,
      origin_country: finalData.origin_country,
      origin_contact_name: finalData.origin_contact_name,
      origin_contact_phone_1: finalData.origin_contact_phone_1,
      origin_contact_email: finalData.origin_contact_email,
      origin_contact_phone_2: finalData.origin_contact_phone_2,
      origin_contact_phone_cell: finalData.origin_contact_phone_cell,
      origin_company_name: finalData.origin_company_name,
      destination_saved_contact: finalData.destination_saved_contact,
      destination_auction_site: finalData.destination_auction_site,
      destination_terminal: finalData.destination_terminal,
      destination_type: finalData.destination_type,
      destination_address: finalData.destination_address,
      destination_address2: finalData.destination_address2,
      destination_city: finalData.destination_city,
      destination_state: finalData.destination_state,
      destination_contact_postal_code: finalData.destination_contact_postal_code,
      destination_country: finalData.destination_country,
      destination_contact_name: finalData.destination_contact_name,
      destination_contact_phone_1: finalData.destination_contact_phone_1,
      destination_contact_email: finalData.destination_contact_email,
      destination_contact_phone_2: finalData.destination_contact_phone_2,
      destination_contact_phone_cell: finalData.destination_contact_phone_cell,
      destination_company_name: finalData.destination_company_name
    },
    dataType: "json",
    beforeSend: function (){
      $('.loader').show();
    },
    success: function(response) {
      if (response.error === '') {
        $('.loader').hide();
        alert(response.message);
        window.location.replace('new_order1.html');
      }
    }
  });

}

// Función para cargar los datos del país segun su zipcode.
function get_origin_country(zipcode) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_zip_info',
      zipcode: zipcode
    },
    dataType: "json",
    beforeSend: function (){
      $('.loader').show();
    },
    success: function(response) {
      if (response.error === '') {
        $('#origin_country_txt').val(decodeTildes(response.data.country));
        $('.loader').hide();
      }
    }
  });
}

// Función para cargar los datos del país segun su zipcode.
function get_destination_country(zipcode) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_zip_info',
      zipcode: zipcode
    },
    dataType: "json",
    beforeSend: function (){
      $('.loader').show();
    },
    success: function(response) {
      if (response.error === '') {
        $('#destination_country_txt').val(decodeTildes(response.data.country));
        $('.loader').hide();
      }
    }
  });
}

// Función para cargar los datos de zipcode segun el zipcode segun su zipcode.
function get_origin_zip_code(zipcode) {
  $('#origin_postal_code_txt').val(zipcode);
}

// Función para cargar los datos de zipcode segun el zipcode segun su zipcode.
function get_destination_zip_code(zipcode) {
  $('#destination_postal_code_txt').val(zipcode);
}

// Función para cargar los datos de el estado segun su zipcode.
function get_origin_state(zipcode) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_zip_info',
      zipcode: zipcode
    },
    dataType: "json",
    beforeSend: function (){
      $('.loader').show();
    },
    success: function(response) {
      if (response.error === '') {
        $('#origin_state_txt').val(decodeTildes(response.data.state));
        $('.loader').hide();
      }
    }
  });
}

// Función para cargar los datos de el estado segun su zipcode.
function get_destination_state(zipcode) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_zip_info',
      zipcode: zipcode
    },
    dataType: "json",
    beforeSend: function (){
      $('.loader').show();
    },
    success: function(response) {
      if (response.error === '') {
        $('#destination_state_txt').val(decodeTildes(response.data.state));
        $('.loader').hide();
      }
    }
  });
}

// Función para cargar los datos de la ciudad segun su zipcode.
function get_origin_city(zipcode) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_zip_info',
      zipcode: zipcode
    },
    dataType: "json",
    beforeSend: function (){
      $('.loader').show();
    },
    success: function(response) {
      if (response.error === '') {
        $('#origin_city_txt').val(decodeTildes(response.data.city));
        $('.loader').hide();
      }
    }
  });
}

// Función para cargar los datos de la ciudad segun su zipcode.
function get_destination_city(zipcode) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_zip_info',
      zipcode: zipcode
    },
    dataType: "json",
    beforeSend: function (){
      $('.loader').show();
    },
    success: function(response) {
      if (response.error === '') {
        $('#destination_city_txt').val(decodeTildes(response.data.city));
        $('.loader').hide();
      }
    }
  });
}

function load_new_order1(){
  load_select_phones();
  load_select_transport_type();
  load_select_user();
  $('#new_order1_phone').change(function(){
    var customerId = $('#new_order1_phone').val();
    get_new_order_customer_info(customerId);
  });
}

function load_new_order2(){

  load_select_zip_code();
  //load_select_city();

}

// Función para decodificar los caracteres mal formateados
function decodeTildes(text) {
    return text
        .replace(/Ã¡/g, 'á')
        .replace(/Ã©/g, 'é')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã\u0081/g, 'Á')
        .replace(/Ã\u0089/g, 'É')
        .replace(/Ã\u008d/g, 'Í')
        .replace(/Ã\u0093/g, 'Ó')
        .replace(/Ã\u009a/g, 'Ú');
}

// Función para cargar SELECT zip codes

function load_select_zip_code(id = 0) {
  var zipHtml = '';
  var cityHtml = '';

  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_zip_codes'
    },
    dataType: "json",
    beforeSend: function (){
      $('.loader').show();
    },
    success: function(response) {
      //console.log(response);  // Añade esto para ver la respuesta completa
      if (response.error === '') {

        if (id === 0){
          zipHtml += '<option value="" disabled selected>Select a zip code</option>';
          cityHtml += '<option value="" disabled selected>Select a city</option>';
        }
        response.data.forEach(zipcode => {

          if (id !== 0 && id === zipcode.zip){
            zipHtml += `<option value="${zipcode.zip}" selected>${zipcode.zip}</option>`;  
          }else{
            zipHtml += `<option value="${zipcode.zip}">${zipcode.zip}</option>`;  
          }

          if (id !== 0 && id === zipcode.zip){
            cityHtml += '<option value="'+zipcode.zip+'" selected>'+decodeTildes(zipcode.city)+'</option>';  
          }else{
            cityHtml += '<option value="'+zipcode.zip+'">'+decodeTildes(zipcode.city)+'</option>';
          }
          
        });
        $('#zip_origin').html(zipHtml);
        $('#destinantion_zip').html(zipHtml);
        $('#zip_origin').change(function(){
          //load_select_city($('#zip_origin').val());
          get_origin_city($('#zip_origin').val());
          get_origin_state($('#zip_origin').val());
          get_origin_zip_code($('#zip_origin').val());
          get_origin_country($('#zip_origin').val());
        });
        $('#destinantion_zip').change(function(){
          get_destination_city($('#destinantion_zip').val());
          get_destination_state($('#destinantion_zip').val());
          get_destination_zip_code($('#destinantion_zip').val());
          get_destination_country($('#destinantion_zip').val());
        });

        $('#city_origin').html(cityHtml);
        $('#city_origin').change(function(){
          get_origin_city($('#city_origin').val());
          get_origin_state($('#city_origin').val());
          get_origin_zip_code($('#city_origin').val());
          get_origin_country($('#city_origin').val());
        });
        $('#destination_city').html(cityHtml);
        $('#destination_city').change(function(){
          get_destination_city($('#destination_city').val());
          get_destination_state($('#destination_city').val());
          get_destination_zip_code($('#destination_city').val());
          get_destination_country($('#destination_city').val());
        });

      } else {
        alert(response.error);
      }
      $('.loader').hide();
    }
  });
}

// Función para cargar los información del customer de New Order.
function get_new_order_customer_info(customerId) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_customer_info',
      customer_id: customerId
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        
        $('#name').val(response.data.first_name + ' ' + response.data.last_name);
        $('#company_name').val(response.data.company_name);

      } else {
        alert(response.error);
      }
    }
  });
}

// En core.js:

function load_select_team(selectedId = 0, selectElementId = '#customer-team-select') {
    // Convertir el selectedId a número si es string
    selectedId = parseInt(selectedId) || 0;
    
    //console.log('selectedId: ' + selectedId + ' selectElementId: ' + selectElementId);
    $.ajax({
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'load_teams_select2'
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let teamHtml = '';
                
                // Solo agregar la opción "Select" si no hay ID seleccionado
                if (selectedId === 0) {
                    teamHtml += '<option value="" disabled selected>Select a team</option>';
                }
                
                response.data.forEach(team => {
                    // Asegurarse de que el id sea número para la comparación
                    const teamId = parseInt(team.id);
                
                    if (team.status == 1) {
                        teamHtml += `<option value="${teamId}" 
                            ${selectedId === teamId ? 'selected' : ''}>
                            ${team.name}
                        </option>`;
                    }
           
                });

                // Actualizar todos los posibles selects de equipos
                const possibleSelectIds = [
                    '#customer-team-select',  // Para new_order1.html
                    '#select_assigned_team',  // Para order_view.html
                    '#team-assigned',             // Otro posible ID
                    selectElementId               // ID personalizado si se proporciona
                ];

                // Eliminar duplicados y valores vacíos
                const uniqueSelectIds = [...new Set(possibleSelectIds.filter(id => id))];
                
                uniqueSelectIds.forEach(selectId => {
                    const $select = $(selectId);
                    if ($select.length) {
                        $select.html(teamHtml);
                    }
                });

            } else {
                alert(response.error);
            }
        }
    });
}

function load_select_user(selectedId = 0, selectElementId = '#new_order1_assigned_user') {
    // Convertir el selectedId a número si es string
    selectedId = parseInt(selectedId) || 0;
    
    $.ajax({
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'load_users'
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let userHtml = '';
                
                // Solo agregar la opción "Select" si no hay ID seleccionado
                if (selectedId === 0) {
                    userHtml += '<option value="" disabled selected>Select a user</option>';
                }
                
                response.data.forEach(user => {
                    // Asegurarse de que el id sea número para la comparación
                    const userId = parseInt(user.id);
                    
                    if (user.status == 1) {
                        userHtml += `<option value="${userId}" 
                            ${selectedId === userId ? 'selected' : ''}>
                            ${user.name} 
                        </option>`;
                    }
                });

                // Actualizar todos los posibles selects de usuarios
                const possibleSelectIds = [
                    '#new_order1_assigned_user',  // Para new_order1.html
                    '#assigned-user',             // Para order_view.html
                    '#user-assigned',             // Otro posible ID
                    selectElementId               // ID personalizado si se proporciona
                ];

                // Eliminar duplicados y valores vacíos
                const uniqueSelectIds = [...new Set(possibleSelectIds.filter(id => id))];
                
                uniqueSelectIds.forEach(selectId => {
                    const $select = $(selectId);
                    if ($select.length) {
                        $select.html(userHtml);
                    }
                });

            } else {
                alert(response.error);
            }
        }
    });
}

// Función para cargar SELECT users
/*
function load_select_user(id = 0) {
  var userHtml = '';
  var fullName = '';
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_users'
    },
    dataType: "json",
    success: function(response) {
      //console.log(response);  // Añade esto para ver la respuesta completa
      if (response.error === '') {

        if (id === 0){
          userHtml += '<option value="" disabled selected>Select a user</option>';
        }
        response.data.forEach(user => {
          //fullName = phone.name + ' ' + phone.last_name;
          if (user.status == 1){

            if (id !== 0 && id === user.id){
              userHtml += `<option value="${user.id}" selected>${user.name}</option>`;  
            }else{
              userHtml += `<option value="${user.id}">${user.name}</option>`;  
            }
          }
          
        });
        $('#new_order1_assigned_user').html(userHtml);
      } else {
        alert(response.error);
      }
    }
  });
}
*/

// Función para cargar SELECT tranport_type
function load_select_transport_type(selectedId = 0, selectElementId = '#new_order1_tranport_type') {
    // Convertir el selectedId a número si es string
    selectedId = parseInt(selectedId) || 0;
    
    $.ajax({
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'load_transport_type'
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                let transportTypeHtml = '';
                
                // Solo agregar la opción "Select" si no hay ID seleccionado
                if (selectedId === 0) {
                    transportTypeHtml += '<option value="" disabled selected>Select a transport type</option>';
                }
                
                response.data.forEach(transportType => {
                    // Asegurarse de que el id sea número para la comparación
                    const typeId = parseInt(transportType.id);
                    
                    if (transportType.status == 1) {
                        transportTypeHtml += `<option value="${typeId}" 
                            ${selectedId === typeId ? 'selected' : ''}>
                            ${transportType.name}
                        </option>`;
                    }
                });

                // Actualizar todos los posibles selects de tipo de transporte
                const possibleSelectIds = [
                    '#new_order1_tranport_type',  // Para new_order1.html
                    '#transport-type',            // Para order_view.html
                    '#order-transport-type'       // Otro posible ID
                ];

                possibleSelectIds.forEach(selectId => {
                    const $select = $(selectId);
                    if ($select.length) {
                        $select.html(transportTypeHtml);
                    }
                });

            } else {
                alert(response.error);
            }
        }
    });
}
/*
function load_select_transport_type(id = 0) {
  var transportTypeHtml = '';
  var fullName = '';
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_transport_type'
    },
    dataType: "json",
    success: function(response) {
      //console.log(response);  // Añade esto para ver la respuesta completa
      if (response.error === '') {

        if (id === 0){
          transportTypeHtml += '<option value="" disabled selected>Select a transport type</option>';
        }
        response.data.forEach(transportType => {
          //fullName = phone.name + ' ' + phone.last_name;
          if (transportType.status == 1){

            if (id !== 0 && id === transportType.id){
              transportTypeHtml += `<option value="${transportType.id}" selected>${transportType.name}</option>`;  
            }else{
              transportTypeHtml += `<option value="${transportType.id}">${transportType.name}</option>`;  
            }
          }
          
        });
        //console.log(transportTypeHtml);
        $('#new_order1_tranport_type').html(transportTypeHtml);
      } else {
        alert(response.error);
      }
    }
  });
}
*/
// Función para cargar SELECT phones
function load_select_phones(id = 0) {
  var phonesHtml = '';
  var fullName = '';
  $.ajax({
    contentType: "application/x-www-form-urlencoded", 
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_phones'
    },
    dataType: "json",
    success: function(response) {
      //console.log(response);  // Añade esto para ver la respuesta completa
      if (response.error === '') {

        if (id === 0){
          phonesHtml += '<option value="" disabled selected>Select a phone</option>';
        }
    
        response.data.forEach(phone => {
            const selected = (id !== 0 && id === phone.id) ? 'selected' : '';
            phonesHtml += `<option value="${phone.id}" ${selected}>${phone.phone1} - ${phone.first_name} ${phone.last_name}</option>`;
        });

        $('#new_order1_phone').html(phonesHtml);
      } else {
        alert(response.error);
      }
    }
  });
}

// Función para cargar los usuarios en sus campos de users maintenance.
/*
function get_user_info(userId) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'get_user_info',
      user_id: userId
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        // Primero, carga todos los roles en el select
        load_select_roles(response.data.role);
        $('#user-name-txt').val(response.data.name);
        $('#user-lastname-txt').val(response.data.last_name);
        $('#user-email-txt').val(response.data.email);

        // Store the user ID for updating purposes
        $('#btn-save-users-maintenance').data('user-id', userId);
      } else {
        alert(response.error);
      }
    }
  });
}
*/
function get_user_info(userId) {
    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'get_user_info',
            user_id: userId
        },
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                load_select_roles(response.data.role);
                $('#user-name-txt').val(response.data.name);
                $('#user-lastname-txt').val(response.data.last_name);
                $('#user-email-txt').val(response.data.email);
                $('#user-start-date').val(response.data.start_date);
                $('#user-end-date').val(response.data.end_date);
                $('#user-weekly-goal').val(response.data.weekly_goal);
                $('#btn-save-users-maintenance').data('user-id', userId);
            } else {
                alert(response.error);
            }
        }
    });
}

// Función para cargar SELECT roles
function load_select_roles(idr = 0) {
  var rolesHtml = '';
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_roles'
    },
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        if (idr === 0){
          rolesHtml += '<option value="" disabled selected>Select a role</option>';
        }
        response.data.forEach(role => {
          //alert(role.status);
          if (role.status == 1){
            if (idr !== 0 && idr === role.id){
              rolesHtml += `<option value="${role.id}" selected>${role.role_name}</option>`;  
            }else{
              rolesHtml += `<option value="${role.id}">${role.role_name}</option>`;  
            }
          }
          
        });
        $('#user-select-role').html(rolesHtml);
      } else {
        alert(response.error);
      }
    }
  });
}

/*
function users_page_save_button() {
  var userName = $('#user-name-txt').val();
  var userLastName = $('#user-lastname-txt').val();
  var userEmail = $('#user-email-txt').val();
  var userPassword = $('#user-password-txt').val();
  var userConfirmPassword = $('#user-confirmpassword-txt').val();
  var userRole = $('#user-select-role').val();
  var userId = $('#btn-save-users-maintenance').data('user-id'); // Obtener el ID del usuario para determinar si es un update

  if (userName === '' || userLastName === '' || userEmail === '' || userRole === null) {
    alert('All fields must be filled!');
    return;
  }

  if ((userPassword !== '' || userConfirmPassword !== '') && userPassword !== userConfirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  var ajaxData = {
    option: userId ? 'update_user' : 'save_user', // Si existe userId, es un update, de lo contrario es un insert
    user_id: userId || '', // Solo enviar el ID si es un update
    user_name: userName,
    user_lastname: userLastName,
    user_email: userEmail,
    user_role: userRole
  };

  // Solo enviar las contraseñas si se van a actualizar
  if (userPassword !== '' && userConfirmPassword !== '') {
    ajaxData.user_password = userPassword;
  }

  $.ajax({
    type: "POST",
    url: "../dist/php/services.php",
    data: ajaxData,
    dataType: "json",
    success: function(response) {
      if (response.error === '') {
        alert(response.message);
        window.location.replace('m_users.html');
      } else {
        alert(response.error);
      }
    }
  });
}

*/

function users_page_save_button() {
    var userName = $('#user-name-txt').val();
    var userLastName = $('#user-lastname-txt').val();
    var userEmail = $('#user-email-txt').val();
    var userPassword = $('#user-password-txt').val();
    var userConfirmPassword = $('#user-confirmpassword-txt').val();
    var userRole = $('#user-select-role').val();
    var userId = $('#btn-save-users-maintenance').data('user-id');
    var startDate = $('#user-start-date').val();
    var endDate = $('#user-end-date').val();
    var weeklyGoal = $('#user-weekly-goal').val();

    if (userName === '' || userLastName === '' || userEmail === '' || userRole === null || 
        startDate === '' || weeklyGoal === '') {
        alert('All fields must be filled!');
        return;
    }

    if ((userPassword !== '' || userConfirmPassword !== '') && userPassword !== userConfirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    var ajaxData = {
        option: userId ? 'update_user' : 'save_user',
        user_id: userId || '',
        user_name: userName,
        user_lastname: userLastName,
        user_email: userEmail,
        user_role: userRole,
        start_date: startDate,
        end_date: endDate,
        weekly_goal: weeklyGoal
    };

    if (userPassword !== '' && userConfirmPassword !== '') {
        ajaxData.user_password = userPassword;
    }

    $.ajax({
        type: "POST",
        url: "../dist/php/services.php",
        data: ajaxData,
        dataType: "json",
        success: function(response) {
            if (response.error === '') {
                alert(response.message);
                window.location.replace('m_users.html');
            } else {
                alert(response.error);
            }
        }
    });
}

function updateUserStatus(userId, newStatus) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: ({
      option: 'update_user_status',
      user_id: userId,
      status: newStatus
    }),
    dataType: "json",        
    success: function(response) {
      if(response.error == ''){
        alert(response.message);
      } else {
        alert(response.error);
      }
    },
    error: function() {
      alert('Error al actualizar el estado del rol.');
    }
  });
}

function load_users() {

  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: ({
        option: 'load_users'    
      }),
    dataType: "json",
    success: function (response) {
      if (response.error === '') {
        let usersHtml = '';
        response.data.forEach(user => {
          const checked = user.status == 1 ? 'checked' : '';
          usersHtml += `
            <tr>
              <td>${user.id}</td>
              <td><a href="#" class="user-edit" data-id="${user.id}">${user.name}</a></td>
              <td>${user.date_created}</td>
              <td>${user.role}</td>
              <td>
                <div class="form-group">
                  <div class="custom-control custom-switch custom-switch-on-success">
                    <input type="checkbox" class="custom-control-input user-status" id="customSwitch${user.id}" data-id="${user.id}" ${checked}>
                    <label class="custom-control-label" for="customSwitch${user.id}"></label>
                  </div>
                </div>
              </td>
            </tr>`;
        });
        //$('tbody').html(usersHtml);

        // Destruir DataTable existente si ya está inicializada
        if ($.fn.DataTable.isDataTable('.table')) {
          $('.table').DataTable().destroy();
        }

        // Insertamos las filas generadas en el tbody de la tabla
        $('.table tbody').html(usersHtml);

        // Re-inicializar DataTable
        $('.table').DataTable({
          "searching": true,  // Habilitar búsqueda
          "paging": true,     // Habilitar paginación
          "info": true        // Mostrar información
        });

        let rolesHtml = '<option value="" disabled selected>Select a role</option>';
        response.roles.forEach(role => {
          rolesHtml += `<option value="${role.id_roles}">${role.name}</option>`;
        });
        $('#user-select-role').html(rolesHtml);

        // Añadir event listener para cuando el switch cambie
        $('.user-status').on('change', function() {
          let userId = $(this).data('id');   // Obtener el ID del usuario
          let newStatus = $(this).is(':checked') ? 1 : 0;  // Obtener el nuevo estado

          // Llamar a la función para actualizar el estado
          updateUserStatus(userId, newStatus);
        });

        // Añadir event listener para cuando se haga clic en el nombre del usuario
        $('.user-edit').on('click', function() {
          let userId = $(this).data('id');    // Obtener el ID del usuario
          get_user_info(userId);
        });

        // Añadir event listener para cuando se haga clic en el nombre del usuario
        $('#DataTables_Table_0_paginate').click(function(){
            $('.user-edit').click(function(){
                let userId = $(this).data('id');    // Obtener el ID del usuario
                get_user_info(userId);
            });

            $('.user-status').on('change', function() {
              let userId = $(this).data('id');   // Obtener el ID del usuario
              let newStatus = $(this).is(':checked') ? 1 : 0;  // Obtener el nuevo estado

              // Llamar a la función para actualizar el estado
              updateUserStatus(userId, newStatus);
            });
        }); 

      } else {
        alert(response.error);
      }
    }
  });
}

function updateRoleStatus(roleId, newStatus) {
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: ({
      option: 'update_role_status',
      role_id: roleId,
      status: newStatus
    }),
    dataType: "json",        
    success: function(response) {
      if(response.error == ''){
        alert(response.message);
      } else {
        alert(response.error);
      }
    },
    error: function() {
      alert('Error al actualizar el estado del rol.');
    }
  });
}

function load_roles(){
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: ({
      option: 'load_roles'             
    }),
    dataType: "json",        
    success: function(r) {                                                   
      if(r.error == ''){
        let rolesData = r.data;  // Array con los datos de roles
        let tableBody = '';

        // Iteramos sobre los datos recibidos
        $.each(rolesData, function(index, role) {
          let checked = role.status == 1 ? 'checked' : '';
          tableBody += `
            <tr>
              <td>${role.id}</td>
              <td><a href="#" class="role-name" data-id="${role.id}">${role.role_name}</a></td>
              <td>${role.last_modified}</td>
              <td>
                <div class="form-group">
                  <div class="custom-control custom-switch custom-switch-on-success">
                    <input type="checkbox" class="custom-control-input switch-role-status" data-id="${role.id}" id="customSwitch${role.id}" ${checked}>
                    <label class="custom-control-label" for="customSwitch${role.id}"></label>
                  </div>
                </div>
              </td>
            </tr>
          `;
        });

        // Destruir DataTable existente si ya está inicializada
        if ($.fn.DataTable.isDataTable('.table')) {
          $('.table').DataTable().destroy();
        }

        // Insertamos las filas generadas en el tbody de la tabla
        $('.table tbody').html(tableBody);

        // Re-inicializar DataTable
        $('.table').DataTable({
          "searching": true,  // Habilitar búsqueda
          "paging": true,     // Habilitar paginación
          "info": true        // Mostrar información
        });

        // Event listeners
        $('.switch-role-status').on('change', function() {
          let roleId = $(this).data('id');
          let newStatus = $(this).is(':checked') ? 1 : 0;
          updateRoleStatus(roleId, newStatus);
        });

        $('.role-name').on('click', function() {
          let roleId = $(this).data('id');
          let roleName = $(this).text();
          $('#role-name-txt').val(roleName).data('role-id', roleId);
        });

      } else {
        alert(r.error);
        window.location.replace('../index.html');
      }
    },
    error: function() {
      alert('Error!');
    }
  });
}

function role_page_save_button(){
    var role_txt = $('#role-name-txt').val();
    var role_id = $('#role-name-txt').data('role-id'); // Obtener el ID del rol si existe

    if(role_txt == ''){
      alert('Role name can\'t be blank!');
    }else{
      $.ajax({
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        url: "../dist/php/services.php",
        data: {
            option: 'save_role',
            role_txt: role_txt,
            role_id: role_id || ''  // Si no hay ID, se envía una cadena vacía
        },
        dataType: "json",        
        success: function(r) {                                                   
            if(r.error == ''){
                alert(r.message);
                window.location.replace('m_roles.html');
            }else{
                alert(r.error);
                window.location.replace('index.html');
            }
        },
        error: function() {
            alert('Error saving the role.');
        }
      });
    }
}

function logout() {
  $.ajax({
      type: "POST",
      url: "dist/php/services.php",
      data: {
          option: 'logout'
      },
      dataType: "json",
      success: function(response) {
          localStorage.removeItem('user');
          window.location.replace('index.html');
      }
  });
}

function sign_in() {
  var email = $('#email').val();
  var pass = $('#password').val();

  if(email == '' || pass == ''){
      alert('You have to enter email and password!');
  } else {
      $.ajax({
          contentType: "application/x-www-form-urlencoded",
          type: "POST",
          url: "dist/php/services.php",
          data: {
              option: 'sign_in',
              email: email,
              pass: pass
          },
          dataType: "json",        
          success: function(response) {
              if(response.error == ''){
                  // Guardar información del usuario en localStorage si es necesario
                  if (response.user) {
                      localStorage.setItem('user', JSON.stringify(response.user));
                  }
                  
                  alert(response.message);
                  window.location.replace('dashboard.html');
              } else {
                  alert(response.error);
                  window.location.replace('index.html');
              }
          },
          error: function(xhr, status, error) {
              alert('Error en la conexión. Por favor, intente nuevamente.');
              console.error(error);
          }
      });
  }
}

function getBasePath() {
    const currentPath = window.location.pathname;
    return currentPath.includes('/pages/') ? '../' : '';
}

// Función mejorada para generar URLs correctas
function generateUrl(path) {
    const currentPath = window.location.pathname;
    const basePath = getBasePath();
    
    // Manejar casos especiales
    if (path === 'dashboard.html') {
        // Si estamos en /pages/ y queremos ir a dashboard
        return currentPath.includes('/pages/') ? '../dashboard.html' : 'dashboard.html';
    }
    
    // Si la URL ya incluye 'pages/' no la agregamos de nuevo
    if (path.startsWith('pages/')) {
        return `${basePath}${path}`;
    }
    
    // Para otros casos, agregamos 'pages/' si es necesario
    if (!path.startsWith('http') && !path.startsWith('dashboard.html')) {
        return `${basePath}pages/${path}`;
    }
    
    return `${basePath}${path}`;
}

function load_sidebar(n = 0) {
    const basePath = getBasePath();
    const baseUrl = `${basePath}dist/php/services.php`;
    
    //console.log('Current path:', window.location.pathname);
    //alert(window.location.pathname);
    //console.log('Base path:', basePath);
    //console.log('Loading sidebar from:', baseUrl);

    // Determinar si estamos en dashboard
    const isDashboard = window.location.pathname.endsWith('dashboard.html');
    const isIndex = window.location.pathname.endsWith('index.html');
    const isRoot = window.location.pathname.endsWith('/');
    
    $.ajax({
        type: "POST",
        url: baseUrl,
        data: { 
            option: 'load_sidebar',
            from_dashboard: isDashboard ? 'true' : 'false'  // Añadimos este parámetro
        },
        dataType: "json",
        beforeSend: function() {
            $("#left-nav-bar").html('<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading menu...</div>');
        },
        success: function(response) {
            //alert('Es index: '+ isIndex);
            //alert('Es root: '+ isRoot);
            //console.log('Sidebar response:', response);
            
            if (response.error === 'Session expired or not authenticated' && !isIndex && !isRoot) {
                //alert('entre al 1');
                handleSessionRedirect();
                console.log(response.redirect);
                window.location.replace(response.redirect);
                return;
            }
            
            if (response.error === 'Session expired' && !isIndex && !isRoot) {
                //alert('entre al 2');
                handleSessionRedirect();
                console.log(response.redirect);
                window.location.replace(response.redirect);
                return;
            }

            if (response.error === 'User session not found' && !isIndex && !isRoot) {
                //alert('entre al 3');
                handleSessionRedirect();
                console.log(response.redirect);
                window.location.replace(response.redirect);
                return;
            }
            
            if (response.error) {
                console.error('Error loading sidebar:', response.error);
                $("#left-nav-bar").html(`<div class="text-danger">Error: ${response.error}</div>`);
                return;
            }


            
            if (response.data && Array.isArray(response.data)) {
                const sidebarHtml = generateSidebarHtml(response.data);
                $("#left-nav-bar").html(sidebarHtml);
                initializeSidebarComponents();
            } else {
                console.error('Invalid sidebar data:', response);
                $("#left-nav-bar").html('<div class="text-danger">Error loading menu structure</div>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Ajax error:', {
                status: status,
                error: error,
                responseText: xhr.responseText,
                statusCode: xhr.status
            });
            
            if (xhr.status === 401 || xhr.status === 403) {
                handleSessionRedirect();
            }
        }
    });
}

function handleSessionRedirect() {
    const basePath = getBasePath();
    window.location.href = `${basePath}index.html`;
}

function generateSidebarHtml(menuItems) {
    if (!menuItems || !Array.isArray(menuItems)) {
        console.error('Invalid menu items:', menuItems);
        return '';
    }
    
    // Agrupar items por padre
    const menuGroups = menuItems.reduce((acc, item) => {
        if (!item.parent_id) {
            if (!acc.parents) acc.parents = [];
            acc.parents.push(item);
        } else {
            if (!acc.children) acc.children = {};
            if (!acc.children[item.parent_id]) acc.children[item.parent_id] = [];
            acc.children[item.parent_id].push(item);
        }
        return acc;
    }, {});

    let html = '';
    
    menuGroups.parents?.sort((a, b) => a.order_position - b.order_position)
        .forEach(parent => {
            // Generar URL correcta para el elemento padre
            const url = parent.url ? generateUrl(parent.url) : '#';
            
            if (menuGroups.children?.[parent.id]) {
                // Menú con submenús
                html += `
                    <li class="nav-item">
                        <a href="${url}" class="nav-link">
                            <i class="nav-icon ${parent.icon}"></i>
                            <p>
                                ${parent.name}
                                <i class="fas fa-angle-left right"></i>
                                ${menuGroups.children[parent.id].length > 0 ? 
                                    `<span class="badge badge-info right">${menuGroups.children[parent.id].length}</span>` : 
                                    ''}
                            </p>
                        </a>
                        <ul class="nav nav-treeview">
                            ${menuGroups.children[parent.id]
                                .sort((a, b) => a.order_position - b.order_position)
                                .map(child => {
                                    // Generar URL correcta para cada elemento hijo
                                    const childUrl = generateUrl(child.url);
                                    return `
                                        <li class="nav-item">
                                            <a href="${childUrl}" class="nav-link">
                                                <i class="${child.icon}"></i>
                                                <p>${child.name}</p>
                                            </a>
                                        </li>
                                    `;
                                }).join('')}
                        </ul>
                    </li>
                `;
            } else {
                // Menú sin submenús
                html += `
                    <li class="nav-item">
                        <a href="${url}" class="nav-link">
                            <i class="nav-icon ${parent.icon}"></i>
                            <p>${parent.name}</p>
                        </a>
                    </li>
                `;
            }
        });
    
    return html;
}

function initializeSidebarComponents() {
    // Marcar el elemento activo basado en la URL actual
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop();
    
    $('.nav-link').each(function() {
        const href = $(this).attr('href');
        if (href) {
            // Normalizar las rutas para la comparación
            const normalizedHref = href.replace('../', '').replace('pages/', '');
            const normalizedCurrent = currentFile;
            
            if (normalizedHref.endsWith(normalizedCurrent) || 
                currentPath.endsWith(normalizedHref) ||
                (currentFile === 'dashboard.html' && href.endsWith('dashboard.html'))) {
                $(this).addClass('active');
                $(this).parents('.nav-item').addClass('menu-open');
                $(this).parents('.nav-treeview').prev().addClass('active');
            }
        }
    });
}

function load_sidebar_dashboard() {
    // Usar la misma función pero con una ruta diferente para los archivos
    load_sidebar(1);
}
