$(function(){

    load_sidebar();

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
      referral_source: $('#referral_source').val(),
      assigned_user: $('#new_order1_assigned_user').val(),
      assigned_team: $('#new_order1_assigned_team').val()
    };

    // Convertir el objeto a un string JSON y guardarlo en sessionStorage
    sessionStorage.setItem('newOrderData', JSON.stringify(formData));

    // Redirigir a la siguiente página
    window.location.replace("new_order2.html");
  });
  //--FINISH button Next from new_order1.html
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

// Función para cargar los datos de global search al iniciar.
function load_global_search() {

   // Inicializamos la tabla
  let table = $('#example1').DataTable({
    "responsive": true,
    "lengthChange": false,
    "autoWidth": false,
    "buttons": ["csv", "excel", "pdf", "print", "colvis"]
  });

  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_global_search'
    },
    dataType: "json",
    beforeSend: function (){
      $('.loader').show();
    },
    success: function(response) {
      if (response.error === '') {
        // Limpiamos cualquier dato existente en la tabla
        table.clear().draw();

        // Iteramos sobre los datos recibidos y los agregamos a la tabla
        response.data.forEach(function (order) {
          table.row.add([
            `<a href="order_view.html">${order.id}</a>`,
            order.type,
            order.date_created,
            order.status,
            order.customer_name,
            order.phone,
            order.customer_email,
            order.customer_vehicles
          ]).draw(false);
        });

        // Volvemos a inicializar los botones (CSV, Excel, etc.)
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

  console.log(finalData);

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

/*
function load_new_order1(){
  load_select_phones();
  load_select_transport_type();
  load_select_user();
  $('#new_order1_phone').change(function(){
    var customerId = $('#new_order1_phone').val();
    get_new_order_customer_info(customerId);
  });
}
*/

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
  load_select_city();

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

// Función para cargar SELECT city
function load_select_city(id = 0) {
  var cityHtml = '';
  var fullName = '';
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_zip_codes'
    },
    dataType: "json",
    success: function(response) {
      //console.log(response);  // Añade esto para ver la respuesta completa
      if (response.error === '') {

        if (id === 0){
          cityHtml += '<option value="" disabled selected>Select a city</option>';
        }
        response.data.forEach(zipcode => {
          //fullName = phone.name + ' ' + phone.last_name;

          if (id !== 0 && id === zipcode.zip){
            cityHtml += '<option value="'+zipcode.zip+'" selected>'+decodeTildes(zipcode.city)+'</option>';  
          }else{
            cityHtml += '<option value="'+zipcode.zip+'">'+decodeTildes(zipcode.city)+'</option>';
          }
          
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
    }
  });
}

// Función para cargar SELECT zip codes
function load_select_zip_code(id = 0) {
  var zipHtml = '';
  var fullName = '';
  $.ajax({
    contentType: "application/x-www-form-urlencoded",
    type: "POST",
    url: "../dist/php/services.php",
    data: {
      option: 'load_zip_codes'
    },
    dataType: "json",
    success: function(response) {
      //console.log(response);  // Añade esto para ver la respuesta completa
      if (response.error === '') {

        if (id === 0){
          zipHtml += '<option value="" disabled selected>Select a zip code</option>';
        }
        response.data.forEach(zipcode => {
          //fullName = phone.name + ' ' + phone.last_name;

          if (id !== 0 && id === zipcode.zip){
            zipHtml += `<option value="${zipcode.zip}" selected>${zipcode.zip}</option>`;  
          }else{
            zipHtml += `<option value="${zipcode.zip}">${zipcode.zip}</option>`;  
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

      } else {
        alert(response.error);
      }
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
        
        $('#name').val(response.data.name + ' ' + response.data.last_name);
        $('#company_name').val(response.data.company);

      } else {
        alert(response.error);
      }
    }
  });
}

// Función para cargar SELECT users
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

// Función para cargar SELECT tranport_type
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
        $('#new_order1_tranport_type').html(transportTypeHtml);
      } else {
        alert(response.error);
      }
    }
  });
}

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
          //fullName = phone.name + ' ' + phone.last_name;
          if (phone.status == 1){

            if (id !== 0 && id === phone.id_customer){
              phonesHtml += `<option value="${phone.id_customer}" selected>${phone.phone}</option>`;  
            }else{
              phonesHtml += `<option value="${phone.id_customer}">${phone.phone}</option>`;  
            }
          }
          
        });
        $('#new_order1_phone').html(phonesHtml);
      } else {
        alert(response.error);
      }
    }
  });
}

// Función para cargar los usuarios en sus campos de users maintenance.
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

        // Añadir event listener para cuando se haga clic en el nombre del rol
        $('.user-edit').on('click', function() {
          let userId = $(this).data('id');    // Obtener el ID del usuario
          get_user_info(userId);
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

function sign_in(){
    
    var email = $('#email').val();
    var pass = $('#password').val();

    if(email == '' || pass == ''){
      alert('You have to enter email and password!');
    }else{
      $.ajax({
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        url: "dist/php/services.php",
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

function load_sidebar(n=0){
    if (n != 0) {
        load_sidebar_dashboard()
    }else{
        var sidebar_html = 
          '<li class="nav-item">'+
            '<a href="../dashboard.html" class="nav-link">'+
              '<i class="nav-icon fas fa-tachometer-alt"></i>'+
              '<p>'+
                'Dashboard'+
              '</p>'+
            '</a>'+
          '</li>'+
          '<li class="nav-item">'+
            '<a href="new_order1.html" class="nav-link">'+
              '<i class="nav-icon fas fa-table"></i>'+
              '<p>'+
                'New Order'+
              '</p>'+
            '</a>'+
         ' </li>'+
         ' <li class="nav-item">'+
            '<a href="global_search.html" class="nav-link ">'+
              '<i class="nav-icon fas fa-search"></i>'+
              '<p>'+
                'Global Search'+
             ' </p>'+
            '</a>'+
          '</li>'+
          '<li class="nav-item">'+
            '<a href="#" class="nav-link">'+
              '<i class="nav-icon fas fa-cog"></i>'+
              '<p>'+
                'Maintenance'+
               ' <i class="fas fa-angle-left right"></i>'+
                '<span class="badge badge-info right">5</span>'+
              '</p>'+
            '</a>'+
            '<ul class="nav nav-treeview">'+
              '<li class="nav-item">'+
                '<a href="m_companies.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon companies"></i>'+
                  '<p>Companies</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="m_clients.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon clients"></i>'+
                  '<p>Clients</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="m_users.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon users"></i>'+
                  '<p>Users</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="m_permissions.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon permissions"></i>'+
                  '<p>Permissions</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="m_roles.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon roles"></i>'+
                  '<p>Role</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="m_customer.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon customer"></i>'+
                  '<p>Customers</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="m_carriers.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon carriers"></i>'+
                  '<p>Carriers</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="m_referral_source.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon referral"></i>'+
                  '<p>Referral Source</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="m_teams.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon teams"></i>'+
                  '<p>Teams</p>'+
                '</a>'+
              '</li>'+
            '</ul>'+
          '</li>';
    $("#left-nav-bar").html(sidebar_html);
    }
}

function load_sidebar_dashboard(){

    var sidebar_html = 
          '<li class="nav-item">'+
            '<a href="#" class="nav-link">'+
              '<i class="nav-icon fas fa-tachometer-alt"></i>'+
              '<p>'+
                'Dashboard'+
              '</p>'+
            '</a>'+
          '</li>'+
          '<li class="nav-item">'+
            '<a href="pages/new_order1.html" class="nav-link">'+
              '<i class="nav-icon fas fa-table"></i>'+
              '<p>'+
                'New Order'+
              '</p>'+
            '</a>'+
         ' </li>'+
         ' <li class="nav-item">'+
            '<a href="pages/global_search.html" class="nav-link ">'+
              '<i class="nav-icon fas fa-search"></i>'+
              '<p>'+
                'Global Search'+
             ' </p>'+
            '</a>'+
          '</li>'+
          '<li class="nav-item">'+
            '<a href="#" class="nav-link">'+
              '<i class="nav-icon fas fa-cog"></i>'+
              '<p>'+
                'Maintenance'+
               ' <i class="fas fa-angle-left right"></i>'+
                '<span class="badge badge-info right">5</span>'+
              '</p>'+
            '</a>'+
            '<ul class="nav nav-treeview">'+
              '<li class="nav-item">'+
                '<a href="pages/m_companies.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon companies"></i>'+
                  '<p>Companies</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="pages/m_clients.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon clients"></i>'+
                  '<p>Clients</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="pages/m_users.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon users"></i>'+
                  '<p>Users</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="pages/m_permissions.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon permissions"></i>'+
                  '<p>Permissions</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="pages/m_roles.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon roles"></i>'+
                  '<p>Role</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="pages/m_customer.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon customer"></i>'+
                  '<p>Customers</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="pages/m_carriers.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon carriers"></i>'+
                  '<p>Carriers</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="pages/m_referral_source.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon referral"></i>'+
                  '<p>Referral Source</p>'+
                '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                '<a href="pages/m_teams.html" class="nav-link">'+
                  '<i class="far fa-circle nav-icon teams"></i>'+
                  '<p>Teams</p>'+
                '</a>'+
              '</li>'+
            '</ul>'+
          '</li>';
    $("#left-nav-bar").html(sidebar_html);
    
    
}